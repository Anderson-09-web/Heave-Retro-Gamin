import React from "react";
import { useListLogs, getListLogsQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity, AlertTriangle, Info, Bug } from "lucide-react";

export default function Logs() {
  const { data: logs, isLoading } = useListLogs(undefined, { query: { queryKey: getListLogsQueryKey() } });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "warn": return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "debug": return <Bug className="w-4 h-4 text-purple-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error": return <Badge variant="destructive">Error</Badge>;
      case "warn": return <Badge className="bg-orange-500 hover:bg-orange-600">Warn</Badge>;
      case "debug": return <Badge className="bg-purple-500 hover:bg-purple-600">Debug</Badge>;
      default: return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time system activity and events.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm font-mono text-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-24">Level</TableHead>
              <TableHead className="w-[150px]">Source</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Fetching logs...</TableCell>
              </TableRow>
            ) : logs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No logs found.</TableCell>
              </TableRow>
            ) : (
              logs?.map((log) => (
                <TableRow key={log.id} className="group">
                  <TableCell className="text-muted-foreground">
                    {format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getLevelIcon(log.level)}
                      {getLevelBadge(log.level)}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{log.source || "system"}</TableCell>
                  <TableCell className="break-all">{log.message}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
