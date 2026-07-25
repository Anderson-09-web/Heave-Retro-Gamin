import React, { useState } from "react";
import { Link } from "wouter";
import { useGetPublicStats, useGetPublicCategories } from "@workspace/api-client-react";
import { Gamepad2, Layers, Zap, Code, Shield, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "> HOME", href: "#home" },
  { label: "> GAMES", href: "/games" },
  { label: "> FEATURES", href: "#features" },
  { label: "> API", href: "#api" },
  { label: "> ADMIN", href: "/admin/login" },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/heave-logo.jpg"
        alt="Heave Retro"
        className="w-10 h-10 object-contain"
        style={{ imageRendering: "pixelated" }}
      />
      <div>
        <div
          className="text-xs font-bold leading-tight"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: "#00ffff",
            textShadow: "0 0 8px #00ffff",
          }}
        >
          HEAVE
        </div>
        <div
          className="text-xs leading-tight"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: "#ff00ff",
            textShadow: "0 0 8px #ff00ff",
          }}
        >
          RETRO
        </div>
      </div>
    </div>
  );
}

function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  return (
    <aside
      className="flex flex-col bg-black border-r h-full"
      style={{ borderColor: "rgba(0,255,255,0.25)" }}
    >
      {/* Logo */}
      <div
        className="p-6 border-b"
        style={{ borderColor: "rgba(0,255,255,0.25)" }}
      >
        <div className="flex items-center justify-between">
          <Logo />
          {onClose && (
            <button onClick={onClose} className="md:hidden text-cyan-400">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-8 px-4 space-y-1">
        {NAV_LINKS.map((link) =>
          link.href.startsWith("/") ? (
            <Link
              key={link.label}
              href={link.href}
              className="block px-4 py-3 text-xs transition-all duration-100 hover:bg-cyan-400/10"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: "#00ffff",
                fontSize: "9px",
                letterSpacing: "0.05em",
              }}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="block px-4 py-3 text-xs transition-all duration-100 hover:bg-cyan-400/10"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: "#00ffff",
                fontSize: "9px",
                letterSpacing: "0.05em",
              }}
              onClick={onClose}
            >
              {link.label}
            </a>
          )
        )}

        {/* Discord Login */}
        <div className="pt-6">
          <Link
            href="/login"
            className="block px-4 py-3 text-xs text-center border-2 transition-all duration-100"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              borderColor: "#ff00ff",
              color: "#ff00ff",
              fontSize: "9px",
            }}
            onClick={onClose}
          >
            PLAY NOW
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div
        className="p-4 border-t text-center"
        style={{ borderColor: "rgba(0,255,255,0.15)" }}
      >
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#555" }}>
          © 2025 HEAVE RETRO
        </p>
      </div>
    </aside>
  );
}

