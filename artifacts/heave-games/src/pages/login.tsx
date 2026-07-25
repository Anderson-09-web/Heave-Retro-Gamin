import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthLogin } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

export default function UserLogin() {
  const [, setLocation] = useLocation();
  const login = useAuthLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("! ENTER USERNAME AND PASSWORD");
      return;
    }
    login.mutate(
      { data: { username, password } },
      {
        onSuccess: () => {
          // Store token and redirect to games
          const stored = localStorage.getItem("heave_token");
          if (!stored) {
            // token is stored by the api-client hook automatically
          }
          setLocation("/games");
        },
        onError: () => {
          setError("! INVALID CREDENTIALS");
        },
      }
    );
  };

  const handleDiscord = () => {
    window.location.href = "/api/auth/discord";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <img
              src="/heave-logo.jpg"
              alt="Heave Retro"
              className="w-16 h-16 object-contain mx-auto mb-4"
              style={{ imageRendering: "pixelated" }}
            />
          </Link>
          <h1
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "14px",
              color: "#00ffff",
              textShadow: "0 0 14px #00ffff",
              letterSpacing: "0.05em",
            }}
          >
            HEAVE RETRO
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              color: "#666",
            }}
          >
            PLAYER LOGIN
          </p>
        </div>

        {/* Discord login (primary) */}
        <button
          onClick={handleDiscord}
          className="w-full flex items-center justify-center gap-3 py-4 mb-6 border-2 transition-all duration-100"
          style={{
            borderColor: "#5865f2",
            color: "#5865f2",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "9px",
            background: "transparent",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#5865f2";
            (e.currentTarget as HTMLElement).style.color = "#fff";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px #5865f230";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#5865f2";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {/* Discord icon */}
          <svg width="18" height="14" viewBox="0 0 71 55" fill="currentColor">
            <path d="M60.1 4.9A58.5 58.5 0 0 0 45.5.4a.22.22 0 0 0-.23.11 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0 37.3 37.3 0 0 0-1.83-3.7.23.23 0 0 0-.23-.1A58.3 58.3 0 0 0 10.5 4.9a.2.2 0 0 0-.1.08C1.58 18.2-.96 31.1.3 43.8a.24.24 0 0 0 .09.17A58.8 58.8 0 0 0 18.1 52.6a.23.23 0 0 0 .25-.08 42 42 0 0 0 3.6-5.9.22.22 0 0 0-.12-.32 38.8 38.8 0 0 1-5.54-2.64.23.23 0 0 1-.02-.38c.37-.28.74-.57 1.1-.86a.22.22 0 0 1 .23-.03c11.6 5.3 24.2 5.3 35.7 0a.22.22 0 0 1 .23.03l1.1.86a.23.23 0 0 1-.02.38 36.4 36.4 0 0 1-5.55 2.64.23.23 0 0 0-.11.32 47.2 47.2 0 0 0 3.59 5.9.22.22 0 0 0 .25.08 58.6 58.6 0 0 0 17.7-8.63.23.23 0 0 0 .09-.16c1.47-15.2-2.46-28-10.4-39.6a.18.18 0 0 0-.1-.09zM23.7 36c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.63 0 6.47 3.24 6.4 7.2 0 4-2.8 7.2-6.4 7.2zm23.7 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.63 0 6.47 3.24 6.4 7.2 0 4-2.77 7.2-6.4 7.2z" />
          </svg>
          PLAY WITH DISCORD
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 border-t" style={{ borderColor: "rgba(0,255,255,0.2)" }} />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: "#444",
            }}
          >
            OR
          </span>
          <div className="flex-1 border-t" style={{ borderColor: "rgba(0,255,255,0.2)" }} />
        </div>

        {/* User/pass form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="py-2 px-3 border"
              style={{
                borderColor: "#ff0000",
                color: "#ff0000",
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                color: "#00ffff",
                marginBottom: "6px",
                letterSpacing: "0.05em",
              }}
            >
              USERNAME_
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-3 bg-black border focus:outline-none"
              style={{
                borderColor: "rgba(0,255,255,0.4)",
                color: "#fff",
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#00ffff";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 8px rgba(0,255,255,0.3)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,255,0.4)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
              placeholder="player_one"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                color: "#00ffff",
                marginBottom: "6px",
                letterSpacing: "0.05em",
              }}
            >
              PASSWORD_
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 bg-black border focus:outline-none"
              style={{
                borderColor: "rgba(0,255,255,0.4)",
                color: "#fff",
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#00ffff";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 8px rgba(0,255,255,0.3)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,255,0.4)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full py-4 border-2 transition-all duration-100 flex items-center justify-center gap-2"
            style={{
              borderColor: "#00ffff",
              color: "#00ffff",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "9px",
              background: "transparent",
              cursor: "pointer",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => {
              if (!login.isPending) {
                (e.currentTarget as HTMLElement).style.background = "#00ffff";
                (e.currentTarget as HTMLElement).style.color = "#000";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px #00ffff40";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#00ffff";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {login.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                LOADING...
              </>
            ) : (
              "▶ SIGN IN"
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center space-y-3">
          <Link
            href="/"
            style={{
              display: "block",
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: "#555",
              textDecoration: "none",
            }}
          >
            ← BACK TO HOME
          </Link>
          <Link
            href="/admin/login"
            style={{
              display: "block",
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: "#333",
            }}
          >
            Admin panel →
          </Link>
        </div>
      </div>
    </div>
  );
}
