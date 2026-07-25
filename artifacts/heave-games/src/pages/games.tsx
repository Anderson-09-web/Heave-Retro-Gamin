import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Gamepad2, Loader2, X, LogOut, ChevronRight } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type User = {
  id: number;
  username: string;
  role: string;
  avatarUrl?: string | null;
  email?: string;
};

// ── Fallback game list ────────────────────────────────────────────────────────

const DEMO_GAMES = [
  { id: 1, name: "TIC TAC TOE", slug: "tictactoe", type: "turn_based", description: "Clásico X vs O. Juega solo contra la CPU o con un amigo.", active: true, playCount: 1240 },
  { id: 2, name: "CONNECT 4", slug: "connect4", type: "turn_based", description: "Sé el primero en conectar 4 fichas en fila.", active: true, playCount: 890 },
  { id: 3, name: "UNO", slug: "uno", type: "card", description: "El juego de cartas más popular del mundo.", active: false, playCount: 2100 },
  { id: 4, name: "CHESS", slug: "chess", type: "turn_based", description: "Ajedrez clásico online.", active: false, playCount: 550 },
  { id: 5, name: "CHECKERS", slug: "checkers", type: "turn_based", description: "Damas. El juego de mesa clásico.", active: false, playCount: 320 },
];

const TYPE_COLORS: Record<string, string> = {
  turn_based: "#00ffff",
  card: "#ff00ff",
  action: "#ffff00",
  puzzle: "#00ff88",
};

// ── Tic Tac Toe ───────────────────────────────────────────────────────────────

type TTTBoard = (null | "X" | "O")[];

function checkTTTWinner(board: TTTBoard): "X" | "O" | "draw" | null {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a] as "X" | "O";
  }
  if (board.every(Boolean)) return "draw";
  return null;
}

function tttCpuMove(board: TTTBoard): number {
  // Try to win, then block, then center, then random
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const sym of ["O","X"] as const) {
    for (const [a,b,c] of lines) {
      const line = [board[a],board[b],board[c]];
      if (line.filter(x => x === sym).length === 2 && line.includes(null)) {
        const idx = [a,b,c][line.indexOf(null)];
        return idx;
      }
    }
  }
  if (!board[4]) return 4;
  const empty = board.map((v,i) => v === null ? i : -1).filter(i => i >= 0);
  return empty[Math.floor(Math.random() * empty.length)];
}

