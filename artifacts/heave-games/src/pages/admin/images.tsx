import React, { useState } from "react";
import { useListImages, useDeleteImage, getListImagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, Search, ImageIcon, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Images() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: images, isLoading } = useListImages();
  const deleteImage = useDeleteImage();
  const [search, setSearch] = useState("");

  const filtered = images?.filter(i => 
    i.tags?.toLowerCase().includes(search.toLowerCase()) || 
    i.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if(confirm("Delete this image?")) {
      deleteImage.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListImagesQueryKey() })
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL Copied", description: "Image URL copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Image & GIF Gallery</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage static assets and reaction GIFs.</p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" /> Upload Asset
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tags..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading gallery...</div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No images found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered?.map((img) => (
            <Card key={img.id} className="overflow-hidden group border-border">
              <div className="relative aspect-square bg-muted">
                <img 
                  src={img.url} 
                  alt={img.tags || "image"} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" onClick={() => copyUrl(img.url)} title="Copy URL">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(img.id)} title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-[10px] shadow-sm uppercase font-bold tracking-wider">
                    {img.type}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-mono text-muted-foreground truncate" title={img.tags}>
                  {img.tags || "No tags"}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">Requests: {img.requestCount || 0}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