export default function Landing() {
  const { data: stats } = useGetPublicStats();
  const { data: categories } = useGetPublicCategories();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 h-full">
            <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-56 md:flex-shrink-0 md:fixed md:inset-y-0 md:left-0 md:z-40">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-56 flex flex-col relative">
        {/* Mobile topbar */}
        <div
          className="md:hidden flex items-center gap-4 px-4 py-3 border-b"
          style={{ borderColor: "rgba(0,255,255,0.25)" }}
        >
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>
          <Logo />
        </div>

        {/* Hero */}
        <section
          id="home"
          className="relative flex flex-col items-center justify-center min-h-screen px-8 py-24 text-center overflow-hidden scanlines"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Logo large */}
          <img
            src="/heave-logo.jpg"
            alt="Heave Retro"
            className="relative z-10 w-24 h-24 object-contain mb-8"
            style={{ imageRendering: "pixelated" }}
          />

          <h1
            className="relative z-10 mb-4 leading-tight"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(1.2rem, 4vw, 2.5rem)",
              color: "#00ffff",
              textShadow: "0 0 20px #00ffff, 0 0 40px #00ffff",
              letterSpacing: "0.05em",
            }}
          >
            HEAVE RETRO
          </h1>

          <p
            className="relative z-10 mb-2"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(0.5rem, 1.5vw, 0.75rem)",
              color: "#ff00ff",
              textShadow: "0 0 10px #ff00ff",
              letterSpacing: "0.1em",
            }}
          >
            FREE RETRO GAMES — PLAY ONLINE WITH DISCORD
          </p>

          <div
            className="relative z-10 mt-2 mb-10"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.9rem",
              color: "#888",
              maxWidth: "600px",
            }}
          >
            Juega gratis. Todos los juegos son gratuitos. Inicia sesión con
            Discord para jugar en línea con tus amigos.
          </div>

          {/* CTA buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/games"
              className="inline-flex items-center justify-center px-8 py-4 text-xs border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-100 font-bold"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
            >
              ▶ PLAY NOW
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-xs border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black transition-all duration-100 font-bold"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
            >
              SIGN IN
            </Link>
          </div>

          {/* Blinking cursor */}
          <div
            className="relative z-10 mt-16"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              color: "#00ffff",
            }}
          >
            <span>INSERT COIN</span>
            <span
              className="blink ml-1"
              style={{ color: "#00ffff" }}
            >
              _
            </span>
          </div>
        </section>

        {/* Stats */}
        <section
          className="py-12 border-y"
          style={{ borderColor: "rgba(0,255,255,0.2)" }}
        >
          <div className="max-w-4xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                val: stats?.requestsToday?.toLocaleString() ?? "50K+",
                label: "REQUESTS TODAY",
              },
              {
                val: stats?.totalEndpoints ?? "50+",
                label: "API ENDPOINTS",
              },
              {
                val: stats?.totalGames ?? "15",
                label: "FREE GAMES",
              },
              {
                val: stats?.uptime ? `${stats.uptime}%` : "99.9%",
                label: "UPTIME",
              },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    color: "#00ffff",
                    textShadow: "0 0 10px #00ffff",
                    fontSize: "clamp(1rem, 3vw, 1.75rem)",
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "10px",
                    color: "#666",
                    letterSpacing: "0.15em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <h2
              className="mb-12 text-center"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(0.7rem, 2vw, 1.2rem)",
                color: "#ff00ff",
                textShadow: "0 0 10px #ff00ff",
                letterSpacing: "0.1em",
              }}
            >
              FEATURES
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Gamepad2 className="w-6 h-6" />,
                  title: "MULTIPLAYER",
                  desc: "Tic Tac Toe, Connect 4, UNO, Chess. Juega online gratis con Discord OAuth2.",
                  color: "#00ffff",
                },
                {
                  icon: <Layers className="w-6 h-6" />,
                  title: "ANIME GIFs",
                  desc: "Hug, kiss, pat, slap. Colección curada de GIFs de alta calidad.",
                  color: "#ff00ff",
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "GIVEAWAYS",
                  desc: "Crea y gestiona sorteos. Selección justa de ganadores automática.",
                  color: "#ffff00",
                },
                {
                  icon: <Code className="w-6 h-6" />,
                  title: "SDKs",
                  desc: "discord.py, discord.js, Python, TypeScript y BDFD.",
                  color: "#00ff88",
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "SEGURO",
                  desc: "Auth con Discord OAuth2. Sin contraseñas para los jugadores.",
                  color: "#ff6600",
                },
                {
                  icon: <Gamepad2 className="w-6 h-6" />,
                  title: "GRATUITO",
                  desc: "100% gratis. Solo inicia sesión con Discord para jugar online.",
                  color: "#ff00ff",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="p-6 border bg-black/80 hover:bg-black transition-all duration-100 group"
                  style={{ borderColor: `${f.color}40` }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = f.color;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${f.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${f.color}40`;
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div
                    className="mb-4"
                    style={{ color: f.color, filter: `drop-shadow(0 0 6px ${f.color})` }}
                  >
                    {f.icon}
                  </div>
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "9px",
                      color: f.color,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "11px",
                      color: "#888",
                      lineHeight: "1.7",
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Games section */}
        <section
          id="games"
          className="py-20 px-8 border-t"
          style={{ borderColor: "rgba(0,255,255,0.2)" }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2
              className="mb-4"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(0.7rem, 2vw, 1.2rem)",
                color: "#00ffff",
                textShadow: "0 0 10px #00ffff",
              }}
            >
              FREE GAMES
            </h2>
            <p
              className="mb-12"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px",
                color: "#888",
              }}
            >
              Todos los juegos son gratuitos. Solo necesitas iniciar sesión con Discord para jugar online.
            </p>
            <Link
              href="/games"
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-100"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
            >
              ▶ VER TODOS LOS JUEGOS
            </Link>
          </div>
        </section>

        {/* API section */}
        <section
          id="api"
          className="py-20 px-8 border-t"
          style={{ borderColor: "rgba(255,0,255,0.2)" }}
        >
          <div className="max-w-4xl mx-auto">
            <h2
              className="mb-8"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "clamp(0.7rem, 2vw, 1rem)",
                color: "#ff00ff",
                textShadow: "0 0 10px #ff00ff",
              }}
            >
              API REFERENCE
            </h2>
            <div
              className="p-6 border"
              style={{
                borderColor: "rgba(0,255,255,0.3)",
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px",
                color: "#00ffff",
                lineHeight: "1.8",
              }}
            >
              <div style={{ color: "#666", marginBottom: "8px" }}># Base URL</div>
              <div>GET https://api.heavegames.com/v1/</div>
              <div style={{ color: "#666", marginTop: "16px", marginBottom: "8px" }}># Auth</div>
              <div>Authorization: Bearer {"<token>"}</div>
              <div style={{ color: "#666", marginTop: "16px", marginBottom: "8px" }}># Discord OAuth2</div>
              <div>GET /api/auth/discord</div>
              <div style={{ color: "#888" }}>→ Redirect to Discord login</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-8 px-8 border-t text-center"
          style={{ borderColor: "rgba(0,255,255,0.15)" }}
        >
          <div
            className="flex items-center justify-center gap-2 mb-4"
          >
            <img src="/heave-logo.jpg" alt="logo" className="w-6 h-6 object-contain" />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "10px",
                color: "#00ffff",
              }}
            >
              HEAVE RETRO
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: "#444",
            }}
          >
            © 2025 Heave Retro — Juegos gratuitos con Discord OAuth2
          </p>
        </footer>
      </div>
    </div>
  );
}
