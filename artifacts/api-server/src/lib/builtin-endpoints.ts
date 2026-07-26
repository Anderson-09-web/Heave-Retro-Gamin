/**
 * builtin-endpoints.ts
 *
 * Single source of truth for all documented API endpoints and their categories.
 * Imported by:
 *   - auto-seed.ts  → upserts to DB on startup
 *   - routes/endpoints.ts → returned as fallback when DB is empty / unreachable
 */

export type BuiltinCategory = {
  name: string;
  slug: string;
  description: string;
  icon: string;
};

export type BuiltinEndpoint = {
  path: string;
  method: string;
  description: string;
  categorySlug: string;
  requiresAuth: boolean;
  response: string;
};

const j = (o: object) => JSON.stringify(o, null, 2);

export const BUILTIN_CATEGORIES: BuiltinCategory[] = [
  { name: "Anime · Hug",    slug: "anime-hug",    description: "Anime hug reaction GIFs",       icon: "heart" },
  { name: "Anime · Kiss",   slug: "anime-kiss",   description: "Anime kiss reaction GIFs",      icon: "heart" },
  { name: "Anime · Slap",   slug: "anime-slap",   description: "Anime slap reaction GIFs",      icon: "zap" },
  { name: "Anime · Pat",    slug: "anime-pat",    description: "Anime pat reaction GIFs",       icon: "hand" },
  { name: "Anime · Cry",    slug: "anime-cry",    description: "Anime crying GIFs",             icon: "droplet" },
  { name: "Anime · Wave",   slug: "anime-wave",   description: "Anime wave GIFs",               icon: "hand" },
  { name: "Anime · Dance",  slug: "anime-dance",  description: "Anime dance GIFs",              icon: "music" },
  { name: "Anime · Poke",   slug: "anime-poke",   description: "Anime poke reaction GIFs",      icon: "pointer" },
  { name: "Anime · Bite",   slug: "anime-bite",   description: "Anime bite reaction GIFs",      icon: "zap" },
  { name: "Anime · Blush",  slug: "anime-blush",  description: "Anime blushing GIFs",           icon: "smile" },
  { name: "Anime · Smile",  slug: "anime-smile",  description: "Anime smile GIFs",              icon: "smile" },
  { name: "Anime · Wink",   slug: "anime-wink",   description: "Anime wink GIFs",               icon: "eye" },
  { name: "Anime · Lick",   slug: "anime-lick",   description: "Anime lick GIFs",               icon: "zap" },
  { name: "Anime · Punch",  slug: "anime-punch",  description: "Anime punch GIFs",              icon: "zap" },
  { name: "Anime · Shoot",  slug: "anime-shoot",  description: "Anime shooting reaction GIFs", icon: "zap" },
  { name: "Anime · Kill",   slug: "anime-kill",   description: "Anime attack reaction GIFs",   icon: "zap" },
  { name: "Anime · Cuddle", slug: "anime-cuddle", description: "Anime cuddle GIFs",             icon: "heart" },
  { name: "Anime · Nom",    slug: "anime-nom",    description: "Anime nom/eating GIFs",         icon: "zap" },
  { name: "Anime · Baka",   slug: "anime-baka",   description: "Anime baka reaction GIFs",      icon: "zap" },
  { name: "Waifus",         slug: "waifus",       description: "Random waifu images",           icon: "star" },
  { name: "Waifu · SFW",    slug: "waifu-sfw",    description: "Safe-for-work waifu images",    icon: "star" },
  { name: "Furry",          slug: "furry",        description: "Random furry images & GIFs",    icon: "paw-print" },
  { name: "Furry · Hug",    slug: "furry-hug",    description: "Furry hug GIFs",                icon: "heart" },
  { name: "Furry · Kiss",   slug: "furry-kiss",   description: "Furry kiss GIFs",               icon: "heart" },
  { name: "SFW · Meme",     slug: "sfw-meme",     description: "Anime memes",                   icon: "image" },
  { name: "SFW · Cat",      slug: "sfw-cat",      description: "Cat images",                    icon: "image" },
  { name: "SFW · Dog",      slug: "sfw-dog",      description: "Dog images",                    icon: "image" },
  { name: "Giveaways",      slug: "giveaways",    description: "Giveaway system",               icon: "gift" },
  { name: "Games",          slug: "games",        description: "Mini-games system",             icon: "gamepad-2" },
  { name: "Utilidades",     slug: "utils",        description: "Utility & public endpoints",    icon: "wrench" },
  { name: "Auth",           slug: "auth",         description: "Authentication endpoints",      icon: "lock" },
  { name: "Admin · Users",  slug: "admin-users",  description: "User management (admin only)",  icon: "users" },
  { name: "Admin · Keys",   slug: "admin-keys",   description: "API key management",            icon: "key" },
  { name: "Admin · Panel",  slug: "admin-panel",  description: "Dashboard & system endpoints",  icon: "layout-dashboard" },
];

