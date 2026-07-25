import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function DiscordCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // The backend handles the OAuth exchange and redirects here with ?token=...
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      localStorage.setItem("heave_token", token);
      setLocation("/games");
    } else if (error) {
      console.error("Discord OAuth error:", error);
      setLocation("/login?error=discord");
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2
          className="w-10 h-10 animate-spin mx-auto mb-6"
          style={{ color: "#00ffff" }}
        />
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "10px",
            color: "#00ffff",
            textShadow: "0 0 10px #00ffff",
          }}
        >
          CONNECTING...
        </p>
      </div>
    </div>
  );
}
