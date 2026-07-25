import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function DiscordCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (!token || error) {
      setStatus("error");
      setTimeout(() => setLocation("/login?error=discord"), 2200);
      return;
    }

    localStorage.setItem("heave_token", token);

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(user => {
        if (user?.id) {
          const displayName = user.username?.startsWith("discord_")
            ? `Discord #${user.username.replace("discord_", "").slice(-4)}`
            : user.username;
          setUsername(displayName);
          setRole(user.role);
          setStatus("success");

          const isPrivileged = user.role === "owner" || user.role === "admin" || user.role === "moderator";
          // Redirect to /admin/dashboard (explicit sub-route, always resolves correctly)
          setTimeout(() => setLocation(isPrivileged ? "/admin/dashboard" : "/games"), 1800);
        } else {
          setStatus("success");
          setTimeout(() => setLocation("/games"), 1500);
        }
      })
      .catch(() => {
        setStatus("success");
        setTimeout(() => setLocation("/games"), 1500);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const roleColor = role === "owner" ? "#ff00ff" : role === "admin" ? "#ffff00" : "#00ffff";

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="text-center px-8">
        {status === "loading" && (
          <>
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-6" style={{ color: "#00ffff" }} />
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#00ffff", textShadow: "0 0 10px #00ffff" }}>
              CONECTANDO CON DISCORD...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto mb-5" style={{ color: "#00ff88" }} />
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "13px", color: "#00ff88", textShadow: "0 0 14px #00ff88", marginBottom: "18px" }}>
              ¡BIENVENIDO!
            </p>
            {username && (
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "14px", color: "#fff", marginBottom: "8px" }}>
                Sesión iniciada como <span style={{ color: "#00ffff" }}><strong>{username}</strong></span>
              </p>
            )}
            {role && (
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#555", marginBottom: "20px" }}>
                Rol: <span style={{ color: roleColor, fontWeight: "bold" }}>{role.toUpperCase()}</span>
              </p>
            )}
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#333" }}>
              {(role === "owner" || role === "admin") ? "→ Abriendo panel de administración..." : "→ Cargando juegos..."}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 mx-auto mb-5" style={{ color: "#ff0000" }} />
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#ff0000", marginBottom: "12px" }}>
              ERROR DE AUTENTICACIÓN
            </p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#555" }}>
              No se pudo conectar con Discord. Redirigiendo...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
