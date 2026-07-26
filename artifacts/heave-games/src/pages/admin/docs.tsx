import React, { useState } from "react";
import { useListApiEndpoints, useListCategories } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Copy, Terminal, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Docs() {
  const { data: endpoints, isLoading: endpointsLoading } = useListApiEndpoints();
  const { data: categories, isLoading: categoriesLoading } = useListCategories();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filteredEndpoints = endpoints?.filter((ep) => {
    if (activeCategory && ep.categoryId !== activeCategory) return false;
    if (search && !ep.path.toLowerCase().includes(search.toLowerCase()) && !ep.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "POST": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PUT": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "DELETE": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${title} Copied`, description: "Added to your clipboard." });
  };

  if (endpointsLoading || categoriesLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading documentation...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-6 sticky top-6">
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            API Reference
          </h2>
          <Input 
            placeholder="Search endpoints..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 bg-card"
          />
          <nav className="space-y-1">
            <button
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeCategory === null ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground'}`}
              onClick={() => setActiveCategory(null)}
            >
              All Endpoints
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${activeCategory === cat.id ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="truncate">{cat.name}</span>
                <span className="text-xs opacity-60 ml-2">{cat.itemCount}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8 min-w-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">REST API Endpoints</h1>
          <p className="text-muted-foreground">Base URL: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">{window.location.origin}</code></p>
        </div>

        {filteredEndpoints?.length === 0 ? (
          <div className="p-12 text-center border rounded-xl bg-card text-muted-foreground">
            No endpoints found matching your criteria.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEndpoints?.map((ep) => (
              <Card key={ep.id} id={`endpoint-${ep.id}`} className="overflow-hidden border-border bg-card/50">
                <div className="p-4 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 font-mono font-bold text-sm overflow-hidden">
                    <span className={`px-2 py-1 rounded border ${getMethodColor(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span className="truncate" title={ep.path}>{ep.path}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {ep.requiresAuth && (
                      <Badge variant="outline" className="border-orange-500/20 text-orange-500 bg-orange-500/10">Auth Required</Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(`${window.location.origin}${ep.path}`, "Path")}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Path
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{ep.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center justify-between">
                        Response Schema
                      </h3>
                      <div className="relative group">
                        <pre className="bg-zinc-950 p-4 rounded-xl overflow-x-auto text-xs font-mono text-zinc-300 border border-zinc-800">
                          <code>{ep.responseJson}</code>
                        </pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white"
                          onClick={() => copyToClipboard(ep.responseJson, "JSON")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Terminal className="w-4 h-4" /> Usage Example (discord.js)
                      </h3>
                      <div className="relative group h-[calc(100%-28px)]">
                        <pre className="bg-zinc-950 p-4 rounded-xl overflow-x-auto text-xs font-mono text-blue-300 border border-zinc-800 h-full">
                          <code>{`const fetch = require('node-fetch');

const response = await fetch('${window.location.origin}${ep.path}', {
  method: '${ep.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const data = await response.json();
console.log(data);`}</code>
                        </pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white"
                          onClick={() => copyToClipboard(`const fetch = require('node-fetch');\n\nconst response = await fetch('${window.location.origin}${ep.path}', {\n  method: '${ep.method}',\n  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }\n});\nconst data = await response.json();\nconsole.log(data);`, "Code")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
