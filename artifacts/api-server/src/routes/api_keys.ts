import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, apiKeysTable } from "@workspace/db";
import { CreateApiKeyBody, UpdateApiKeyBody, UpdateApiKeyParams, DeleteApiKeyParams, RevokeApiKeyParams } from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

function mapKey(k: typeof apiKeysTable.$inferSelect) {
  return {
    id: k.id,
    name: k.name,
    keyPreview: k.keyPreview,
    active: k.active,
    requestCount: k.requestCount,
    rateLimit: k.rateLimit ?? null,
    expiresAt: k.expiresAt ? k.expiresAt.toISOString() : null,
    userId: k.userId ?? null,
    createdAt: k.createdAt.toISOString(),
  };
}

router.get("/api-keys", async (_req, res): Promise<void> => {
  const keys = await db.select().from(apiKeysTable).orderBy(apiKeysTable.createdAt);
  res.json(keys.map(mapKey));
});

router.post("/api-keys", async (req, res): Promise<void> => {
  const parsed = CreateApiKeyBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const rawKey = `hg_${crypto.randomBytes(24).toString("hex")}`;
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const keyPreview = `${rawKey.slice(0, 8)}...${rawKey.slice(-4)}`;
  const [key] = await db.insert(apiKeysTable).values({
    name: parsed.data.name,
    keyHash,
    keyPreview,
    rateLimit: parsed.data.rateLimit ?? null,
    expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    userId: parsed.data.userId ?? null,
  }).returning();
  res.status(201).json(mapKey(key!));
});

router.patch("/api-keys/:id", async (req, res): Promise<void> => {
  const params = UpdateApiKeyParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateApiKeyBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [key] = await db.update(apiKeysTable).set(parsed.data).where(eq(apiKeysTable.id, params.data.id)).returning();
  if (!key) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapKey(key));
});

router.delete("/api-keys/:id", async (req, res): Promise<void> => {
  const params = DeleteApiKeyParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(apiKeysTable).where(eq(apiKeysTable.id, params.data.id));
  res.sendStatus(204);
});

router.post("/api-keys/:id/revoke", async (req, res): Promise<void> => {
  const params = RevokeApiKeyParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [key] = await db.update(apiKeysTable).set({ active: false }).where(eq(apiKeysTable.id, params.data.id)).returning();
  if (!key) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapKey(key));
});

export default router;
