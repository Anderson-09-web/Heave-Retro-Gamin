import React from "react";
import { useGetServicesStatus, useGetPerformanceMetrics } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Activity, Server, Database, HardDrive, Cpu, Zap, Clock, ZapOff } from "lucide-react";
import { format } from "date-fns";

export default function Services() {
  const { data: status, isLoading: statusLoading } = useGetServicesStatus();
  const { data: metrics, isLoading: metricsLoading } = useGetPerformanceMetrics();

  const getStatusColor = (state?: string) => {
    switch(state) {
      case 'online': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'degraded': return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case 'offline': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (state?: string) => {
    switch(state) {
      case 'online': return <Zap className="w-5 h-5 text-emerald-500" />;
      case 'degraded': return <Activity className="w-5 h-5 text-orange-500" />;
      case 'offline': return <ZapOff className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  if (statusLoading || metricsLoading) {
    return <div className="p-8 animate-pulse text-center">Loading systems data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Services</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time status and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "API Gateway", state: status?.api, icon: Server },
          { name: "Main Database", state: status?.database, icon: Database },
          { name: "Internal Cache", state: status?.cache, icon: HardDrive },
          { name: "Redis Cluster", state: status?.redis || 'offline', icon: Cpu },
        ].map((svc) => (
          <Card key={svc.name} className="border-border bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <svc.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                {getStatusIcon(svc.state)}
              </div>
              <h3 className="font-semibold">{svc.name}</h3>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getStatusColor(svc.state)}`}>
                  {svc.state || 'unknown'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col border-border shadow-sm">
          <CardHeader>
            <CardTitle>Requests per Minute</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            {metrics?.requestsHistory && metrics.requestsHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.requestsHistory}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={(val) => format(new Date(val), "HH:mm")} 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    labelFormatter={(val) => format(new Date(val), "MMM d, HH:mm")}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No historical data available.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Server Uptime</p>
              <p className="text-3xl font-bold mt-2">{status?.uptime ? `${status.uptime.toFixed(2)}%` : "N/A"}</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
              <p className="text-3xl font-bold mt-2 text-emerald-500">{metrics?.avgResponseMs ? `${metrics.avgResponseMs}ms` : "0ms"}</p>
              <p className="text-xs text-muted-foreground mt-1">p95: {metrics?.p95ResponseMs ?? 0}ms</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
              <p className="text-3xl font-bold mt-2">{metrics?.errorRate ? `${metrics.errorRate}%` : "0%"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
