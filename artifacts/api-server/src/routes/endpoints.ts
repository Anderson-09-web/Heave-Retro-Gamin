import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, apiEndpointsTable } from "@workspace/db";
import {
  CreateApiEndpointBody,
  UpdateApiEndpointBody,
  UpdateApiEndpointParams,
  DeleteApiEndpointParams,
  ToggleApiEndpointParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapEndpoint(e: typeof apiEndpointsTable.$inferSelect) {
  return {
    id: e.id,
    path: e.path,
    method: e.method,
    description: e.description,
    active: e.active,
    categoryId: e.categoryId,
    requestCount: e.requestCount,
    responseJson: e.responseJson,
    requiresAuth: e.requiresAuth,
    rateLimit: e.rateLimit ?? null,
    createdAt: e.createdAt.toISOString(),
  };
}

router.get("/endpoints", async (_req, res): Promise<void> => {
  const endpoints = await db.select().from(apiEndpointsTable).orderBy(apiEndpointsTable.path);
  res.json(endpoints.map(mapEndpoint));
});

router.post("/endpoints", async (req, res): Promise<void> => {
  const parsed = CreateApiEndpointBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [ep] = await db.insert(apiEndpointsTable).values(parsed.data).returning();
  res.status(201).json(mapEndpoint(ep!));
});

router.patch("/endpoints/:id", async (req, res): Promise<void> => {
  const params = UpdateApiEndpointParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateApiEndpointBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [ep] = await db.update(apiEndpointsTable).set(parsed.data).where(eq(apiEndpointsTable.id, params.data.id)).returning();
  if (!ep) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapEndpoint(ep));
});

router.delete("/endpoints/:id", async (req, res): Promise<void> => {
  const params = DeleteApiEndpointParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(apiEndpointsTable).where(eq(apiEndpointsTable.id, params.data.id));
  res.sendStatus(204);
});

router.post("/endpoints/:id/toggle", async (req, res): Promise<void> => {
  const params = ToggleApiEndpointParams.safeParse({ id: parseInt(req.params.id as string, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [current] = await db.select().from(apiEndpointsTable).where(eq(apiEndpointsTable.id, params.data.id));
  if (!current) { res.status(404).json({ error: "Not found" }); return; }
  const [ep] = await db.update(apiEndpointsTable).set({ active: !current.active }).where(eq(apiEndpointsTable.id, params.data.id)).returning();
  res.json(mapEndpoint(ep!));
});

export default router;
