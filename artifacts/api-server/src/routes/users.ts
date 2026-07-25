import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { CreateUserBody, UpdateUserBody, GetUserParams, UpdateUserParams, DeleteUserParams, UpdateUserRoleParams, UpdateUserRoleBody } from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(p: string): string {
  return crypto.createHash("sha256").update(p + "heave_salt").digest("hex");
}

function mapUser(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    active: u.active,
    avatarUrl: u.avatarUrl ?? null,
    createdAt: u.createdAt.toISOString(),
  };
}

router.get("/users", async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  res.json(users.map(mapUser));
});

router.post("/users", async (req, res): Promise<void> => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, email, password, role } = parsed.data;
  const [user] = await db.insert(usersTable).values({
    username,
    email,
    passwordHash: hashPassword(password),
    role,
  }).returning();
  res.status(201).json(mapUser(user!));
});

router.get("/users/:id", async (req, res): Promise<void> => {
  const params = GetUserParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
  if (!user) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapUser(user));
});

router.patch("/users/:id", async (req, res): Promise<void> => {
  const params = UpdateUserParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [user] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, params.data.id)).returning();
  if (!user) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapUser(user));
});

router.delete("/users/:id", async (req, res): Promise<void> => {
  const params = DeleteUserParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(usersTable).where(eq(usersTable.id, params.data.id));
  res.sendStatus(204);
});

router.patch("/users/:id/role", async (req, res): Promise<void> => {
  const params = UpdateUserRoleParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateUserRoleBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [user] = await db.update(usersTable).set({ role: parsed.data.role }).where(eq(usersTable.id, params.data.id)).returning();
  if (!user) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapUser(user));
});

export default router;
