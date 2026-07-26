/**
 * Public GIF / Image endpoints — no auth required.
 * Discord bots call these to get random reaction GIFs.
 *
 * Routes:
 *   GET /v1/anime/:action   — anime reaction GIF (hug, kiss, slap, pat…)
 *   GET /v1/waifu           — random waifu image
 *   GET /v1/furry           — random furry image
 *   GET /v1/sfw/:tag        — safe-for-work random image by tag
 */

import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, imagesTable, categoriesTable, apiEndpointsTable } from "@workspace/db";

const router: IRouter = Router();

/** Pick one random image from a category slug, increment its request count */
async function randomFromCategory(slug: string): Promise<{ url: string; type: string } | null> {
  const [cat] = await db
    .select({ id: categoriesTable.id })
    .from(categoriesTable)
    .where(eq(categoriesTable.slug, slug))
    .limit(1);

  if (!cat) return null;

  const [img] = await db
    .select()
    .from(imagesTable)
    .where(eq(imagesTable.categoryId, cat.id))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!img) return null;

  // fire-and-forget increment
  db.update(imagesTable)
    .set({ requestCount: img.requestCount + 1 })
    .where(eq(imagesTable.id, img.id))
    .catch(() => {});

  return { url: img.url, type: img.type };
}

/** Record a request hit on the matching documented endpoint */
async function trackEndpoint(path: string): Promise<void> {
  db.update(apiEndpointsTable)
    .set({ requestCount: sql`${apiEndpointsTable.requestCount} + 1` })
    .where(eq(apiEndpointsTable.path, path))
    .catch(() => {});
}

// ── Anime reaction GIFs ────────────────────────────────────────────────────

const ANIME_ACTIONS = [
  "hug", "kiss", "slap", "pat", "cry", "wave", "dance",
  "poke", "bite", "blush", "smile", "wink", "lick", "punch",
  "shoot", "kill", "cuddle", "nom", "baka",
] as const;

router.get("/v1/anime/:action", async (req, res): Promise<void> => {
  const action = req.params.action?.toLowerCase();
  if (!action || !ANIME_ACTIONS.includes(action as (typeof ANIME_ACTIONS)[number])) {
    res.status(400).json({
      error: "Invalid action",
      valid_actions: ANIME_ACTIONS,
    });
    return;
  }

  const endpointPath = `/v1/anime/${action}`;
  trackEndpoint(endpointPath);

  const img = await randomFromCategory(`anime-${action}`);

  if (!img) {
    res.status(404).json({
      error: "No GIFs available for this action yet. Add images via the admin panel.",
      action,
    });
    return;
  }

  res.json({
    url: img.url,
    type: img.type,
    action,
    source: "Heave Games API",
  });
});

// ── Waifus ────────────────────────────────────────────────────────────────

router.get("/v1/waifu", async (_req, res): Promise<void> => {
  trackEndpoint("/v1/waifu");
  const img = await randomFromCategory("waifus");
  if (!img) {
    res.status(404).json({ error: "No waifu images available yet. Add images via the admin panel." });
    return;
  }
  res.json({ url: img.url, type: img.type, source: "Heave Games API" });
});

router.get("/v1/waifu/:tag", async (req, res): Promise<void> => {
  const tag = req.params.tag?.toLowerCase();
  trackEndpoint(`/v1/waifu/${tag}`);
  const img = await randomFromCategory(`waifu-${tag}`);
  if (!img) {
    // fallback to general waifus
    const fallback = await randomFromCategory("waifus");
    if (!fallback) {
      res.status(404).json({ error: "No waifu images available yet." });
      return;
    }
    res.json({ url: fallback.url, type: fallback.type, tag, source: "Heave Games API" });
    return;
  }
  res.json({ url: img.url, type: img.type, tag, source: "Heave Games API" });
});

// ── Furry ─────────────────────────────────────────────────────────────────

router.get("/v1/furry", async (_req, res): Promise<void> => {
  trackEndpoint("/v1/furry");
  const img = await randomFromCategory("furry");
  if (!img) {
    res.status(404).json({ error: "No furry images available yet. Add images via the admin panel." });
    return;
  }
  res.json({ url: img.url, type: img.type, source: "Heave Games API" });
});

router.get("/v1/furry/:tag", async (req, res): Promise<void> => {
  const tag = req.params.tag?.toLowerCase();
  trackEndpoint(`/v1/furry/${tag}`);
  const img = await randomFromCategory(`furry-${tag}`);
  if (!img) {
    const fallback = await randomFromCategory("furry");
    if (!fallback) {
      res.status(404).json({ error: "No furry images available yet." });
      return;
    }
    res.json({ url: fallback.url, type: fallback.type, tag, source: "Heave Games API" });
    return;
  }
  res.json({ url: img.url, type: img.type, tag, source: "Heave Games API" });
});

// ── SFW generic ───────────────────────────────────────────────────────────

router.get("/v1/sfw/:tag", async (req, res): Promise<void> => {
  const tag = req.params.tag?.toLowerCase();
  trackEndpoint(`/v1/sfw/${tag}`);
  const img = await randomFromCategory(`sfw-${tag}`);
  if (!img) {
    res.status(404).json({ error: `No SFW images for tag "${tag}" yet.` });
    return;
  }
  res.json({ url: img.url, type: img.type, tag, source: "Heave Games API" });
});

export default router;
