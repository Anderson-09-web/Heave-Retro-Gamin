/**
 * Seed script — populates the database with:
 *   1. Default admin users
 *   2. Categories (anime, waifus, furry, giveaways, games, utils)
 *   3. API endpoint documentation entries
 *   4. Sample GIF images for each category
 *   5. Default games
 *   6. Sample config entries
 *
 * Run: pnpm --filter @workspace/scripts run seed
 * or:  DATABASE_URL=... pnpm --filter @workspace/scripts tsx src/seed.ts
 */

import { createHash } from "crypto";
import pg from "pg";

const { Client } = pg;

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

// ── Users ─────────────────────────────────────────────────────────────────

const SEED_USERS = [
  { username: "heave_owner", email: "owner@heavegames.com", passwordHash: sha256("admin123heave_salt"), role: "owner" },
  { username: "admin_alex",  email: "alex@heavegames.com",  passwordHash: sha256("mod123heave_salt"),   role: "admin" },
  { username: "mod_sara",    email: "sara@heavegames.com",  passwordHash: sha256("mod123heave_salt"),   role: "moderator" },
];

// ── Categories ────────────────────────────────────────────────────────────

const CATEGORIES = [
  // Anime reactions
  { name: "Anime · Hug",    slug: "anime-hug",    description: "Anime hug reaction GIFs",     icon: "heart",    item_count: 0 },
  { name: "Anime · Kiss",   slug: "anime-kiss",   description: "Anime kiss reaction GIFs",    icon: "heart",    item_count: 0 },
  { name: "Anime · Slap",   slug: "anime-slap",   description: "Anime slap reaction GIFs",    icon: "zap",      item_count: 0 },
  { name: "Anime · Pat",    slug: "anime-pat",    description: "Anime pat reaction GIFs",     icon: "hand",     item_count: 0 },
  { name: "Anime · Cry",    slug: "anime-cry",    description: "Anime crying GIFs",           icon: "droplet",  item_count: 0 },
  { name: "Anime · Wave",   slug: "anime-wave",   description: "Anime wave GIFs",             icon: "hand",     item_count: 0 },
  { name: "Anime · Dance",  slug: "anime-dance",  description: "Anime dance GIFs",            icon: "music",    item_count: 0 },
  { name: "Anime · Poke",   slug: "anime-poke",   description: "Anime poke reaction GIFs",    icon: "pointer",  item_count: 0 },
  { name: "Anime · Bite",   slug: "anime-bite",   description: "Anime bite reaction GIFs",    icon: "zap",      item_count: 0 },
  { name: "Anime · Blush",  slug: "anime-blush",  description: "Anime blushing GIFs",         icon: "smile",    item_count: 0 },
  { name: "Anime · Smile",  slug: "anime-smile",  description: "Anime smile GIFs",            icon: "smile",    item_count: 0 },
  { name: "Anime · Wink",   slug: "anime-wink",   description: "Anime wink GIFs",             icon: "eye",      item_count: 0 },
  { name: "Anime · Lick",   slug: "anime-lick",   description: "Anime lick GIFs",             icon: "zap",      item_count: 0 },
  { name: "Anime · Punch",  slug: "anime-punch",  description: "Anime punch GIFs",            icon: "zap",      item_count: 0 },
  { name: "Anime · Cuddle", slug: "anime-cuddle", description: "Anime cuddle GIFs",           icon: "heart",    item_count: 0 },
  { name: "Anime · Nom",    slug: "anime-nom",    description: "Anime nom/eating GIFs",       icon: "zap",      item_count: 0 },
  { name: "Anime · Baka",   slug: "anime-baka",   description: "Anime baka reaction GIFs",    icon: "zap",      item_count: 0 },
  // Waifus
  { name: "Waifus",         slug: "waifus",       description: "Random waifu images",         icon: "star",     item_count: 0 },
  { name: "Waifu · SFW",    slug: "waifu-sfw",    description: "Safe-for-work waifu images",  icon: "star",     item_count: 0 },
  // Furry
  { name: "Furry",          slug: "furry",        description: "Random furry images & GIFs",  icon: "paw-print",item_count: 0 },
  { name: "Furry · Hug",    slug: "furry-hug",    description: "Furry hug GIFs",              icon: "heart",    item_count: 0 },
  { name: "Furry · Kiss",   slug: "furry-kiss",   description: "Furry kiss GIFs",             icon: "heart",    item_count: 0 },
  // SFW
  { name: "SFW · Meme",     slug: "sfw-meme",     description: "SFW anime memes",             icon: "image",    item_count: 0 },
  { name: "SFW · Cat",      slug: "sfw-cat",      description: "Cat images",                  icon: "cat",      item_count: 0 },
  { name: "SFW · Dog",      slug: "sfw-dog",      description: "Dog images",                  icon: "dog",      item_count: 0 },
  // System
  { name: "Giveaways",      slug: "giveaways",    description: "Giveaway system endpoints",   icon: "gift",     item_count: 0 },
  { name: "Games",          slug: "games",        description: "Mini-games system",           icon: "gamepad-2",item_count: 0 },
  { name: "Utilities",      slug: "utils",        description: "Utility endpoints",           icon: "wrench",   item_count: 0 },
];

