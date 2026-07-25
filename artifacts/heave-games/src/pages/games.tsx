import React from "react";
import { Link } from "wouter";
import { Gamepad2, Loader2 } from "lucide-react";

// Fallback game list for when DB is empty
const DEMO_GAMES = [
  { id: 1, name: "TIC TAC TOE", slug: "tictactoe", type: "turn_based", description: "Clásico X vs O. Juega contra un amigo.", active: true, playCount: 1240 },
  { id: 2, name: "CONNECT 4", slug: "connect4", type: "turn_based", description: "Sé el primero en conectar 4 fichas.", active: true, playCount: 890 },
  { id: 3, name: "UNO", slug: "uno", type: "card", description: "El juego de cartas más popular del mundo.", active: true, playCount: 2100 },
  { id: 4, name: "CHESS", slug: "chess", type: "turn_based", description: "Ajedrez clásico online.", active: true, playCount: 550 },
  { id: 5, name: "CHECKERS", slug: "checkers", type: "turn_based", description: "Damas. El juego de mesa clásico.", active: true, playCount: 320 },
];

const TYPE_COLORS: Record<string, string> = {
  turn_based: "#00ffff",
  card: "#ff00ff",
  action: "#ffff00",
  puzzle: "#00ff88",
};

export default function Games() {
  const [games, setGames] = React.useState<typeof DEMO_GAMES>(DEMO_GAMES);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem("heave_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch("/api/games", { headers })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setGames(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePlay = (slug: string) => {
    const token = localStorage.getItem("heave_token");
    if (!token) {
      // Redirect to Discord login for online play
      window.location.href = "/api/auth/discord";
    } else {
      // TODO: launch game session
      alert(`Launching ${slug}... (online mode coming soon)`);
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Header */}
      <div
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "rgba(0,255,255,0.25)" }}
      >
        <Link href="/">
          <div className="flex items-center gap-3">
            <img
              src="/heave-logo.jpg"
              alt="Heave Retro"
              className="w-8 h-8 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "10px",
                color: "#00ffff",
                textShadow: "0 0 8px #00ffff",
              }}
            >
              HEAVE RETRO
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="border px-4 py-2 transition-all duration-100"
            style={{
              borderColor: "#ff00ff",
              color: "#ff00ff",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
            }}
          >
            SIGN IN
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="py-16 px-6 text-center">
        <h1
          className="mb-4"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(1rem, 4vw, 2rem)",
            color: "#00ffff",
            textShadow: "0 0 20px #00ffff",
          }}
        >
          FREE GAMES
        </h1>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px",
            color: "#888",
          }}
        >
          Todos los juegos son gratuitos.{" "}
          <span style={{ color: "#5865f2" }}>Inicia sesión con Discord</span> para jugar online.
        </p>
      </div>

      {/* Games grid */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "#00ffff" }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const color = TYPE_COLORS[game.type] ?? "#00ffff";
              return (
                <div
                  key={game.id}
                  className="p-6 border bg-black/60 flex flex-col gap-4 transition-all duration-100"
                  style={{ borderColor: `${color}30` }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = color;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}25`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${color}30`;
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 flex items-center justify-center border"
                    style={{ borderColor: `${color}50`, color }}
                  >
                    <Gamepad2 className="w-6 h-6" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: "9px",
                        color,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {game.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        color: "#777",
                        lineHeight: "1.6",
                      }}
                    >
                      {game.description}
                    </p>
                  </div>

                  {/* Stats + play */}
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "10px",
                        color: "#444",
                      }}
                    >
                      {game.playCount.toLocaleString()} plays
                    </span>
                    <button
                      onClick={() => handlePlay(game.slug)}
                      className="px-4 py-2 border transition-all duration-100"
                      style={{
                        borderColor: color,
                        color,
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: "7px",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = color;
                        (e.currentTarget as HTMLElement).style.color = "#000";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = color;
                      }}
                    >
                      ▶ PLAY
                    </button>
                  </div>

                  {/* Badge */}
                  <div>
                    <span
                      className="px-2 py-1 border"
                      style={{
                        borderColor: `${color}40`,
                        color: `${color}90`,
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "9px",
                      }}
                    >
                      FREE
                    </span>
                    {!game.active && (
                      <span
                        className="ml-2 px-2 py-1 border"
                        style={{
                          borderColor: "#ff000040",
                          color: "#ff0000",
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "9px",
                        }}
                      >
                        OFFLINE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Discord CTA */}
        <div
          className="mt-16 p-8 border text-center"
          style={{ borderColor: "rgba(88,101,242,0.4)" }}
        >
          <h3
            className="mb-3"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "10px",
              color: "#5865f2",
              textShadow: "0 0 10px #5865f2",
            }}
          >
            ONLINE MULTIPLAYER
          </h3>
          <p
            className="mb-6"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              color: "#888",
            }}
          >
            Para jugar online con amigos, inicia sesión con Discord. Es gratis.
          </p>
          <a
            href="/api/auth/discord"
            className="inline-flex items-center gap-3 px-8 py-4 border-2 transition-all duration-100"
            style={{
              borderColor: "#5865f2",
              color: "#5865f2",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "9px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#5865f2";
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px #5865f240";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#5865f2";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <svg width="16" height="12" viewBox="0 0 71 55" fill="currentColor">
              <path d="M60.1 4.9A58.5 58.5 0 0 0 45.5.4a.22.22 0 0 0-.23.11 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0 37.3 37.3 0 0 0-1.83-3.7.23.23 0 0 0-.23-.1A58.3 58.3 0 0 0 10.5 4.9a.2.2 0 0 0-.1.08C1.58 18.2-.96 31.1.3 43.8a.24.24 0 0 0 .09.17A58.8 58.8 0 0 0 18.1 52.6a.23.23 0 0 0 .25-.08 42 42 0 0 0 3.6-5.9.22.22 0 0 0-.12-.32 38.8 38.8 0 0 1-5.54-2.64.23.23 0 0 1-.02-.38c.37-.28.74-.57 1.1-.86a.22.22 0 0 1 .23-.03c11.6 5.3 24.2 5.3 35.7 0a.22.22 0 0 1 .23.03l1.1.86a.23.23 0 0 1-.02.38 36.4 36.4 0 0 1-5.55 2.64.23.23 0 0 0-.11.32 47.2 47.2 0 0 0 3.59 5.9.22.22 0 0 0 .25.08 58.6 58.6 0 0 0 17.7-8.63.23.23 0 0 0 .09-.16c1.47-15.2-2.46-28-10.4-39.6a.18.18 0 0 0-.1-.09zM23.7 36c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.63 0 6.47 3.24 6.4 7.2 0 4-2.8 7.2-6.4 7.2zm23.7 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.63 0 6.47 3.24 6.4 7.2 0 4-2.77 7.2-6.4 7.2z" />
            </svg>
            LOGIN WITH DISCORD
          </a>
        </div>
      </div>
    </div>
  );
}
