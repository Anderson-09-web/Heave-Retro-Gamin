import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, backupsTable } from "@workspace/db";
import { RestoreBackupParams } from "@workspace/api-zod";

const router: IRouter = Router();

function mapBackup(b: typeof backupsTable.$inferSelect) {
  return {
    id: b.id,
    name: b.name,
    size: b.size,
    status: b.status,
    restoredAt: b.restoredAt ? b.restoredAt.toISOString() : null,
    createdAt: b.createdAt.toISOString(),
  };
}

router.get("/backups", async (_req, res): Promise<void> => {
  const backups = await db.select().from(backupsTable).orderBy(backupsTable.createdAt);
  res.json(backups.map(mapBackup));
});

router.post("/backups", async (_req, res): Promise<void> => {
  const sizeKb = Math.floor(Math.random() * 10000 + 500);
  const sizeMb = (sizeKb / 1024).toFixed(2);
  const [backup] = await db.insert(backupsTable).values({
    name: `backup_${new Date().toISOString().replace(/[:.]/g, "-")}`,
    size: `${sizeMb} MB`,
    status: "completed",
  }).returning();
  res.status(201).json(mapBackup(backup!));
});

router.post("/backups/:id/restore", async (req, res): Promise<void> => {
  const params = RestoreBackupParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [backup] = await db.update(backupsTable)
    .set({ restoredAt: new Date() })
    .where(eq(backupsTable.id, params.data.id))
    .returning();
  if (!backup) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapBackup(backup));
});

export default router;