// Synthetic category IDs used only when DB is unavailable (negative = builtin)
export const BUILTIN_CATEGORY_ID: Record<string, number> = Object.fromEntries(
  BUILTIN_CATEGORIES.map((c, i) => [c.slug, -(i + 1)]),
);

export const BUILTIN_ENDPOINTS: BuiltinEndpoint[] = [
  // ── Anime GIFs ─────────────────────────────────────────────────────────
  { path: "/v1/anime/:action", method: "GET", requiresAuth: false, categorySlug: "utils", description: "GIF aleatorio de anime por acción válida.", response: j({ url: "https://cdn.example.com/anime/hug/001.gif", type: "gif", action: "hug", source: "Heave Games API" }) },
  { path: "/v1/anime/hug",    method: "GET", requiresAuth: false, categorySlug: "anime-hug",    description: "GIF aleatorio de anime: abrazo.",        response: j({ url: "https://cdn.example.com/anime/hug/001.gif",    type: "gif", action: "hug",    source: "Heave Games API" }) },
  { path: "/v1/anime/kiss",   method: "GET", requiresAuth: false, categorySlug: "anime-kiss",   description: "GIF aleatorio de anime: beso.",          response: j({ url: "https://cdn.example.com/anime/kiss/001.gif",   type: "gif", action: "kiss",   source: "Heave Games API" }) },
  { path: "/v1/anime/slap",   method: "GET", requiresAuth: false, categorySlug: "anime-slap",   description: "GIF aleatorio de anime: bofetada.",      response: j({ url: "https://cdn.example.com/anime/slap/001.gif",   type: "gif", action: "slap",   source: "Heave Games API" }) },
  { path: "/v1/anime/pat",    method: "GET", requiresAuth: false, categorySlug: "anime-pat",    description: "GIF aleatorio de anime: palmadita.",     response: j({ url: "https://cdn.example.com/anime/pat/001.gif",    type: "gif", action: "pat",    source: "Heave Games API" }) },
  { path: "/v1/anime/cry",    method: "GET", requiresAuth: false, categorySlug: "anime-cry",    description: "GIF aleatorio de anime: llanto.",        response: j({ url: "https://cdn.example.com/anime/cry/001.gif",    type: "gif", action: "cry",    source: "Heave Games API" }) },
  { path: "/v1/anime/wave",   method: "GET", requiresAuth: false, categorySlug: "anime-wave",   description: "GIF aleatorio de anime: saludo.",        response: j({ url: "https://cdn.example.com/anime/wave/001.gif",   type: "gif", action: "wave",   source: "Heave Games API" }) },
  { path: "/v1/anime/dance",  method: "GET", requiresAuth: false, categorySlug: "anime-dance",  description: "GIF aleatorio de anime: baile.",         response: j({ url: "https://cdn.example.com/anime/dance/001.gif",  type: "gif", action: "dance",  source: "Heave Games API" }) },
  { path: "/v1/anime/poke",   method: "GET", requiresAuth: false, categorySlug: "anime-poke",   description: "GIF aleatorio de anime: poke.",          response: j({ url: "https://cdn.example.com/anime/poke/001.gif",   type: "gif", action: "poke",   source: "Heave Games API" }) },
  { path: "/v1/anime/bite",   method: "GET", requiresAuth: false, categorySlug: "anime-bite",   description: "GIF aleatorio de anime: mordida.",       response: j({ url: "https://cdn.example.com/anime/bite/001.gif",   type: "gif", action: "bite",   source: "Heave Games API" }) },
  { path: "/v1/anime/blush",  method: "GET", requiresAuth: false, categorySlug: "anime-blush",  description: "GIF aleatorio de anime: rubor.",         response: j({ url: "https://cdn.example.com/anime/blush/001.gif",  type: "gif", action: "blush",  source: "Heave Games API" }) },
  { path: "/v1/anime/smile",  method: "GET", requiresAuth: false, categorySlug: "anime-smile",  description: "GIF aleatorio de anime: sonrisa.",       response: j({ url: "https://cdn.example.com/anime/smile/001.gif",  type: "gif", action: "smile",  source: "Heave Games API" }) },
  { path: "/v1/anime/wink",   method: "GET", requiresAuth: false, categorySlug: "anime-wink",   description: "GIF aleatorio de anime: guiño.",         response: j({ url: "https://cdn.example.com/anime/wink/001.gif",   type: "gif", action: "wink",   source: "Heave Games API" }) },
  { path: "/v1/anime/lick",   method: "GET", requiresAuth: false, categorySlug: "anime-lick",   description: "GIF aleatorio de anime: lamer.",         response: j({ url: "https://cdn.example.com/anime/lick/001.gif",   type: "gif", action: "lick",   source: "Heave Games API" }) },
  { path: "/v1/anime/punch",  method: "GET", requiresAuth: false, categorySlug: "anime-punch",  description: "GIF aleatorio de anime: puñetazo.",      response: j({ url: "https://cdn.example.com/anime/punch/001.gif",  type: "gif", action: "punch",  source: "Heave Games API" }) },
  { path: "/v1/anime/shoot",  method: "GET", requiresAuth: false, categorySlug: "anime-shoot",  description: "GIF aleatorio de anime: disparo.",       response: j({ url: "https://cdn.example.com/anime/shoot/001.gif",  type: "gif", action: "shoot",  source: "Heave Games API" }) },
  { path: "/v1/anime/kill",   method: "GET", requiresAuth: false, categorySlug: "anime-kill",   description: "GIF aleatorio de anime: ataque.",        response: j({ url: "https://cdn.example.com/anime/kill/001.gif",   type: "gif", action: "kill",   source: "Heave Games API" }) },
  { path: "/v1/anime/cuddle", method: "GET", requiresAuth: false, categorySlug: "anime-cuddle", description: "GIF aleatorio de anime: acurrucarse.",   response: j({ url: "https://cdn.example.com/anime/cuddle/001.gif", type: "gif", action: "cuddle", source: "Heave Games API" }) },
  { path: "/v1/anime/nom",    method: "GET", requiresAuth: false, categorySlug: "anime-nom",    description: "GIF aleatorio de anime: nom nom.",       response: j({ url: "https://cdn.example.com/anime/nom/001.gif",    type: "gif", action: "nom",    source: "Heave Games API" }) },
  { path: "/v1/anime/baka",   method: "GET", requiresAuth: false, categorySlug: "anime-baka",   description: "GIF aleatorio de reacción 'baka!'.",     response: j({ url: "https://cdn.example.com/anime/baka/001.gif",   type: "gif", action: "baka",   source: "Heave Games API" }) },
  // ── Waifus ─────────────────────────────────────────────────────────────
  { path: "/v1/waifu",        method: "GET", requiresAuth: false, categorySlug: "waifus",       description: "Imagen aleatoria de waifu.",             response: j({ url: "https://cdn.example.com/waifu/001.jpg",        type: "image",               source: "Heave Games API" }) },
  { path: "/v1/waifu/:tag",    method: "GET", requiresAuth: false, categorySlug: "waifus",       description: "Imagen de waifu por etiqueta, con fallback general.", response: j({ url: "https://cdn.example.com/waifu/001.jpg", type: "image", tag: "sfw", source: "Heave Games API" }) },
  { path: "/v1/waifu/sfw",    method: "GET", requiresAuth: false, categorySlug: "waifu-sfw",    description: "Imagen SFW aleatoria de waifu.",         response: j({ url: "https://cdn.example.com/waifu/sfw/001.jpg",    type: "image", tag: "sfw",  source: "Heave Games API" }) },
  // ── Furry ──────────────────────────────────────────────────────────────
  { path: "/v1/furry",        method: "GET", requiresAuth: false, categorySlug: "furry",        description: "Imagen/GIF aleatorio furry.",             response: j({ url: "https://cdn.example.com/furry/001.gif",        type: "gif",                 source: "Heave Games API" }) },
  { path: "/v1/furry/:tag",   method: "GET", requiresAuth: false, categorySlug: "furry",        description: "Imagen/GIF furry por etiqueta, con fallback general.", response: j({ url: "https://cdn.example.com/furry/001.gif", type: "gif", tag: "hug", source: "Heave Games API" }) },
  { path: "/v1/furry/hug",    method: "GET", requiresAuth: false, categorySlug: "furry-hug",    description: "GIF furry de abrazo.",                   response: j({ url: "https://cdn.example.com/furry/hug/001.gif",    type: "gif",   tag: "hug",  source: "Heave Games API" }) },
  { path: "/v1/furry/kiss",   method: "GET", requiresAuth: false, categorySlug: "furry-kiss",   description: "GIF furry de beso.",                     response: j({ url: "https://cdn.example.com/furry/kiss/001.gif",   type: "gif",   tag: "kiss", source: "Heave Games API" }) },
  // ── SFW ────────────────────────────────────────────────────────────────
  { path: "/v1/sfw/meme",     method: "GET", requiresAuth: false, categorySlug: "sfw-meme",     description: "Meme de anime aleatorio.",               response: j({ url: "https://cdn.example.com/sfw/meme/001.jpg",     type: "image", tag: "meme", source: "Heave Games API" }) },
  { path: "/v1/sfw/cat",      method: "GET", requiresAuth: false, categorySlug: "sfw-cat",      description: "Imagen de gato aleatoria.",              response: j({ url: "https://cdn.example.com/sfw/cat/001.jpg",      type: "image", tag: "cat",  source: "Heave Games API" }) },
  { path: "/v1/sfw/dog",      method: "GET", requiresAuth: false, categorySlug: "sfw-dog",      description: "Imagen de perro aleatoria.",             response: j({ url: "https://cdn.example.com/sfw/dog/001.jpg",      type: "image", tag: "dog",  source: "Heave Games API" }) },
  { path: "/v1/sfw/:tag",     method: "GET", requiresAuth: false, categorySlug: "utils",       description: "Imagen segura por etiqueta.",              response: j({ url: "https://cdn.example.com/sfw/cat/001.jpg", type: "image", tag: "cat", source: "Heave Games API" }) },
  // ── Auth ───────────────────────────────────────────────────────────────
  { path: "/api/auth/login",              method: "POST",   requiresAuth: false, categorySlug: "auth",        description: "Login con usuario y contraseña. Devuelve Bearer token.",          response: j({ token: "eyJ...", user: { id: 1, username: "heave_owner", role: "owner" } }) },
  { path: "/api/auth/discord",            method: "GET",    requiresAuth: false, categorySlug: "auth",        description: "Redirige a Discord OAuth2 para login.",                           response: j({ redirect: "https://discord.com/oauth2/authorize?..." }) },
  { path: "/api/auth/discord/callback",   method: "GET",    requiresAuth: false, categorySlug: "auth",        description: "Callback OAuth2 de Discord. Completa el login.",                  response: j({ token: "eyJ...", user: { id: 1, username: "cool_user", role: "user" } }) },
  { path: "/api/auth/me",                 method: "GET",    requiresAuth: true,  categorySlug: "auth",        description: "Devuelve el usuario autenticado actualmente.",                    response: j({ id: 1, username: "heave_owner", email: "owner@example.com", role: "owner" }) },
  { path: "/api/auth/logout",             method: "POST",   requiresAuth: true,  categorySlug: "auth",        description: "Invalida la sesión/token actual.",                                response: j({ success: true }) },
  // ── Users (admin) ──────────────────────────────────────────────────────
  { path: "/api/users",                   method: "GET",    requiresAuth: true,  categorySlug: "admin-users", description: "Lista todos los usuarios (admin).",                               response: j([{ id: 1, username: "heave_owner", role: "owner", active: true }]) },
  { path: "/api/users",                   method: "POST",   requiresAuth: true,  categorySlug: "admin-users", description: "Crea un usuario del panel.",                                      response: j({ id: 2, username: "new_user", role: "user", active: true }) },
  { path: "/api/users/:id",               method: "GET",    requiresAuth: true,  categorySlug: "admin-users", description: "Obtiene un usuario por ID.",                                      response: j({ id: 1, username: "heave_owner", role: "owner", active: true }) },
  { path: "/api/users/:id",               method: "PATCH",  requiresAuth: true,  categorySlug: "admin-users", description: "Actualiza datos de un usuario.",                                  response: j({ id: 1, username: "heave_owner", role: "owner", active: true }) },
  { path: "/api/users/:id",               method: "DELETE", requiresAuth: true,  categorySlug: "admin-users", description: "Elimina un usuario por ID.",                                      response: j({ success: true }) },
  { path: "/api/users/:id/role",          method: "PATCH",  requiresAuth: true,  categorySlug: "admin-users", description: "Cambia el rol (owner / admin / moderator / user).",               response: j({ id: 1, role: "admin" }) },
  // ── API Keys ───────────────────────────────────────────────────────────
  { path: "/api/api-keys",                method: "GET",    requiresAuth: true,  categorySlug: "admin-keys",  description: "Lista todas las API keys.",                                       response: j([{ id: 1, name: "Bot Key", key: "hg_...", active: true }]) },
  { path: "/api/api-keys",                method: "POST",   requiresAuth: true,  categorySlug: "admin-keys",  description: "Crea una nueva API key.",                                         response: j({ id: 2, name: "New Key", key: "hg_abc123", active: true }) },
  { path: "/api/api-keys/:id",            method: "PATCH",  requiresAuth: true,  categorySlug: "admin-keys",  description: "Actualiza una API key.",                                            response: j({ id: 1, name: "Bot Key", active: false }) },
  { path: "/api/api-keys/:id",            method: "DELETE", requiresAuth: true,  categorySlug: "admin-keys",  description: "Elimina una API key.",                                            response: j({ success: true }) },
  { path: "/api/api-keys/:id/revoke",     method: "POST",   requiresAuth: true,  categorySlug: "admin-keys",  description: "Revoca (desactiva) una API key sin eliminarla.",                  response: j({ id: 1, active: false }) },
  // ── Categories ─────────────────────────────────────────────────────────
  { path: "/api/categories",              method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Lista todas las categorías de imágenes.",                         response: j([{ id: 1, name: "Anime · Hug", slug: "anime-hug", itemCount: 25 }]) },
  { path: "/api/categories",              method: "POST",   requiresAuth: true,  categorySlug: "admin-panel", description: "Crea una nueva categoría.",                                       response: j({ id: 32, name: "Nueva", slug: "nueva", active: true }) },
  { path: "/api/categories/:id",          method: "PATCH",  requiresAuth: true,  categorySlug: "admin-panel", description: "Actualiza una categoría.",                                        response: j({ id: 1, name: "Editada", slug: "anime-hug" }) },
  { path: "/api/categories/:id",          method: "DELETE", requiresAuth: true,  categorySlug: "admin-panel", description: "Elimina una categoría.",                                          response: j({ success: true }) },
  // ── Endpoints (admin) ──────────────────────────────────────────────────
  { path: "/api/endpoints",              method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Lista todos los endpoints documentados.",                          response: j([{ id: 1, path: "/v1/anime/hug", method: "GET", active: true }]) },
  { path: "/api/endpoints",              method: "POST",   requiresAuth: true,  categorySlug: "admin-panel", description: "Crea un nuevo endpoint en la documentación.",                    response: j({ id: 50, path: "/v1/nuevo", method: "GET", active: true }) },
  { path: "/api/endpoints/:id",          method: "PATCH",  requiresAuth: true,  categorySlug: "admin-panel", description: "Actualiza un endpoint documentado.",                              response: j({ id: 1, path: "/v1/anime/hug", description: "Editado" }) },
  { path: "/api/endpoints/:id",          method: "DELETE", requiresAuth: true,  categorySlug: "admin-panel", description: "Elimina un endpoint de la documentación.",                       response: j({ success: true }) },
  { path: "/api/endpoints/:id/toggle",   method: "POST",   requiresAuth: true,  categorySlug: "admin-panel", description: "Activa o desactiva un endpoint documentado.",                    response: j({ id: 1, active: false }) },
  // ── Images (admin) ─────────────────────────────────────────────────────
  { path: "/api/images",                  method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Lista todas las imágenes/GIFs subidas.",                         response: j([{ id: 1, url: "https://...", type: "gif", categoryId: 1 }]) },
  { path: "/api/images",                  method: "POST",   requiresAuth: true,  categorySlug: "admin-panel", description: "Sube una nueva imagen o GIF.",                                   response: j({ id: 2, url: "https://...", type: "gif", categoryId: 1 }) },
  { path: "/api/images/:id",              method: "DELETE", requiresAuth: true,  categorySlug: "admin-panel", description: "Elimina una imagen por ID.",                                     response: j({ success: true }) },
  // ── Giveaways ──────────────────────────────────────────────────────────
  { path: "/api/giveaways",               method: "GET",    requiresAuth: true,  categorySlug: "giveaways",   description: "Lista todos los giveaways activos.",                              response: j([{ id: 1, title: "Nitro Giveaway", status: "active", participantCount: 42 }]) },
  { path: "/api/giveaways",               method: "POST",   requiresAuth: true,  categorySlug: "giveaways",   description: "Crea un nuevo giveaway.",                                        response: j({ id: 2, title: "Nuevo Giveaway", status: "active", participantCount: 0 }) },
  { path: "/api/giveaways/:id",           method: "GET",    requiresAuth: true,  categorySlug: "giveaways",   description: "Obtiene un giveaway por ID.",                                    response: j({ id: 1, title: "Nitro Giveaway", status: "active", participants: [] }) },
  { path: "/api/giveaways/:id",           method: "DELETE", requiresAuth: true,  categorySlug: "giveaways",   description: "Elimina un giveaway.",                                          response: j({ success: true }) },
  { path: "/api/giveaways/:id/end",       method: "POST",   requiresAuth: true,  categorySlug: "giveaways",   description: "Termina un giveaway y selecciona ganador aleatorio.",            response: j({ id: 1, status: "ended", winnerName: "cool_user" }) },
  // ── Games ──────────────────────────────────────────────────────────────
  { path: "/api/games",                   method: "GET",    requiresAuth: false, categorySlug: "games",       description: "Lista todos los mini-juegos disponibles.",                        response: j([{ id: 1, name: "TIC TAC TOE", slug: "tictactoe", type: "turn_based", active: true }]) },
  { path: "/api/games",                   method: "POST",   requiresAuth: true,  categorySlug: "games",       description: "Crea un nuevo juego (admin).",                                   response: j({ id: 8, name: "Nuevo Juego", slug: "nuevo", active: false }) },
  { path: "/api/games/:id",               method: "PATCH",  requiresAuth: true,  categorySlug: "games",       description: "Actualiza datos de un juego.",                                   response: j({ id: 1, name: "TIC TAC TOE", active: true }) },
  { path: "/api/games/:id",               method: "DELETE", requiresAuth: true,  categorySlug: "games",       description: "Elimina un juego.",                                              response: j({ success: true }) },
  { path: "/api/games/stats",             method: "GET",    requiresAuth: true,  categorySlug: "games",       description: "Estadísticas de juego (partidas, jugadores únicos).",            response: j([{ gameId: 1, gameName: "TIC TAC TOE", playCount: 1240, uniquePlayers: 744 }]) },
  // ── Dashboard (admin) ──────────────────────────────────────────────────
  { path: "/api/dashboard/stats",         method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Estadísticas generales del panel de control.",                   response: j({ totalUsers: 120, totalEndpoints: 48, activeKeys: 35, totalGames: 7 }) },
  { path: "/api/dashboard/activity",      method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Actividad reciente del sistema.",                                response: j([{ type: "user_login", detail: "heave_owner", createdAt: "2025-07-26T00:00:00Z" }]) },
  { path: "/api/dashboard/top-endpoints", method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Top endpoints por número de solicitudes.",                       response: j([{ path: "/v1/anime/hug", requestCount: 4200 }]) },
  // ── Logs (admin) ───────────────────────────────────────────────────────
  { path: "/api/logs",                    method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Registro de solicitudes al API.",                                response: j([{ id: 1, method: "GET", path: "/v1/anime/hug", status: 200 }]) },
  { path: "/api/logs/errors",             method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Registro de errores del sistema.",                               response: j([{ id: 1, message: "DB timeout", level: "error" }]) },
  // ── Services (admin) ───────────────────────────────────────────────────
  { path: "/api/services/status",         method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Estado de los servicios (DB, API, cache).",                     response: j([{ name: "PostgreSQL", status: "ok", latencyMs: 4 }]) },
  { path: "/api/services/performance",    method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Métricas de rendimiento del servidor.",                         response: j({ cpu: 12.5, memoryMb: 256, uptimeHours: 48 }) },
  // ── Backups (admin) ────────────────────────────────────────────────────
  { path: "/api/backups",                 method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Lista los backups disponibles.",                                 response: j([{ id: 1, filename: "backup-2025-07-26.sql", sizeKb: 512 }]) },
  { path: "/api/backups",                 method: "POST",   requiresAuth: true,  categorySlug: "admin-panel", description: "Crea un backup de la base de datos.",                            response: j({ id: 2, filename: "backup-2025-07-26.sql", status: "completed" }) },
  { path: "/api/backups/:id/restore",     method: "POST",   requiresAuth: true,  categorySlug: "admin-panel", description: "Restaura la base de datos desde un backup.",                    response: j({ success: true, restoredAt: "2025-07-26T00:00:00Z" }) },
  // ── Config (admin) ─────────────────────────────────────────────────────
  { path: "/api/config",                  method: "GET",    requiresAuth: true,  categorySlug: "admin-panel", description: "Lista la configuración del sistema.",                            response: j([{ key: "rate_limit_default", value: "100", type: "number" }]) },
  { path: "/api/config",                  method: "POST",   requiresAuth: true,  categorySlug: "admin-panel", description: "Crea o guarda una configuración del sistema.",                    response: j({ key: "rate_limit_default", value: "100", type: "number" }) },
  { path: "/api/config/:key",             method: "PATCH",  requiresAuth: true,  categorySlug: "admin-panel", description: "Actualiza un valor de configuración.",                          response: j({ key: "rate_limit_default", value: "200" }) },
  { path: "/api/config/:key",             method: "DELETE", requiresAuth: true,  categorySlug: "admin-panel", description: "Elimina una configuración del sistema.",                          response: j({ success: true }) },
  // ── Public ─────────────────────────────────────────────────────────────
  { path: "/api/public/stats",            method: "GET",    requiresAuth: false, categorySlug: "utils",       description: "Estadísticas públicas de la plataforma (para bots).",            response: j({ totalEndpoints: 48, totalUsers: 120, activeKeys: 35, totalGames: 7 }) },
  { path: "/api/public/categories",       method: "GET",    requiresAuth: false, categorySlug: "utils",       description: "Lista todas las categorías públicas de imágenes.",               response: j([{ id: 1, name: "Anime · Hug", slug: "anime-hug", itemCount: 25 }]) },
  { path: "/api/public/changelog",        method: "GET",    requiresAuth: false, categorySlug: "utils",       description: "Historial de cambios de la API (changelog).",                   response: j([{ version: "1.2.0", title: "Nuevas rutas GIF", type: "feature" }]) },
  // ── Health ─────────────────────────────────────────────────────────────
  { path: "/api/healthz",                 method: "GET",    requiresAuth: false, categorySlug: "utils",       description: "Health check — 200 si el servidor está operativo.",              response: j({ status: "ok" }) },
];

/** Map builtin endpoints to the shape the frontend expects */
export function builtinToApiShape() {
  let id = -1;
  return BUILTIN_ENDPOINTS.map((ep) => ({
    id: id--,                                         // negative = builtin (read-only)
    path: ep.path,
    method: ep.method,
    description: ep.description,
    active: true,
    categoryId: BUILTIN_CATEGORY_ID[ep.categorySlug] ?? -99,
    requestCount: 0,
    responseJson: ep.response,
    requiresAuth: ep.requiresAuth,
    rateLimit: null as number | null,
    createdAt: new Date(0).toISOString(),
  }));
}
