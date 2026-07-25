import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, giveawaysTable } from "@workspace/db";
import { CreateGiveawayBody, GetGiveawayParams, DeleteGiveawayParams, EndGiveawayParams } from "@workspace/api-zod";

const router: IRouter = Router();

function mapGiveaway(g: typeof giveawaysTable.$inferSelect) {
  return {
    id: g.id,
    title: g.title,
    prize: g.prize,
    description: g.description ?? null,
    status: g.status,
    participantCount: g.participantCount,
    winnerUserId: g.winnerUserId ?? null,
    winnerName: g.winnerName ?? null,
    endsAt: g.endsAt.toISOString(),
    createdAt: g.createdAt.toISOString(),
  };
}

router.get("/giveaways", async (_req, res): Promise<void> => {
  const giveaways = await db.select().from(giveawaysTable).orderBy(giveawaysTable.createdAt);
  res.json(giveaways.map(mapGiveaway));
});

router.post("/giveaways", async (req, res): Promise<void> => {
  const parsed = CreateGiveawayBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [g] = await db.insert(giveawaysTable).values({
    title: parsed.data.title,
    prize: parsed.data.prize,
    description: parsed.data.description ?? null,
    endsAt: new Date(parsed.data.endsAt),
  }).returning();
  res.status(201).json(mapGiveaway(g!));
});

router.get("/giveaways/:id", async (req, res): Promise<void> => {
  const params = GetGiveawayParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [g] = await db.select().from(giveawaysTable).where(eq(giveawaysTable.id, params.data.id));
  if (!g) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapGiveaway(g));
});

router.delete("/giveaways/:id", async (req, res): Promise<void> => {
  const params = DeleteGiveawayParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(giveawaysTable).where(eq(giveawaysTable.id, params.data.id));
  res.sendStatus(204);
});

router.post("/giveaways/:id/end", async (req, res): Promise<void> => {
  const params = EndGiveawayParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const names = ["AlexDev", "DiscordUser#1234", "AnimePlayer99", "GameMaster", "CoolBot"];
  const winner = names[Math.floor(Math.random() * names.length)];
  const [g] = await db.update(giveawaysTable)
    .set({ status: "ended", winnerName: winner })
    .where(eq(giveawaysTable.id, params.data.id))
    .returning();
  if (!g) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapGiveaway(g));
});

export default router;