function TicTacToe({ onClose }: { onClose: () => void }) {
  const [board, setBoard] = useState<TTTBoard>(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [vsMode, setVsMode] = useState<"cpu" | "local" | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const winner = checkTTTWinner(board);
  const cpuThinking = vsMode === "cpu" && !isX && !winner;

  useEffect(() => {
    if (cpuThinking) {
      const t = setTimeout(() => {
        const idx = tttCpuMove(board);
        const next = [...board];
        next[idx] = "O";
        setBoard(next);
        const w = checkTTTWinner(next);
        if (w) setScores(s => ({ ...s, [w === "draw" ? "draw" : w]: s[w === "draw" ? "draw" : w] + 1 }));
        setIsX(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [cpuThinking, board]);

  const handleClick = (i: number) => {
    if (board[i] || winner || cpuThinking) return;
    const next = [...board];
    next[i] = isX ? "X" : "O";
    setBoard(next);
    const w = checkTTTWinner(next);
    if (w) setScores(s => ({ ...s, [w === "draw" ? "draw" : w]: s[w === "draw" ? "draw" : w] + 1 }));
    setIsX(x => !x);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setIsX(true); };

  const cellStyle = (val: null | "X" | "O"): React.CSSProperties => ({
    width: "80px", height: "80px",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid rgba(0,255,255,0.25)",
    cursor: board && !winner ? "pointer" : "default",
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "28px",
    color: val === "X" ? "#00ffff" : "#ff00ff",
    textShadow: val === "X" ? "0 0 10px #00ffff" : val === "O" ? "0 0 10px #ff00ff" : "none",
    background: "transparent",
    transition: "background 0.1s",
  });

  if (!vsMode) return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#888" }}>
        Elige modo de juego:
      </p>
      <button onClick={() => setVsMode("cpu")} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#00ffff", border: "2px solid #00ffff", padding: "12px 24px", background: "transparent", cursor: "pointer" }}>
        VS CPU
      </button>
      <button onClick={() => setVsMode("local")} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#ff00ff", border: "2px solid #ff00ff", padding: "12px 24px", background: "transparent", cursor: "pointer" }}>
        2 JUGADORES (LOCAL)
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Scores */}
      <div className="flex gap-8">
        {[["X","#00ffff"],["O","#ff00ff"],["draw","#666"]].map(([k,c]) => (
          <div key={k} className="text-center">
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "16px", color: c, textShadow: `0 0 8px ${c}` }}>
              {scores[k as keyof typeof scores]}
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#555" }}>
              {k === "draw" ? "DRAW" : `${k} ${k === "O" && vsMode === "cpu" ? "(CPU)" : ""}`}
            </div>
          </div>
        ))}
      </div>

      {/* Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 80px)", gap: "4px" }}>
        {board.map((val, i) => (
          <button key={i} style={cellStyle(val)} onClick={() => handleClick(i)}
            onMouseEnter={e => { if (!val && !winner) (e.currentTarget as HTMLElement).style.background = "rgba(0,255,255,0.05)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            {val}
          </button>
        ))}
      </div>

      {/* Status */}
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", minHeight: "20px" }}>
        {winner === "draw"
          ? <span style={{ color: "#888" }}>EMPATE!</span>
          : winner
          ? <span style={{ color: winner === "X" ? "#00ffff" : "#ff00ff", textShadow: `0 0 10px ${winner === "X" ? "#00ffff" : "#ff00ff"}` }}>
              {winner === "O" && vsMode === "cpu" ? "CPU WINS!" : `JUGADOR ${winner} GANA!`}
            </span>
          : cpuThinking
          ? <span style={{ color: "#555" }}>CPU PENSANDO...</span>
          : <span style={{ color: "#555" }}>
              TURNO: <span style={{ color: isX ? "#00ffff" : "#ff00ff" }}>{isX ? "X" : vsMode === "cpu" ? "CPU (O)" : "O"}</span>
            </span>
        }
      </div>

      <div className="flex gap-3">
        <button onClick={reset} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#00ffff", border: "1px solid #00ffff40", padding: "8px 16px", background: "transparent", cursor: "pointer" }}>
          NUEVA PARTIDA
        </button>
        <button onClick={() => { setVsMode(null); reset(); }} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#444", border: "1px solid #333", padding: "8px 16px", background: "transparent", cursor: "pointer" }}>
          CAMBIAR MODO
        </button>
      </div>
    </div>
  );
}

// ── Connect 4 ─────────────────────────────────────────────────────────────────

const ROWS = 6;
const COLS = 7;
type C4Cell = null | 1 | 2;
type C4Board = C4Cell[][];

function makeC4Board(): C4Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function dropC4(board: C4Board, col: number, player: 1 | 2): C4Board | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[r][col]) {
      const next = board.map(row => [...row]);
      next[r][col] = player;
      return next;
    }
  }
  return null;
}

function checkC4Winner(board: C4Board): 1 | 2 | "draw" | null {
  // Horizontal, vertical, diagonals
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = board[r][c];
      if (!v) continue;
      if (c + 3 < COLS && [1,2,3].every(d => board[r][c+d] === v)) return v;
      if (r + 3 < ROWS && [1,2,3].every(d => board[r+d][c] === v)) return v;
      if (r + 3 < ROWS && c + 3 < COLS && [1,2,3].every(d => board[r+d][c+d] === v)) return v;
      if (r + 3 < ROWS && c - 3 >= 0 && [1,2,3].every(d => board[r+d][c-d] === v)) return v;
    }
  }
  if (board[0].every(Boolean)) return "draw";
  return null;
}

function c4Score(board: C4Board, player: 1 | 2, col: number): number {
  // Prefer center columns
  return COLS / 2 - Math.abs(col - Math.floor(COLS / 2));
}

function c4CpuMove(board: C4Board): number {
  // Win immediately
  for (let c = 0; c < COLS; c++) {
    const next = dropC4(board, c, 2);
    if (next && checkC4Winner(next) === 2) return c;
  }
  // Block player win
  for (let c = 0; c < COLS; c++) {
    const next = dropC4(board, c, 1);
    if (next && checkC4Winner(next) === 1) return c;
  }
  // Prefer center
  const available = Array.from({ length: COLS }, (_, i) => i).filter(c => !board[0][c]);
  return available.sort((a, b) => c4Score(board, 2, b) - c4Score(board, 2, a))[0] ?? available[0];
}

