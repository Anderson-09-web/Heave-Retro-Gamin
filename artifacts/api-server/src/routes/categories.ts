import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, categoriesTable } from "@workspace/db";
import { CreateCategoryBody, UpdateCategoryBody, UpdateCategoryParams, DeleteCategoryParams } from "@workspace/api-zod";

const router: IRouter = Router();

function mapCat(c: typeof categoriesTable.$inferSelect) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    active: c.active,
    itemCount: c.itemCount,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/categories", async (_req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  res.json(cats.map(mapCat));
});

router.post("/categories", async (req, res): Promise<void> => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [cat] = await db.insert(categoriesTable).values(parsed.data).returning();
  res.status(201).json(mapCat(cat!));
});

router.patch("/categories/:id", async (req, res): Promise<void> => {
  const params = UpdateCategoryParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateCategoryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [cat] = await db.update(categoriesTable).set(parsed.data).where(eq(categoriesTable.id, params.data.id)).returning();
  if (!cat) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapCat(cat));
});

router.delete("/categories/:id", async (req, res): Promise<void> => {
  const params = DeleteCategoryParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(categoriesTable).where(eq(categoriesTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
