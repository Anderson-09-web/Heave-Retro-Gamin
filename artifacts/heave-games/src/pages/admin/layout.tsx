import React from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useAuthLogout } from "@workspace/api-client-react";
import { getGetMeQueryKey } from "@workspace/api-client-react";
import {
  LayoutDashboard,
  Users,
  Key,
  Database,
  Image as ImageIcon,
  Activity,
  AlertTriangle,
  Server,
  Archive,
  Settings,
  Gift,
  Gamepad2,
  BookOpen,
  LogOut,
  FolderTree,
} from "lucide-react";

const NAV_GROUPS = [
  {
    title: "OVERVIEW",
    color: "#00ffff",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Docs", href: "/admin/docs", icon: BookOpen },
    ],
  },
  {
    title: "MANAGEMENT",
    color: "#ff00ff",
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "API Keys", href: "/admin/api-keys", icon: Key },
      { name: "Endpoints", href: "/admin/endpoints", icon: Database },
      { name: "Categories", href: "/admin/categories", icon: FolderTree },
      { name: "Images & GIFs", href: "/admin/images", icon: ImageIcon },
      { name: "Giveaways", href: "/admin/giveaways", icon: Gift },
      { name: "Games", href: "/admin/games", icon: Gamepad2 },
    ],
  },
  {
    title: "SYSTEM",
    color: "#ffff00",
    items: [
      { name: "Services", href: "/admin/services", icon: Server },
      { name: "Logs", href: "/admin/logs", icon: Activity },
      { name: "Errors", href: "/admin/logs/errors", icon: AlertTriangle },
      { name: "Backups", href: "/admin/backups", icon: Archive },
      { name: "Config", href: "/admin/config", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, isError } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });
  const logout = useAuthLogout();

  React.useEffect(() => {
    if (!isLoading && (isError || !user)) {
      setLocation("/admin/login");
    }
  }, [user, isLoading, isError, setLocation]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-black"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="text-center space-y-4">
          <div
            className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: "#00ffff", borderTopColor: "transparent" }}
          />
          <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#00ffff" }}>
            LOADING<span className="blink">_</span>
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setLocation("/admin/login");
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 border-r flex flex-col hidden md:flex"
        style={{
          borderColor: "rgba(0,255,255,0.2)",
          background: "#020202",
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center px-5 border-b"
          style={{ borderColor: "rgba(0,255,255,0.2)" }}
        >
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/heave-logo.jpg"
              alt="Heave Retro"
              className="w-8 h-8 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "8px",
                  color: "#00ffff",
                  textShadow: "0 0 6px #00ffff",
                  lineHeight: "1.4",
                }}
              >
                HEAVE
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "8px",
                  color: "#ff00ff",
                  textShadow: "0 0 6px #ff00ff",
                  lineHeight: "1.4",
                }}
              >
                RETRO
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-5 px-3">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <h4
                  className="px-3 mb-2"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "7px",
                    color: group.color,
                    textShadow: `0 0 6px ${group.color}`,
                    letterSpacing: "0.08em",
                  }}
                >
                  {group.title}
                </h4>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 transition-all duration-100"
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "10px",
                            color: isActive ? group.color : "#666",
                            background: isActive ? `${group.color}15` : "transparent",
                            borderLeft: isActive ? `2px solid ${group.color}` : "2px solid transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.color = group.color;
                              (e.currentTarget as HTMLElement).style.background = `${group.color}08`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.color = "#666";
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }
                          }}
                        >
                          <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* User footer */}
        <div
          className="p-3 border-t"
          style={{ borderColor: "rgba(0,255,255,0.15)" }}
        >
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div
              className="w-7 h-7 flex items-center justify-center border text-xs font-bold flex-shrink-0"
              style={{
                borderColor: "#00ffff",
                color: "#00ffff",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "9px",
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#ccc" }}
              >
                {user.username}
              </p>
              <p
                className="truncate"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#444", textTransform: "uppercase" }}
              >
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={logout.isPending}
            className="w-full flex items-center gap-2 px-2 py-2 transition-all duration-100"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: "#555",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#ff0000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#555";
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header
          className="h-14 flex items-center px-6 border-b md:hidden"
          style={{ borderColor: "rgba(0,255,255,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <img src="/heave-logo.jpg" alt="" className="w-6 h-6 object-contain" />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "9px",
                color: "#00ffff",
              }}
            >
              HEAVE RETRO
            </span>
          </div>
        </header>

        <div
          className="flex-1 overflow-y-auto p-6 md:p-8"
          style={{
            backgroundImage: "linear-gradient(rgba(0,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
