import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
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

export default router;