function Connect4({ onClose }: { onClose: () => void }) {
  const [board, setBoard] = useState<C4Board>(makeC4Board());
  const [turn, setTurn] = useState<1 | 2>(1);
  const [vsMode, setVsMode] = useState<"cpu" | "local" | null>(null);
  const [scores, setScores] = useState({ p1: 0, p2: 0, draw: 0 });
  const [hover, setHover] = useState<number | null>(null);
  const winner = checkC4Winner(board);
  const cpuThinking = vsMode === "cpu" && turn === 2 && !winner;

  useEffect(() => {
    if (cpuThinking) {
      const t = setTimeout(() => {
        const col = c4CpuMove(board);
        const next = dropC4(board, col, 2);
        if (next) {
          setBoard(next);
          const w = checkC4Winner(next);
          if (w === 1) setScores(s => ({ ...s, p1: s.p1 + 1 }));
          else if (w === 2) setScores(s => ({ ...s, p2: s.p2 + 1 }));
          else if (w === "draw") setScores(s => ({ ...s, draw: s.draw + 1 }));
          setTurn(1);
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [cpuThinking, board]);

  const handleCol = (col: number) => {
    if (winner || cpuThinking) return;
    const next = dropC4(board, col, turn);
    if (!next) return;
    setBoard(next);
    const w = checkC4Winner(next);
    if (w === 1) setScores(s => ({ ...s, p1: s.p1 + 1 }));
    else if (w === 2) setScores(s => ({ ...s, p2: s.p2 + 1 }));
    else if (w === "draw") setScores(s => ({ ...s, draw: s.draw + 1 }));
    setTurn(t => t === 1 ? 2 : 1);
  };

  const reset = () => { setBoard(makeC4Board()); setTurn(1); };

  const cellColor = (v: C4Cell) => v === 1 ? "#ffff00" : v === 2 ? "#ff4444" : "transparent";

  if (!vsMode) return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#888" }}>Elige modo de juego:</p>
      <button onClick={() => setVsMode("cpu")} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#ffff00", border: "2px solid #ffff00", padding: "12px 24px", background: "transparent", cursor: "pointer" }}>VS CPU</button>
      <button onClick={() => setVsMode("local")} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#ff4444", border: "2px solid #ff4444", padding: "12px 24px", background: "transparent", cursor: "pointer" }}>2 JUGADORES (LOCAL)</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Scores */}
      <div className="flex gap-8">
        <div className="text-center">
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "16px", color: "#ffff00", textShadow: "0 0 8px #ffff00" }}>{scores.p1}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#555" }}>JUGADOR 1</div>
        </div>
        <div className="text-center">
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "16px", color: "#666" }}>{scores.draw}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#444" }}>DRAW</div>
        </div>
        <div className="text-center">
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "16px", color: "#ff4444", textShadow: "0 0 8px #ff4444" }}>{scores.p2}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#555" }}>{vsMode === "cpu" ? "CPU" : "JUGADOR 2"}</div>
        </div>
      </div>

      {/* Column buttons */}
      <div style={{ display: "flex", gap: "3px" }}>
        {Array.from({ length: COLS }, (_, c) => (
          <button key={c} onClick={() => handleCol(c)}
            onMouseEnter={() => setHover(c)} onMouseLeave={() => setHover(null)}
            style={{ width: "42px", height: "20px", background: hover === c && !winner ? "rgba(255,255,255,0.05)" : "transparent", border: "none", cursor: "pointer", color: turn === 1 ? "#ffff00" : "#ff4444", fontSize: "10px" }}>
            ▼
          </button>
        ))}
      </div>

      {/* Board */}
      <div style={{ background: "#0a0a1a", padding: "6px", border: "2px solid rgba(0,255,255,0.2)" }}>
        {board.map((row, r) => (
          <div key={r} style={{ display: "flex", gap: "3px", marginBottom: r < ROWS - 1 ? "3px" : 0 }}>
            {row.map((cell, c) => (
              <div key={c} style={{
                width: "42px", height: "42px", borderRadius: "50%",
                background: cellColor(cell),
                border: cell ? "none" : "1px solid rgba(0,255,255,0.1)",
                boxShadow: cell === 1 ? "0 0 8px #ffff0060" : cell === 2 ? "0 0 8px #ff444460" : "none",
                transition: "background 0.15s",
              }} />
            ))}
          </div>
        ))}
      </div>

      {/* Status */}
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", minHeight: "18px" }}>
        {winner === "draw"
          ? <span style={{ color: "#888" }}>EMPATE!</span>
          : winner
          ? <span style={{ color: winner === 1 ? "#ffff00" : "#ff4444", textShadow: `0 0 10px ${winner === 1 ? "#ffff00" : "#ff4444"}` }}>
              {winner === 2 && vsMode === "cpu" ? "CPU WINS!" : `JUGADOR ${winner} GANA!`}
            </span>
          : cpuThinking
          ? <span style={{ color: "#555" }}>CPU PENSANDO...</span>
          : <span style={{ color: "#555" }}>
              TURNO: <span style={{ color: turn === 1 ? "#ffff00" : "#ff4444" }}>
                {turn === 1 ? "JUGADOR 1" : vsMode === "cpu" ? "CPU" : "JUGADOR 2"}
              </span>
            </span>
        }
      </div>

      <div className="flex gap-3">
        <button onClick={reset} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#00ffff", border: "1px solid #00ffff40", padding: "8px 16px", background: "transparent", cursor: "pointer" }}>
          NUEVA PARTIDA
        </button>
        <button onClick={() => { setVsMode(null); reset(); }} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#444", border: "1px solid #333", padding: "8px 16px", background: "transparent", cursor: "pointer" }}>
          CAMBIAR MODO
        </button>
      </div>
    </div>
  );
}

