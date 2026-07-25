import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, logsTable } from "@workspace/db";
import { ListLogsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

function mapLog(l: typeof logsTable.$inferSelect) {
  return {
    id: l.id,
    level: l.level,
    message: l.message,
    source: l.source ?? null,
    meta: l.meta ?? null,
    createdAt: l.createdAt.toISOString(),
  };
}

router.get("/logs", async (req, res): Promise<void> => {
  const queryParsed = ListLogsQueryParams.safeParse(req.query);
  const level = queryParsed.success ? queryParsed.data.level : undefined;
  const limit = queryParsed.success ? queryParsed.data.limit ?? 100 : 100;

  let query = db.select().from(logsTable).orderBy(desc(logsTable.createdAt));
  const logs = await query.limit(limit);
  const filtered = level ? logs.filter((l) => l.level === level) : logs;
  res.json(filtered.map(mapLog));
});

router.get("/logs/errors", async (_req, res): Promise<void> => {
  const logs = await db
    .select()
    .from(logsTable)
    .where(eq(logsTable.level, "error"))
    .orderBy(desc(logsTable.createdAt))
    .limit(100);
  res.json(logs.map(mapLog));
});

export default router;
