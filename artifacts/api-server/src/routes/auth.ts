import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { AuthLoginBody } from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "heave_salt").digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ── Standard login (username + password) ─────────────────────────────────────

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AuthLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  if (!user.active) {
    res.status(401).json({ error: "Account disabled" });
    return;
  }
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.insert(sessionsTable).values({ token, userId: user.id, expiresAt });
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      active: user.active,
      avatarUrl: user.avatarUrl ?? null,
      createdAt: user.createdAt.toISOString(),
    },
  });
});

// ── Session check ─────────────────────────────────────────────────────────────

router.get("/auth/me", async (req, res): Promise<void> => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.token, token));
  if (!session || session.expiresAt < new Date()) {
    res.status(401).json({ error: "Session expired" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    active: user.active,
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt.toISOString(),
  });
});

// ── Logout ────────────────────────────────────────────────────────────────────

router.post("/auth/logout", async (req, res): Promise<void> => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7);
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
  }
  res.json({ success: true });
});

// ── Discord OAuth2 ────────────────────────────────────────────────────────────

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

function getDiscordRedirectUri(req: import("express").Request): string {
  // APP_URL is set explicitly on Render/production. Falls back to Replit dev domain, then request host.
  const base =
    process.env.APP_URL ??
    (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null) ??
    `${req.protocol}://${req.get("host")}`;
  return `${base}/api/auth/discord/callback`;
}

/**
 * GET /api/auth/discord
 * Redirects the user to Discord's OAuth2 consent page.
 */
router.get("/auth/discord", (req, res): void => {
  if (!DISCORD_CLIENT_ID) {
    res.status(503).json({ error: "Discord OAuth2 not configured (missing DISCORD_CLIENT_ID)" });
    return;
  }

  const redirectUri = getDiscordRedirectUri(req);
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email",
  });

  res.redirect(`https://discord.com/oauth2/authorize?${params}`);
});

/**
 * GET /api/auth/discord/callback
 * Exchanges the code for a token, gets user info, creates or finds the user,
 * creates a session, then redirects the frontend with ?token=...
 */
router.get("/auth/discord/callback", async (req, res): Promise<void> => {
  const { code, error } = req.query as Record<string, string>;

  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    res.redirect("/?error=discord_not_configured");
    return;
  }

  if (error || !code) {
    res.redirect("/auth/discord/callback?error=access_denied");
    return;
  }

  try {
    const redirectUri = getDiscordRedirectUri(req);

    // Exchange code for access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      res.redirect("/auth/discord/callback?error=token_exchange_failed");
      return;
    }

    const tokenData = (await tokenRes.json()) as {
      access_token: string;
      token_type: string;
    };

    // Get Discord user info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `${tokenData.token_type} ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      res.redirect("/auth/discord/callback?error=user_fetch_failed");
      return;
    }

    const discordUser = (await userRes.json()) as {
      id: string;
      username: string;
      discriminator: string;
      email?: string;
      avatar?: string;
    };

    // Build a unique username from Discord tag
    const discordUsername = `discord_${discordUser.id}`;
    const email = discordUser.email ?? `${discordUser.id}@discord.heave`;
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : null;

    // Owner Discord ID gets owner role automatically
    const OWNER_DISCORD_ID = "1386392361252290624";
    const assignedRole = discordUser.id === OWNER_DISCORD_ID ? "owner" : "user";

    // Find or create the user
    let [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, discordUsername));

    if (!user) {
      // Create new Discord-linked user (password not used)
      const fakeHash = generateToken(); // unusable hash — they log in via Discord only
      const [created] = await db
        .insert(usersTable)
        .values({
          username: discordUsername,
          email,
          passwordHash: fakeHash,
          role: assignedRole,
          active: true,
          avatarUrl,
        })
        .returning();
      user = created;
    } else if (discordUser.id === OWNER_DISCORD_ID && user.role !== "owner") {
      // Promote existing user to owner if they have the owner Discord ID
      const [updated] = await db
        .update(usersTable)
        .set({ role: "owner", avatarUrl: avatarUrl ?? user.avatarUrl })
        .where(eq(usersTable.username, discordUsername))
        .returning();
      user = updated;
    } else if (avatarUrl && user.avatarUrl !== avatarUrl) {
      // Update avatar if it changed
      const [updated] = await db
        .update(usersTable)
        .set({ avatarUrl })
        .where(eq(usersTable.username, discordUsername))
        .returning();
      user = updated;
    }

    if (!user.active) {
      res.redirect("/auth/discord/callback?error=account_disabled");
      return;
    }

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(sessionsTable).values({ token, userId: user.id, expiresAt });

    // Redirect to frontend callback with token
    const frontendBase = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : `${req.protocol}://${req.get("host")}`;

    res.redirect(`${frontendBase}/auth/discord/callback?token=${token}`);
  } catch (err) {
    console.error("Discord OAuth callback error:", err);
    res.redirect("/auth/discord/callback?error=internal");
  }
});

export default router;