// ── Game Modal ────────────────────────────────────────────────────────────────

function GameModal({ slug, name, onClose }: { slug: string; name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.92)" }} onClick={onClose}>
      <div
        className="relative max-h-[90vh] overflow-y-auto"
        style={{ background: "#000", border: "2px solid rgba(0,255,255,0.35)", boxShadow: "0 0 40px rgba(0,255,255,0.15)", padding: "24px", minWidth: "340px" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "12px", color: "#00ffff", textShadow: "0 0 10px #00ffff" }}>
            {name}
          </h2>
          <button onClick={onClose} style={{ color: "#555", background: "transparent", border: "none", cursor: "pointer" }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {slug === "tictactoe" && <TicTacToe onClose={onClose} />}
        {slug === "connect4" && <Connect4 onClose={onClose} />}
      </div>
    </div>
  );
}

// ── Main Games Page ───────────────────────────────────────────────────────────

export default function Games() {
  const [, setLocation] = useLocation();
  const [games, setGames] = useState<typeof DEMO_GAMES>(DEMO_GAMES);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeGame, setActiveGame] = useState<{ slug: string; name: string } | null>(null);

  // Fetch games from API
  useEffect(() => {
    const token = localStorage.getItem("heave_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    fetch("/api/games", { headers })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setGames(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("heave_token");
    if (!token) return;
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.id) setUser(data); })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem("heave_token");
    if (token) {
      fetch("/api/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
    localStorage.removeItem("heave_token");
    setUser(null);
  };

  const handlePlay = (slug: string, name: string, active: boolean) => {
    if (!active) return;
    if (slug === "tictactoe" || slug === "connect4") {
      setActiveGame({ slug, name });
      return;
    }
    // Other games: redirect to Discord login if not signed in
    if (!user) {
      window.location.href = "/api/auth/discord";
    } else {
      // Coming soon for other games
    }
  };

  const discordName = user?.username?.startsWith("discord_")
    ? `Discord #${user.username.replace("discord_", "").slice(-4)}`
    : user?.username;

  return (
    <div className="min-h-screen bg-black text-white" style={{
      backgroundImage: "linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
    }}>
      {/* Modal */}
      {activeGame && <GameModal slug={activeGame.slug} name={activeGame.name} onClose={() => setActiveGame(null)} />}

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: "rgba(0,255,255,0.25)" }}>
        <Link href="/">
          <div className="flex items-center gap-3">
            <img src="/heave-logo.jpg" alt="Heave Retro" className="w-8 h-8 object-contain" style={{ imageRendering: "pixelated" }} />
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#00ffff", textShadow: "0 0 8px #00ffff" }}>
              HEAVE RETRO
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Avatar + username */}
              <div className="flex items-center gap-2">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-7 h-7 rounded-full" style={{ border: "1px solid rgba(0,255,255,0.4)" }} />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#5865f2", fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#fff" }}>
                    {(discordName ?? "U")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#00ffff" }}>
                    {discordName}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#555" }}>
                    {user.role.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Admin panel link for privileged roles */}
              {(user.role === "owner" || user.role === "admin" || user.role === "moderator") && (
                <Link href="/admin" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#ff00ff", border: "1px solid #ff00ff40", padding: "6px 10px", textDecoration: "none" }}>
                  ADMIN
                </Link>
              )}

              {/* Logout */}
              <button onClick={handleLogout} title="Cerrar sesión" style={{ color: "#444", background: "transparent", border: "1px solid #333", padding: "6px 8px", cursor: "pointer" }}>
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <a href="/api/auth/discord"
              className="flex items-center gap-2 border px-4 py-2 transition-all duration-100"
              style={{ borderColor: "#5865f2", color: "#5865f2", fontFamily: "'Press Start 2P', monospace", fontSize: "8px", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#5865f2"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#5865f2"; }}>
              <svg width="14" height="11" viewBox="0 0 71 55" fill="currentColor">
                <path d="M60.1 4.9A58.5 58.5 0 0 0 45.5.4a.22.22 0 0 0-.23.11 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0 37.3 37.3 0 0 0-1.83-3.7.23.23 0 0 0-.23-.1A58.3 58.3 0 0 0 10.5 4.9a.2.2 0 0 0-.1.08C1.58 18.2-.96 31.1.3 43.8a.24.24 0 0 0 .09.17A58.8 58.8 0 0 0 18.1 52.6a.23.23 0 0 0 .25-.08 42 42 0 0 0 3.6-5.9.22.22 0 0 0-.12-.32 38.8 38.8 0 0 1-5.54-2.64.23.23 0 0 1-.02-.38c.37-.28.74-.57 1.1-.86a.22.22 0 0 1 .23-.03c11.6 5.3 24.2 5.3 35.7 0a.22.22 0 0 1 .23.03l1.1.86a.23.23 0 0 1-.02.38 36.4 36.4 0 0 1-5.55 2.64.23.23 0 0 0-.11.32 47.2 47.2 0 0 0 3.59 5.9.22.22 0 0 0 .25.08 58.6 58.6 0 0 0 17.7-8.63.23.23 0 0 0 .09-.16c1.47-15.2-2.46-28-10.4-39.6a.18.18 0 0 0-.1-.09zM23.7 36c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.63 0 6.47 3.24 6.4 7.2 0 4-2.8 7.2-6.4 7.2zm23.7 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.63 0 6.47 3.24 6.4 7.2 0 4-2.77 7.2-6.4 7.2z"/>
              </svg>
              SIGN IN
            </a>
          )}
        </div>
      </div>

      {/* Welcome banner when logged in */}
      {user && (
        <div style={{ background: "rgba(0,255,255,0.04)", borderBottom: "1px solid rgba(0,255,255,0.15)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#00ffff" }}>
            ✓ Sesión iniciada como <strong>{discordName}</strong> · Rol: <strong>{user.role}</strong>
          </span>
          {(user.role === "owner" || user.role === "admin") && (
            <Link href="/admin" style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#ff00ff", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Ir al panel admin <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      {/* Hero */}
      <div className="py-12 px-6 text-center">
        <h1 className="mb-4" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(1rem, 4vw, 2rem)", color: "#00ffff", textShadow: "0 0 20px #00ffff" }}>
          FREE GAMES
        </h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#888" }}>
          {user
            ? `Bienvenido, ${discordName}! Elige un juego y a jugar.`
            : <>Todos los juegos son gratuitos. <span style={{ color: "#5865f2" }}>Inicia sesión con Discord</span> para multijugador online.</>
          }
        </p>
      </div>

      {/* Games grid */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#00ffff" }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const color = TYPE_COLORS[game.type] ?? "#00ffff";
              const playable = game.slug === "tictactoe" || game.slug === "connect4";
              const isActive = game.active || playable;

              return (
                <div
                  key={game.id}
                  className="p-6 border bg-black/60 flex flex-col gap-4 transition-all duration-100"
                  style={{ borderColor: `${color}30`, opacity: isActive ? 1 : 0.5 }}
                  onMouseEnter={e => { if (isActive) { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}25`; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <div className="w-12 h-12 flex items-center justify-center border" style={{ borderColor: `${color}50`, color }}>
                    <Gamepad2 className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-2" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color, letterSpacing: "0.05em" }}>
                      {game.name}
                    </h3>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#777", lineHeight: "1.6" }}>
                      {game.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#444" }}>
                      {game.playCount.toLocaleString()} plays
                    </span>
                    <button
                      onClick={() => handlePlay(game.slug, game.name, isActive)}
                      disabled={!isActive}
                      className="px-4 py-2 border transition-all duration-100"
                      style={{ borderColor: isActive ? color : "#333", color: isActive ? color : "#333", fontFamily: "'Press Start 2P', monospace", fontSize: "7px", background: "transparent", cursor: isActive ? "pointer" : "not-allowed" }}
                      onMouseEnter={e => { if (isActive) { (e.currentTarget as HTMLElement).style.background = color; (e.currentTarget as HTMLElement).style.color = "#000"; } }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = isActive ? color : "#333"; }}
                    >
                      {isActive ? "▶ PLAY" : "SOON"}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 border" style={{ borderColor: `${color}40`, color: `${color}90`, fontFamily: "'Space Mono', monospace", fontSize: "9px" }}>
                      FREE
                    </span>
                    {playable && (
                      <span className="px-2 py-1 border" style={{ borderColor: "#00ff8840", color: "#00ff88", fontFamily: "'Space Mono', monospace", fontSize: "9px" }}>
                        DISPONIBLE
                      </span>
                    )}
                    {!isActive && (
                      <span className="px-2 py-1 border" style={{ borderColor: "#ff000040", color: "#ff0000", fontFamily: "'Space Mono', monospace", fontSize: "9px" }}>
                        PRÓXIMAMENTE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Discord CTA — only when not logged in */}
        {!user && (
          <div className="mt-16 p-8 border text-center" style={{ borderColor: "rgba(88,101,242,0.4)" }}>
            <h3 className="mb-3" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#5865f2", textShadow: "0 0 10px #5865f2" }}>
              ONLINE MULTIPLAYER
            </h3>
            <p className="mb-6" style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#888" }}>
              Para jugar online con amigos, inicia sesión con Discord. Es gratis.
            </p>
            <a href="/api/auth/discord"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 transition-all duration-100"
              style={{ borderColor: "#5865f2", color: "#5865f2", fontFamily: "'Press Start 2P', monospace", fontSize: "9px", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#5865f2"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px #5865f240"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#5865f2"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              <svg width="16" height="12" viewBox="0 0 71 55" fill="currentColor">
                <path d="M60.1 4.9A58.5 58.5 0 0 0 45.5.4a.22.22 0 0 0-.23.11 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0 37.3 37.3 0 0 0-1.83-3.7.23.23 0 0 0-.23-.1A58.3 58.3 0 0 0 10.5 4.9a.2.2 0 0 0-.1.08C1.58 18.2-.96 31.1.3 43.8a.24.24 0 0 0 .09.17A58.8 58.8 0 0 0 18.1 52.6a.23.23 0 0 0 .25-.08 42 42 0 0 0 3.6-5.9.22.22 0 0 0-.12-.32 38.8 38.8 0 0 1-5.54-2.64.23.23 0 0 1-.02-.38c.37-.28.74-.57 1.1-.86a.22.22 0 0 1 .23-.03c11.6 5.3 24.2 5.3 35.7 0a.22.22 0 0 1 .23.03l1.1.86a.23.23 0 0 1-.02.38 36.4 36.4 0 0 1-5.55 2.64.23.23 0 0 0-.11.32 47.2 47.2 0 0 0 3.59 5.9.22.22 0 0 0 .25.08 58.6 58.6 0 0 0 17.7-8.63.23.23 0 0 0 .09-.16c1.47-15.2-2.46-28-10.4-39.6a.18.18 0 0 0-.1-.09zM23.7 36c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.63 0 6.47 3.24 6.4 7.2 0 4-2.8 7.2-6.4 7.2zm23.7 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.63 0 6.47 3.24 6.4 7.2 0 4-2.77 7.2-6.4 7.2z" />
              </svg>
              LOGIN WITH DISCORD
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