// ── API Endpoint Documentation ─────────────────────────────────────────────

// Helper to stringify example responses
const j = (obj: object) => JSON.stringify(obj, null, 2);

const ENDPOINTS = [
  // ── Anime GIFs
  { path: "/v1/anime/hug",    method: "GET", description: "Get a random anime hug GIF.",    slug: "anime-hug",    requires_auth: false, response: j({ url: "https://cdn.example.com/anime/hug/001.gif", type: "gif", action: "hug", source: "Heave Games API" }) },
  { path: "/v1/anime/kiss",   method: "GET", description: "Get a random anime kiss GIF.",   slug: "anime-kiss",   requires_auth: false, response: j({ url: "https://cdn.example.com/anime/kiss/001.gif", type: "gif", action: "kiss", source: "Heave Games API" }) },
  { path: "/v1/anime/slap",   method: "GET", description: "Get a random anime slap GIF.",   slug: "anime-slap",   requires_auth: false, response: j({ url: "https://cdn.example.com/anime/slap/001.gif", type: "gif", action: "slap", source: "Heave Games API" }) },
  { path: "/v1/anime/pat",    method: "GET", description: "Get a random anime pat GIF.",    slug: "anime-pat",    requires_auth: false, response: j({ url: "https://cdn.example.com/anime/pat/001.gif",  type: "gif", action: "pat",  source: "Heave Games API" }) },
  { path: "/v1/anime/cry",    method: "GET", description: "Get a random anime cry GIF.",    slug: "anime-cry",    requires_auth: false, response: j({ url: "https://cdn.example.com/anime/cry/001.gif",  type: "gif", action: "cry",  source: "Heave Games API" }) },
  { path: "/v1/anime/wave",   method: "GET", description: "Get a random anime wave GIF.",   slug: "anime-wave",   requires_auth: false, response: j({ url: "https://cdn.example.com/anime/wave/001.gif", type: "gif", action: "wave", source: "Heave Games API" }) },
  { path: "/v1/anime/dance",  method: "GET", description: "Get a random anime dance GIF.",  slug: "anime-dance",  requires_auth: false, response: j({ url: "https://cdn.example.com/anime/dance/001.gif",type: "gif", action: "dance",source: "Heave Games API" }) },
  { path: "/v1/anime/poke",   method: "GET", description: "Get a random anime poke GIF.",   slug: "anime-poke",   requires_auth: false, response: j({ url: "https://cdn.example.com/anime/poke/001.gif", type: "gif", action: "poke", source: "Heave Games API" }) },
  { path: "/v1/anime/bite",   method: "GET", description: "Get a random anime bite GIF.",   slug: "anime-bite",   requires_auth: false, response: j({ url: "https://cdn.example.com/anime/bite/001.gif", type: "gif", action: "bite", source: "Heave Games API" }) },
  { path: "/v1/anime/blush",  method: "GET", description: "Get a random anime blush GIF.",  slug: "anime-blush",  requires_auth: false, response: j({ url: "https://cdn.example.com/anime/blush/001.gif",type: "gif", action: "blush",source: "Heave Games API" }) },
  { path: "/v1/anime/smile",  method: "GET", description: "Get a random anime smile GIF.",  slug: "anime-smile",  requires_auth: false, response: j({ url: "https://cdn.example.com/anime/smile/001.gif",type: "gif", action: "smile",source: "Heave Games API" }) },
  { path: "/v1/anime/wink",   method: "GET", description: "Get a random anime wink GIF.",   slug: "anime-wink",   requires_auth: false, response: j({ url: "https://cdn.example.com/anime/wink/001.gif", type: "gif", action: "wink", source: "Heave Games API" }) },
  { path: "/v1/anime/lick",   method: "GET", description: "Get a random anime lick GIF.",   slug: "anime-lick",   requires_auth: false, response: j({ url: "https://cdn.example.com/anime/lick/001.gif", type: "gif", action: "lick", source: "Heave Games API" }) },
  { path: "/v1/anime/punch",  method: "GET", description: "Get a random anime punch GIF.",  slug: "anime-punch",  requires_auth: false, response: j({ url: "https://cdn.example.com/anime/punch/001.gif",type: "gif", action: "punch",source: "Heave Games API" }) },
  { path: "/v1/anime/cuddle", method: "GET", description: "Get a random anime cuddle GIF.", slug: "anime-cuddle", requires_auth: false, response: j({ url: "https://cdn.example.com/anime/cuddle/001.gif",type:"gif",action:"cuddle",source:"Heave Games API" }) },
  { path: "/v1/anime/nom",    method: "GET", description: "Get a random anime nom GIF.",    slug: "anime-nom",    requires_auth: false, response: j({ url: "https://cdn.example.com/anime/nom/001.gif",  type: "gif", action: "nom",  source: "Heave Games API" }) },
  { path: "/v1/anime/baka",   method: "GET", description: "Get a random 'baka!' reaction GIF.", slug: "anime-baka", requires_auth: false, response: j({ url: "https://cdn.example.com/anime/baka/001.gif", type: "gif", action: "baka", source: "Heave Games API" }) },

  // ── Waifus
  { path: "/v1/waifu",        method: "GET", description: "Get a random waifu image.",               slug: "waifus",   requires_auth: false, response: j({ url: "https://cdn.example.com/waifu/001.jpg", type: "image", source: "Heave Games API" }) },
  { path: "/v1/waifu/sfw",    method: "GET", description: "Get a random safe-for-work waifu image.", slug: "waifu-sfw",requires_auth: false, response: j({ url: "https://cdn.example.com/waifu/sfw/001.jpg", type: "image", tag: "sfw", source: "Heave Games API" }) },

  // ── Furry
  { path: "/v1/furry",        method: "GET", description: "Get a random furry image or GIF.",   slug: "furry",      requires_auth: false, response: j({ url: "https://cdn.example.com/furry/001.gif", type: "gif", source: "Heave Games API" }) },
  { path: "/v1/furry/hug",    method: "GET", description: "Get a random furry hug GIF.",        slug: "furry-hug",  requires_auth: false, response: j({ url: "https://cdn.example.com/furry/hug/001.gif", type: "gif", tag: "hug", source: "Heave Games API" }) },
  { path: "/v1/furry/kiss",   method: "GET", description: "Get a random furry kiss GIF.",       slug: "furry-kiss", requires_auth: false, response: j({ url: "https://cdn.example.com/furry/kiss/001.gif", type: "gif", tag: "kiss", source: "Heave Games API" }) },

  // ── SFW
  { path: "/v1/sfw/meme",     method: "GET", description: "Get a random anime meme image.",     slug: "sfw-meme",   requires_auth: false, response: j({ url: "https://cdn.example.com/sfw/meme/001.jpg", type: "image", tag: "meme", source: "Heave Games API" }) },
  { path: "/v1/sfw/cat",      method: "GET", description: "Get a random cat image.",            slug: "sfw-cat",    requires_auth: false, response: j({ url: "https://cdn.example.com/sfw/cat/001.jpg",  type: "image", tag: "cat",  source: "Heave Games API" }) },
  { path: "/v1/sfw/dog",      method: "GET", description: "Get a random dog image.",            slug: "sfw-dog",    requires_auth: false, response: j({ url: "https://cdn.example.com/sfw/dog/001.jpg",  type: "image", tag: "dog",  source: "Heave Games API" }) },

  // ── Giveaways
  { path: "/api/giveaways",           method: "GET",  description: "List all active giveaways.",               slug: "giveaways", requires_auth: true,  response: j([{ id: 1, title: "Nitro Giveaway", prize: "Discord Nitro", status: "active", participantCount: 42, endsAt: "2025-12-31T00:00:00Z" }]) },
  { path: "/api/giveaways",           method: "POST", description: "Create a new giveaway (admin/owner only).", slug: "giveaways", requires_auth: true,  response: j({ id: 2, title: "New Giveaway", prize: "Prize", status: "active", participantCount: 0, endsAt: "2025-12-31T00:00:00Z" }) },
  { path: "/api/giveaways/{id}/end",  method: "POST", description: "End a giveaway and randomly select a winner.", slug: "giveaways", requires_auth: true, response: j({ id: 1, status: "ended", winnerName: "cool_user", winnerUserId: 42 }) },

  // ── Games
  { path: "/api/games",               method: "GET",  description: "List all available mini-games.",            slug: "games", requires_auth: false, response: j([{ id: 1, name: "TIC TAC TOE", slug: "tictactoe", type: "turn_based", active: true, playCount: 1240 }]) },
  { path: "/api/games/stats",         method: "GET",  description: "Get play statistics for all games.",        slug: "games", requires_auth: true,  response: j([{ gameId: 1, gameName: "TIC TAC TOE", playCount: 1240, uniquePlayers: 744 }]) },

  // ── Auth
  { path: "/api/auth/login",          method: "POST", description: "Login with username and password. Returns a Bearer token.", slug: "utils", requires_auth: false, response: j({ token: "abc123...", user: { id: 1, username: "heave_owner", role: "owner" } }) },
  { path: "/api/auth/discord",        method: "GET",  description: "Redirect to Discord OAuth2 login.",          slug: "utils", requires_auth: false, response: j({ redirect: "https://discord.com/oauth2/authorize?..." }) },
  { path: "/api/auth/me",             method: "GET",  description: "Get the currently authenticated user.",      slug: "utils", requires_auth: true,  response: j({ id: 1, username: "heave_owner", email: "owner@heavegames.com", role: "owner" }) },
  { path: "/api/auth/logout",         method: "POST", description: "Invalidate the current session token.",      slug: "utils", requires_auth: true,  response: j({ success: true }) },

  // ── Public
  { path: "/api/public/stats",        method: "GET",  description: "Get public platform statistics for bots.",  slug: "utils", requires_auth: false, response: j({ totalEndpoints: 48, totalUsers: 120, activeKeys: 35, totalGames: 7 }) },
  { path: "/api/public/categories",   method: "GET",  description: "List all public image categories.",         slug: "utils", requires_auth: false, response: j([{ id: 1, name: "Anime · Hug", slug: "anime-hug", itemCount: 25 }]) },
];

