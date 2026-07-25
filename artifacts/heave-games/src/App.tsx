import * as React from "react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

import Landing from './pages/landing';
import UserLogin from './pages/login';
import Games from './pages/games';
import DiscordCallback from './pages/discord-callback';
import AdminLayout from './pages/admin/layout';
import Login from './pages/admin/login';
import Dashboard from './pages/admin/dashboard';
import Users from './pages/admin/users';
import ApiKeys from './pages/admin/api-keys';
import Endpoints from './pages/admin/endpoints';
import Categories from './pages/admin/categories';
import Images from './pages/admin/images';
import Logs from './pages/admin/logs';
import ErrorLogs from './pages/admin/logs-errors';
import Services from './pages/admin/services';
import Backups from './pages/admin/backups';
import Config from './pages/admin/config';
import Giveaways from './pages/admin/giveaways';
import AdminGames from './pages/admin/games';
import Docs from './pages/admin/docs';

// ── Error Boundary ─────────────────────────────────────────────────────────

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", background: "#000", display: "flex",
          alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px"
        }}>
          <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "12px", color: "#ff0000" }}>
            ERROR
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#555", maxWidth: "400px", textAlign: "center" }}>
            {this.state.error?.message ?? "Algo salió mal."}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/"; }}
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#00ffff", border: "1px solid #00ffff", padding: "10px 20px", background: "transparent", cursor: "pointer" }}
          >
            VOLVER AL INICIO
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── QueryClient ─────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,               // don't retry — fail fast so the UI responds immediately
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

// ── Router ──────────────────────────────────────────────────────────────────

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={UserLogin} />
      <Route path="/games" component={Games} />
      <Route path="/auth/discord/callback" component={DiscordCallback} />

      {/* Admin standalone login */}
      <Route path="/admin/login" component={Login} />

      {/* Admin panel — `nest` makes /admin the base so sub-routes are relative.
          This correctly matches /admin AND /admin/users AND /admin/anything. */}
      <Route path="/admin" nest>
        <AdminLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/users" component={Users} />
            <Route path="/api-keys" component={ApiKeys} />
            <Route path="/endpoints" component={Endpoints} />
            <Route path="/categories" component={Categories} />
            <Route path="/images" component={Images} />
            <Route path="/logs" component={Logs} />
            <Route path="/logs/errors" component={ErrorLogs} />
            <Route path="/services" component={Services} />
            <Route path="/backups" component={Backups} />
            <Route path="/config" component={Config} />
            <Route path="/giveaways" component={Giveaways} />
            <Route path="/games" component={AdminGames} />
            <Route path="/docs" component={Docs} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
