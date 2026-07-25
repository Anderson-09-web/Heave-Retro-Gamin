import React from "react";
import { useGetDashboardStats, useGetRecentActivity, useGetTopEndpoints } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Database, Key, Users, ArrowUpRight, Clock, Cpu, Link as LinkIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();
  const { data: topEndpoints, isLoading: topEndpointsLoading } = useGetTopEndpoints();

  if (statsLoading || activityLoading || topEndpointsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Requests", value: stats?.totalRequests.toLocaleString() ?? "0", icon: Activity, desc: `${stats?.requestsToday.toLocaleString() ?? "0"} today` },
    { title: "Total Users", value: stats?.totalUsers.toLocaleString() ?? "0", icon: Users, desc: "Registered accounts" },
    { title: "Active API Keys", value: stats?.activeApiKeys.toLocaleString() ?? "0", icon: Key, desc: "Currently active" },
    { title: "Endpoints", value: stats?.totalEndpoints.toLocaleString() ?? "0", icon: Database, desc: "Available for use" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Metrics and recent activity for the Heave Games API.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-border bg-card/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground mt-1">{stat.desc}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Endpoints */}
        <Card className="lg:col-span-2 flex flex-col border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-primary" />
              Top Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {topEndpoints?.map((endpoint, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary font-mono text-xs font-bold">
                      {endpoint.method}
                    </div>
                    <div>
                      <p className="text-sm font-medium font-mono">{endpoint.path}</p>
                      <p className="text-xs text-muted-foreground">{endpoint.avgResponseMs}ms avg response</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{endpoint.requestCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">requests</p>
                  </div>
                </div>
              ))}
              {(!topEndpoints || topEndpoints.length === 0) && (
                <div className="text-center py-8 text-muted-foreground text-sm">No requests logged yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="flex flex-col border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="space-y-0">
              {activity?.map((item, i) => (
                <div key={item.id} className="flex items-start gap-4 p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      {item.userId && ` • User ID: ${item.userId}`}
                    </p>
                  </div>
                </div>
              ))}
              {(!activity || activity.length === 0) && (
                <div className="text-center py-8 text-muted-foreground text-sm">No recent activity.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
