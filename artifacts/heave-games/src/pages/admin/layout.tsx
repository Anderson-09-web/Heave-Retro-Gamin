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
import { Button } from "@/components/ui/button";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Documentation", href: "/admin/docs", icon: BookOpen },
    ],
  },
  {
    title: "Management",
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
    title: "System",
    items: [
      { name: "Services", href: "/admin/services", icon: Server },
      { name: "Logs", href: "/admin/logs", icon: Activity },
      { name: "Errors", href: "/admin/logs/errors", icon: AlertTriangle },
      { name: "Backups", href: "/admin/backups", icon: Archive },
      { name: "Configuration", href: "/admin/config", icon: Settings },
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse space-y-4 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm font-medium">Loading session...</p>
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
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/20">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r bg-sidebar flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2 text-sidebar-primary font-bold text-lg tracking-tight">
            <Gamepad2 className="w-6 h-6" />
            <span>Heave Games</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-6 px-3">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <h4 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {group.title}
                </h4>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
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

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-bold text-sm">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.username}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate capitalize">{user.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center px-6 border-b bg-card md:hidden">
          <div className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
            <Gamepad2 className="w-6 h-6" />
            <span>Heave Games API</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
