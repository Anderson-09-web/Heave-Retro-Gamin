/**
 * auto-seed.ts — runs once at server startup.
 * Upserts all categories and API endpoint docs so the admin panel
 * always has data without needing a manual seed command.
 */

import { db, categoriesTable, apiEndpointsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./logger";
import { BUILTIN_CATEGORIES, BUILTIN_ENDPOINTS } from "./builtin-endpoints";

export async function autoSeedEndpoints(): Promise<void> {
  try {
    // 1. Upsert categories → collect slug → id
    const catIdBySlug: Record<string, number> = {};

    for (const cat of BUILTIN_CATEGORIES) {
      const rows = await db
        .insert(categoriesTable)
        .values({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          active: true,
          itemCount: 0,
        })
        .onConflictDoUpdate({
          target: categoriesTable.slug,
          set: {
            name: sql`excluded.name`,
            description: sql`excluded.description`,
            icon: sql`excluded.icon`,
          },
        })
        .returning({ id: categoriesTable.id });

      if (rows[0]) catIdBySlug[cat.slug] = rows[0].id;
    }

    // 2. Add endpoint documentation only when its method/path is missing.
    // api_endpoints has no composite unique constraint, so ON CONFLICT alone
    // cannot prevent duplicate rows on every Render restart.
    const existingRows = await db
      .select({
        path: apiEndpointsTable.path,
        method: apiEndpointsTable.method,
      })
      .from(apiEndpointsTable);
    const existingEndpoints = new Set(
      existingRows.map((row) => `${row.method.toUpperCase()} ${row.path}`),
    );

    for (const ep of BUILTIN_ENDPOINTS) {
      const catId = catIdBySlug[ep.categorySlug] ?? catIdBySlug["utils"];
      if (!catId) continue;
      const key = `${ep.method.toUpperCase()} ${ep.path}`;
      if (existingEndpoints.has(key)) continue;

      await db
        .insert(apiEndpointsTable)
        .values({
          path: ep.path,
          method: ep.method,
          description: ep.description,
          active: true,
          categoryId: catId,
          requestCount: 0,
          responseJson: ep.response,
          requiresAuth: ep.requiresAuth,
        })
        .execute();
      existingEndpoints.add(key);
    }

    logger.info(
      { categories: BUILTIN_CATEGORIES.length, endpoints: BUILTIN_ENDPOINTS.length },
      "Auto-seed: categories and endpoints synced",
    );
  } catch (err) {
    // Non-fatal — the panel shows builtin list anyway via the GET /endpoints fallback
    logger.warn({ err }, "Auto-seed skipped (no DB connection?)");
  }
}
