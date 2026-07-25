import React from "react";
import { useListGames } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Users, Activity } from "lucide-react";

export default function Games() {
  const { data: games, isLoading } = useListGames();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Available Games</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage game states and view statistics.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading games...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games?.map((game) => (
            <Card key={game.id} className="border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {game.iconUrl ? (
                      <img src={game.iconUrl} alt={game.name} className="w-8 h-8 rounded" />
                    ) : (
                      <Gamepad2 className="w-6 h-6" />
                    )}
                  </div>
                  <Badge variant={game.active ? "default" : "secondary"}>
                    {game.active ? "Active" : "Disabled"}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-xl mb-1">{game.name}</h3>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold">{game.type}</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {game.description}
                </p>

                <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
                  <div className="flex items-center text-muted-foreground gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>{game.playCount.toLocaleString()} plays</span>
                  </div>
                  <div className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {game.slug}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
