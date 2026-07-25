import * as React from "react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={UserLogin} />
      <Route path="/games" component={Games} />
      <Route path="/auth/discord/callback" component={DiscordCallback} />

      {/* Admin routes */}
      <Route path="/admin/login" component={Login} />
      <Route path="/admin/*">
        <AdminLayout>
          <Switch>
            <Route path="/admin" component={Dashboard} />
            <Route path="/admin/users" component={Users} />
            <Route path="/admin/api-keys" component={ApiKeys} />
            <Route path="/admin/endpoints" component={Endpoints} />
            <Route path="/admin/categories" component={Categories} />
            <Route path="/admin/images" component={Images} />
            <Route path="/admin/logs" component={Logs} />
            <Route path="/admin/logs/errors" component={ErrorLogs} />
            <Route path="/admin/services" component={Services} />
            <Route path="/admin/backups" component={Backups} />
            <Route path="/admin/config" component={Config} />
            <Route path="/admin/giveaways" component={Giveaways} />
            <Route path="/admin/games" component={AdminGames} />
            <Route path="/admin/docs" component={Docs} />
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
