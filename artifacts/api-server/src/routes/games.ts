import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, gamesTable } from "@workspace/db";

const router: IRouter = Router();

function mapGame(g: typeof gamesTable.$inferSelect) {
  return {
    id: g.id,
    name: g.name,
    slug: g.slug,
    type: g.type,
    description: g.description,
    active: g.active,
    playCount: g.playCount,
    iconUrl: g.iconUrl ?? null,
  };
}

router.get("/games", async (_req, res): Promise<void> => {
  const games = await db.select().from(gamesTable).orderBy(gamesTable.name);
  res.json(games.map(mapGame));
});

router.get("/games/stats", async (_req, res): Promise<void> => {
  const games = await db.select().from(gamesTable).orderBy(desc(gamesTable.playCount)).limit(10);
  res.json(games.map((g) => ({
    gameId: g.id,
    gameName: g.name,
    playCount: g.playCount,
    uniquePlayers: Math.floor(g.playCount * 0.6),
  })));
});

router.post("/games", async (req, res): Promise<void> => {
  const { name, slug, type, description, active = true, iconUrl = null } = req.body;
  if (!name || !slug || !type || !description) {
    res.status(400).json({ error: "name, slug, type, and description are required" });
    return;
  }
  const [game] = await db.insert(gamesTable).values({
    name,
    slug,
    type,
    description,
    active,
    iconUrl,
    playCount: 0,
  }).returning();
  res.status(201).json(mapGame(game));
});

router.patch("/games/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { name, description, active, iconUrl } = req.body;
  const updates: Partial<typeof gamesTable.$inferInsert> = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (active !== undefined) updates.active = active;
  if (iconUrl !== undefined) updates.iconUrl = iconUrl;
  const [game] = await db.update(gamesTable).set(updates).where(eq(gamesTable.id, id)).returning();
  if (!game) { res.status(404).json({ error: "Game not found" }); return; }
  res.json(mapGame(game));
});

router.delete("/games/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(gamesTable).where(eq(gamesTable.id, id));
  res.status(204).send();
});

export default router;
