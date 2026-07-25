import React from "react";
import { useListBackups, useCreateBackup, useRestoreBackup, getListBackupsQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Archive, Plus, RotateCcw, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

export default function Backups() {
  const queryClient = useQueryClient();
  const { data: backups, isLoading } = useListBackups();
  const createBackup = useCreateBackup();
  const restoreBackup = useRestoreBackup();

  const handleCreate = () => {
    createBackup.mutate(undefined, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBackupsQueryKey() })
    });
  };

  const handleRestore = (id: number) => {
    if(confirm("DANGER: Restoring a backup will overwrite the current database state. Proceed?")) {
      restoreBackup.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBackupsQueryKey() })
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Database Backups</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage database snapshots and restore points.</p>
        </div>
        <Button onClick={handleCreate} disabled={createBackup.isPending}>
          <Plus className="w-4 h-4 mr-2" />
          {createBackup.isPending ? "Creating..." : "Create Backup"}
        </Button>
      </div>

      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3 text-sm text-orange-600">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Warning: Restoration overrides current state</p>
          <p className="opacity-90">Restoring a backup will immediately revert all users, keys, and configurations to the exact state at the time of the snapshot. All changes since that point will be permanently lost.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Snapshot ID</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Restored</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading backups...</TableCell>
              </TableRow>
            ) : backups?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No backups found.</TableCell>
              </TableRow>
            ) : (
              backups?.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Archive className="w-4 h-4 text-muted-foreground" />
                      {backup.name}
                    </div>
                  </TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>
                    <Badge variant={
                      backup.status === 'completed' ? 'default' : 
                      backup.status === 'failed' ? 'destructive' : 'secondary'
                    }>
                      {backup.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(backup.createdAt), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {backup.restoredAt ? format(new Date(backup.restoredAt), "MMM d, yyyy HH:mm") : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={backup.status !== 'completed' || restoreBackup.isPending}
                      onClick={() => handleRestore(backup.id)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
