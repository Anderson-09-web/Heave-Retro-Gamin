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

router.post("/auth/logout", async (req, res): Promise<void> => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7);
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
  }
  res.json({ success: true });
});

export default router;
