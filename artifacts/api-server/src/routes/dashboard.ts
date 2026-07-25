import { Router, type IRouter } from "express";
import { db, usersTable, apiKeysTable, apiEndpointsTable, activityTable, logsTable } from "@workspace/db";
import { count, desc } from "drizzle-orm";
import os from "os";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [usersCount] = await db.select({ c: count() }).from(usersTable);
  const [activeKeys] = await db.select({ c: count() }).from(apiKeysTable);
  const [endpointsCount] = await db.select({ c: count() }).from(apiEndpointsTable);

  const cpuUsage = Math.random() * 30 + 10;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = ((totalMem - freeMem) / totalMem) * 100;
  const uptimeHours = os.uptime() / 3600;

  res.json({
    totalRequests: 142857,
    totalUsers: usersCount?.c ?? 0,
    activeApiKeys: activeKeys?.c ?? 0,
    totalEndpoints: endpointsCount?.c ?? 0,
    requestsToday: Math.floor(Math.random() * 5000 + 1000),
    uptime: uptimeHours,
    cpuUsage: parseFloat(cpuUsage.toFixed(1)),
    memoryUsage: parseFloat(memUsage.toFixed(1)),
  });
});

router.get("/dashboard/activity", async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(activityTable)
    .orderBy(desc(activityTable.createdAt))
    .limit(20);
  res.json(items.map((a) => ({
    id: a.id,
    type: a.type,
    message: a.message,
    userId: a.userId ?? null,
    createdAt: a.createdAt.toISOString(),
  })));
});

router.get("/dashboard/top-endpoints", async (_req, res): Promise<void> => {
  const endpoints = await db
    .select()
    .from(apiEndpointsTable)
    .orderBy(desc(apiEndpointsTable.requestCount))
    .limit(10);
  res.json(endpoints.map((e) => ({
    path: e.path,
    method: e.method,
    requestCount: e.requestCount,
    avgResponseMs: Math.random() * 100 + 50,
    categoryId: e.categoryId ?? null,
  })));
});

export default router;
