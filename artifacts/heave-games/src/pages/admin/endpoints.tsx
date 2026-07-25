import React, { useState } from "react";
import { 
  useListApiEndpoints, 
  useToggleApiEndpoint, 
  useDeleteApiEndpoint,
  getListApiEndpointsQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Settings2, Trash2, Edit } from "lucide-react";

export default function Endpoints() {
  const queryClient = useQueryClient();
  const { data: endpoints, isLoading } = useListApiEndpoints();
  const toggleEndpoint = useToggleApiEndpoint();
  const deleteEndpoint = useDeleteApiEndpoint();
  const [search, setSearch] = useState("");

  const filteredEndpoints = endpoints?.filter(
    (e) =>
      e.path.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
  );

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "POST": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PUT": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "PATCH": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "DELETE": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleToggle = (id: number) => {
    toggleEndpoint.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListApiEndpointsQueryKey() })
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this endpoint?")) {
      deleteEndpoint.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListApiEndpointsQueryKey() })
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Endpoints</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure and monitor API routes.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Endpoint
        </Button>
      </div>

      <Card className="overflow-hidden border-border shadow-sm">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search endpoints..."
              className="pl-9 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Method</TableHead>
              <TableHead>Path</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>Auth</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Loading endpoints...</TableCell>
              </TableRow>
            ) : filteredEndpoints?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No endpoints found.</TableCell>
              </TableRow>
            ) : (
              filteredEndpoints?.map((endpoint) => (
                <TableRow key={endpoint.id}>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold tracking-wider font-mono border ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium">
                    {endpoint.path}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {endpoint.description}
                  </TableCell>
                  <TableCell>
                    {endpoint.requiresAuth ? (
                      <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">Auth Req</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">Public</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <button 
                      onClick={() => handleToggle(endpoint.id)}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        endpoint.active 
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" 
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${endpoint.active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                      {endpoint.active ? "Active" : "Disabled"}
                    </button>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    {endpoint.requestCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Settings2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 ml-1"
                      onClick={() => handleDelete(endpoint.id)}
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
