import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, imagesTable } from "@workspace/db";
import { UploadImageBody, DeleteImageParams } from "@workspace/api-zod";

const router: IRouter = Router();

function mapImage(i: typeof imagesTable.$inferSelect) {
  return {
    id: i.id,
    url: i.url,
    type: i.type,
    categoryId: i.categoryId,
    tags: i.tags,
    requestCount: i.requestCount,
    createdAt: i.createdAt.toISOString(),
  };
}

router.get("/images", async (_req, res): Promise<void> => {
  const images = await db.select().from(imagesTable).orderBy(imagesTable.createdAt);
  res.json(images.map(mapImage));
});

router.post("/images", async (req, res): Promise<void> => {
  const parsed = UploadImageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [img] = await db.insert(imagesTable).values(parsed.data).returning();
  res.status(201).json(mapImage(img!));
});

router.delete("/images/:id", async (req, res): Promise<void> => {
  const params = DeleteImageParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(imagesTable).where(eq(imagesTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
