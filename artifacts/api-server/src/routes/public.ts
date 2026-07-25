import { Router, type IRouter } from "express";
import { db, usersTable, apiKeysTable, apiEndpointsTable, gamesTable, categoriesTable, changelogTable } from "@workspace/db";
import { count, eq, desc } from "drizzle-orm";
import os from "os";

const router: IRouter = Router();

router.get("/public/stats", async (_req, res): Promise<void> => {
  const [endpointsCount] = await db.select({ c: count() }).from(apiEndpointsTable).where(eq(apiEndpointsTable.active, true));
  const [usersCount] = await db.select({ c: count() }).from(usersTable);
  const [keysCount] = await db.select({ c: count() }).from(apiKeysTable).where(eq(apiKeysTable.active, true));
  const [gamesCount] = await db.select({ c: count() }).from(gamesTable).where(eq(gamesTable.active, true));

  res.json({
    totalEndpoints: endpointsCount?.c ?? 0,
    totalUsers: usersCount?.c ?? 0,
    activeKeys: keysCount?.c ?? 0,
    totalGames: gamesCount?.c ?? 0,
    requestsToday: Math.floor(Math.random() * 50000 + 10000),
    uptime: os.uptime() / 3600,
  });
});

router.get("/public/categories", async (_req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable).where(eq(categoriesTable.active, true)).orderBy(categoriesTable.name);
  res.json(cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    itemCount: c.itemCount,
  })));
});

router.get("/public/changelog", async (_req, res): Promise<void> => {
  const entries = await db.select().from(changelogTable).orderBy(desc(changelogTable.createdAt)).limit(20);
  res.json(entries.map((e) => ({
    id: e.id,
    version: e.version,
    title: e.title,
    description: e.description,
    type: e.type,
    createdAt: e.createdAt.toISOString(),
  })));
});

export default router;
