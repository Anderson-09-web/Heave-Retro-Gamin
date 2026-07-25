import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, CheckCircle } from "lucide-react";

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
      setTimeout(() => setLocation("/login?error=discord"), 2000);
      return;
    }

    // Save token
    localStorage.setItem("heave_token", token);

    // Fetch user info to show welcome message + handle role-based redirect
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

          // Redirect based on role
          const isAdmin = user.role === "owner" || user.role === "admin" || user.role === "moderator";
          setTimeout(() => setLocation(isAdmin ? "/admin" : "/games"), 1800);
        } else {
          setStatus("success");
          setTimeout(() => setLocation("/games"), 1500);
        }
      })
      .catch(() => {
        setStatus("success");
        setTimeout(() => setLocation("/games"), 1500);
      });
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{
      backgroundImage: "linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
    }}>
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
            <CheckCircle className="w-12 h-12 mx-auto mb-6" style={{ color: "#00ff88" }} />
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "12px", color: "#00ff88", textShadow: "0 0 12px #00ff88", marginBottom: "16px" }}>
              ¡SESIÓN INICIADA!
            </p>
            {username && (
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", color: "#00ffff", marginBottom: "8px" }}>
                Bienvenido, <strong>{username}</strong>
              </p>
            )}
            {role && (
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#555" }}>
                Rol: <span style={{ color: role === "owner" ? "#ff00ff" : role === "admin" ? "#ffff00" : "#00ffff" }}>
                  {role.toUpperCase()}
                </span>
              </p>
            )}
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#444", marginTop: "20px" }}>
              {(role === "owner" || role === "admin") ? "Redirigiendo al panel admin..." : "Redirigiendo a los juegos..."}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#ff0000", marginBottom: "12px" }}>
              ERROR DE AUTENTICACIÓN
            </p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#555" }}>
              Redirigiendo al login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
