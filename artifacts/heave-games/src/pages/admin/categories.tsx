import React, { useState } from "react";
import { useListCategories, useDeleteCategory, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit, Search } from "lucide-react";

export default function Categories() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useListCategories();
  const deleteCategory = useDeleteCategory();
  const [search, setSearch] = useState("");

  const filtered = categories?.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() })
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage content groupings for endpoints and images.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <Card className="overflow-hidden border-border shadow-sm">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-9 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Icon</TableHead>
              <TableHead>Name / Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No categories found.</TableCell>
              </TableRow>
            ) : (
              filtered?.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <span className="text-2xl">{cat.icon}</span>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">{cat.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{cat.slug}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {cat.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{cat.itemCount}</Badge>
                  </TableCell>
                  <TableCell>
                    {cat.active ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                    ) : (
                      <Badge variant="outline">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 ml-1"
                      onClick={() => handleDelete(cat.id)}
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