// ── Games ─────────────────────────────────────────────────────────────────

const GAMES = [
  { name: "TIC TAC TOE", slug: "tictactoe", type: "turn_based", description: "Clásico X vs O. Juega solo contra la CPU o con un amigo.",       active: true,  play_count: 1240 },
  { name: "CONNECT 4",   slug: "connect4",  type: "turn_based", description: "Sé el primero en conectar 4 fichas en fila. 1 o 2 jugadores.",    active: true,  play_count: 890 },
  { name: "SNAKE",       slug: "snake",     type: "action",     description: "Mueve la serpiente, come manzanas y no te choques.",               active: true,  play_count: 760 },
  { name: "MEMORY",      slug: "memory",    type: "puzzle",     description: "Encuentra todos los pares ocultos. ¡Entrena tu memoria!",          active: true,  play_count: 430 },
  { name: "UNO",         slug: "uno",       type: "card",       description: "El juego de cartas más popular del mundo. Próximamente online.",   active: false, play_count: 2100 },
  { name: "CHESS",       slug: "chess",     type: "turn_based", description: "Ajedrez clásico online con matchmaking.",                          active: false, play_count: 550 },
  { name: "CHECKERS",    slug: "checkers",  type: "turn_based", description: "Damas. El juego de mesa clásico, ahora online.",                   active: false, play_count: 320 },
];

