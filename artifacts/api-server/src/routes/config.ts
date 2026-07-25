import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, configTable } from "@workspace/db";
import { UpsertConfigBody, DeleteConfigParams } from "@workspace/api-zod";

const router: IRouter = Router();

function mapConfig(c: typeof configTable.$inferSelect) {
  return {
    id: c.id,
    key: c.key,
    value: c.isSecret ? "••••••••" : c.value,
    type: c.type,
    description: c.description,
    isSecret: c.isSecret,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/config", async (_req, res): Promise<void> => {
  const entries = await db.select().from(configTable).orderBy(configTable.key);
  res.json(entries.map(mapConfig));
});

router.post("/config", async (req, res): Promise<void> => {
  const parsed = UpsertConfigBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const existing = await db.select().from(configTable).where(eq(configTable.key, parsed.data.key));
  if (existing.length > 0) {
    const [updated] = await db.update(configTable)
      .set({ value: parsed.data.value, type: parsed.data.type, description: parsed.data.description ?? "", isSecret: parsed.data.isSecret ?? false })
      .where(eq(configTable.key, parsed.data.key))
      .returning();
    res.json(mapConfig(updated!));
  } else {
    const [created] = await db.insert(configTable).values({
      key: parsed.data.key,
      value: parsed.data.value,
      type: parsed.data.type,
      description: parsed.data.description ?? "",
      isSecret: parsed.data.isSecret ?? false,
    }).returning();
    res.json(mapConfig(created!));
  }
});

router.delete("/config/:key", async (req, res): Promise<void> => {
  const key = req.params.key as string;
  if (!key) { res.status(400).json({ error: "Key required" }); return; }
  await db.delete(configTable).where(eq(configTable.key, key));
  res.sendStatus(204);
});

export default router;
