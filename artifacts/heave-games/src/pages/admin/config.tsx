import React, { useState } from "react";
import { useGetConfig, useUpsertConfig, useDeleteConfig, getGetConfigQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Settings, Plus, Trash2, Key, Eye, EyeOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Config() {
  const queryClient = useQueryClient();
  const { data: configs, isLoading } = useGetConfig();
  const deleteConfig = useDeleteConfig();
  const [showSecret, setShowSecret] = useState<Record<number, boolean>>({});

  const toggleSecret = (id: number) => {
    setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = (key: string) => {
    if(confirm(`Delete configuration key "${key}"?`)) {
      deleteConfig.mutate({ key }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetConfigQueryKey() })
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Global Configuration</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage environment variables and platform settings.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Variable
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Loading configuration...</TableCell>
              </TableRow>
            ) : configs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No configurations found.</TableCell>
              </TableRow>
            ) : (
              configs?.map((conf) => (
                <TableRow key={conf.id}>
                  <TableCell>
                    <div className="font-mono text-sm font-bold flex items-center gap-2">
                      <Key className="w-4 h-4 text-primary" />
                      {conf.key}
                    </div>
                    {conf.description && <div className="text-xs text-muted-foreground mt-1">{conf.description}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm bg-muted/50 px-2 py-1 rounded max-w-[400px] truncate overflow-hidden">
                        {conf.isSecret && !showSecret[conf.id] ? "••••••••••••••••" : conf.value}
                      </div>
                      {conf.isSecret && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100" onClick={() => toggleSecret(conf.id)}>
                          {showSecret[conf.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase text-[10px] tracking-wider">{conf.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(conf.key)}
                    >
                      <Trash2 className="h-4 w-4" />
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
