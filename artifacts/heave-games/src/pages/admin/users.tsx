import React, { useState } from "react";
import { Link } from "wouter";
import { useListUsers, useDeleteUser, getListUsersQueryKey, useUpdateUserRole } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Search, ShieldAlert, Trash2, Edit } from "lucide-react";

export default function Users() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useListUsers();
  const deleteUser = useDeleteUser();
  const updateRole = useUpdateUserRole();
  const [search, setSearch] = useState("");

  const filteredUsers = users?.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() })
      });
    }
  };

  const handleRoleCycle = (id: number, currentRole: string) => {
    const roles: ("user" | "moderator" | "admin" | "owner")[] = ["user", "moderator", "admin", "owner"];
    const nextRole = roles[(roles.indexOf(currentRole as any) + 1) % roles.length];
    updateRole.mutate({ id, data: { role: nextRole } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() })
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage platform administrators and API users.</p>
        </div>
        <Button>Add User</Button>
      </div>

      <Card className="overflow-hidden border-border shadow-sm">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : filteredUsers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found.</TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.role === "owner" ? "default" : user.role === "admin" ? "secondary" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleRoleCycle(user.id, user.role)}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.active ? "bg-green-500" : "bg-muted-foreground"}`} />
                      <span className="text-sm">{user.active ? "Active" : "Inactive"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(user.id)}
                      disabled={deleteUser.isPending}
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
