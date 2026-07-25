import React, { useState } from "react";
import { 
  useListApiKeys, 
  useCreateApiKey, 
  useDeleteApiKey, 
  useRevokeApiKey, 
  getListApiKeysQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Key, Plus, Trash2, PowerOff, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApiKeys() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: apiKeys, isLoading } = useListApiKeys();
  const createApiKey = useCreateApiKey();
  const deleteApiKey = useDeleteApiKey();
  const revokeApiKey = useRevokeApiKey();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    
    createApiKey.mutate({ data: { name: newKeyName } }, {
      onSuccess: () => {
        setIsCreating(false);
        setNewKeyName("");
        queryClient.invalidateQueries({ queryKey: getListApiKeysQueryKey() });
        toast({
          title: "API Key Created",
          description: "New API key has been generated successfully.",
        });
      }
    });
  };

  const handleRevoke = (id: number) => {
    if (confirm("Are you sure you want to revoke this API key? It will immediately stop working.")) {
      revokeApiKey.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListApiKeysQueryKey() });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to permanently delete this API key?")) {
      deleteApiKey.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListApiKeysQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage authentication tokens for API access.</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      {isCreating && (
        <Card className="p-4 border-primary/20 bg-primary/5">
          <form onSubmit={handleCreate} className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Key Name</label>
              <Input 
                placeholder="e.g. Production Bot Key" 
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" disabled={createApiKey.isPending}>
              {createApiKey.isPending ? "Generating..." : "Generate"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key Preview</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requests</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading API keys...</TableCell>
              </TableRow>
            ) : apiKeys?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No API keys found.</TableCell>
              </TableRow>
            ) : (
              apiKeys?.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-mono text-sm bg-muted/50 px-2 py-1 rounded w-fit">
                      {apiKey.keyPreview}
                      <Button variant="ghost" size="icon" className="h-4 w-4 ml-2" title="Copy preview">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={apiKey.active ? "default" : "secondary"}>
                      {apiKey.active ? "Active" : "Revoked"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {apiKey.requestCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(apiKey.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    {apiKey.active && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Revoke Key"
                        onClick={() => handleRevoke(apiKey.id)}
                        disabled={revokeApiKey.isPending}
                        className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
                      >
                        <PowerOff className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Delete Key"
                      onClick={() => handleDelete(apiKey.id)}
                      disabled={deleteApiKey.isPending}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
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