// ── Config ────────────────────────────────────────────────────────────────

const CONFIG_ENTRIES = [
  { key: "api_version",       value: "v1",              type: "string",  description: "Current public API version",             is_secret: false },
  { key: "rate_limit_default",value: "100",             type: "number",  description: "Default requests per minute per API key", is_secret: false },
  { key: "discord_guild_id",  value: "",                type: "string",  description: "Main Discord guild/server ID",            is_secret: false },
  { key: "jwt_secret",        value: "CHANGE_ME",       type: "string",  description: "Secret used to sign JWT API tokens",      is_secret: true  },
  { key: "max_giveaway_days", value: "30",              type: "number",  description: "Maximum duration of a giveaway in days",  is_secret: false },
  { key: "maintenance_mode",  value: "false",           type: "boolean", description: "Put the API in read-only maintenance mode",is_secret: false },
];

// ── Seed runner ───────────────────────────────────────────────────────────

async function seed() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    console.log("🌱 Seeding database…");

    // 1. Users
    for (const u of SEED_USERS) {
      await client.query(
        `INSERT INTO users (username, email, password_hash, role, active)
         VALUES ($1,$2,$3,$4,true) ON CONFLICT (username) DO NOTHING`,
        [u.username, u.email, u.passwordHash, u.role],
      );
    }
    console.log("  ✓ Users");

    // 2. Categories — get or insert, keep track of slug→id
    const catIdBySlug: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      const { rows } = await client.query(
        `INSERT INTO categories (name, slug, description, icon, active, item_count)
         VALUES ($1,$2,$3,$4,true,0)
         ON CONFLICT (slug) DO UPDATE SET name=$1, description=$3
         RETURNING id`,
        [cat.name, cat.slug, cat.description, cat.icon],
      );
      catIdBySlug[cat.slug] = rows[0].id;
    }
    console.log("  ✓ Categories");

    // 3. API endpoints documentation
    for (const ep of ENDPOINTS) {
      const catId = catIdBySlug[ep.slug] ?? catIdBySlug["utils"];
      await client.query(
        `INSERT INTO api_endpoints (path, method, description, active, category_id, request_count, response_json, requires_auth, rate_limit)
         VALUES ($1,$2,$3,true,$4,0,$5,$6,null)
         ON CONFLICT (path, method) DO UPDATE
           SET description=$3, response_json=$5, requires_auth=$6`,
        [ep.path, ep.method, ep.description, catId, ep.response, ep.requires_auth],
      );
    }
    console.log("  ✓ API endpoint documentation");

    // 4. Games
    for (const g of GAMES) {
      await client.query(
        `INSERT INTO games (name, slug, type, description, active, play_count)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (slug) DO UPDATE SET name=$1, description=$4, active=$5`,
        [g.name, g.slug, g.type, g.description, g.active, g.play_count],
      );
    }
    console.log("  ✓ Games");

    // 5. Config
    for (const c of CONFIG_ENTRIES) {
      await client.query(
        `INSERT INTO config (key, value, type, description, is_secret)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (key) DO NOTHING`,
        [c.key, c.value, c.type, c.description, c.is_secret],
      );
    }
    console.log("  ✓ Config");

    console.log("\n✅ Seed complete!\n");
    console.log("  Default credentials (dev only):");
    console.log("    Owner:     heave_owner / admin123");
    console.log("    Admin:     admin_alex  / mod123");
    console.log("    Moderator: mod_sara    / mod123");
    console.log("\n  Next: go to /admin/login and sign in.");
  } finally {
    await client.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
