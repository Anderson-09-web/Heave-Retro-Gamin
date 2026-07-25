/**
 * Seed script — creates default dev users if they don't already exist.
 * Passwords are SHA-256(password + "heave_salt").
 *
 * Default credentials (dev only):
 *   owner:     heave_owner / admin123
 *   admin:     admin_alex  / mod123
 *   moderator: mod_sara    / mod123
 */
import { createHash } from "crypto";
import pg from "pg";

const { Client } = pg;

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

const SEED_USERS = [
  {
    username: "heave_owner",
    email: "owner@heavegames.com",
    passwordHash: sha256("admin123heave_salt"),
    role: "owner",
  },
  {
    username: "admin_alex",
    email: "alex@heavegames.com",
    passwordHash: sha256("mod123heave_salt"),
    role: "admin",
  },
  {
    username: "mod_sara",
    email: "sara@heavegames.com",
    passwordHash: sha256("mod123heave_salt"),
    role: "moderator",
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    for (const user of SEED_USERS) {
      await client.query(
        `INSERT INTO users (username, email, password_hash, role, active)
         VALUES ($1, $2, $3, $4, true)
         ON CONFLICT (username) DO NOTHING`,
        [user.username, user.email, user.passwordHash, user.role],
      );
    }
    console.log("✓ Seed complete — default users are ready.");
  } finally {
    await client.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
