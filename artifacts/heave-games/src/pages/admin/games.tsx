import React, { useState } from "react";
import {
  useListGames,
  useCreateGame,
  useUpdateGame,
  useDeleteGame,
  getListGamesQueryKey,
  type Game as ApiGame,
  type GameInputType,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Gamepad2, Plus, Pencil, Trash2, Activity, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Use the generated API type; add iconUrl fallback since it's optional in generated schema
type Game = ApiGame & { iconUrl: string | null };

const GAME_TYPES = ["turn_based", "card", "action", "puzzle", "online", "offline", "interaction"];

const TYPE_COLORS: Record<string, string> = {
  turn_based: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  card: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  action: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  puzzle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  online: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  offline: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  interaction: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

type GameFormData = {
  name: string;
  slug: string;
  type: string;
  description: string;
  active: boolean;
  iconUrl: string | null;
};

function GameFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  isSaving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Partial<ApiGame>;
  onSave: (data: GameFormData) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<GameFormData>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    type: initial?.type ?? "turn_based",
    description: initial?.description ?? "",
    active: initial?.active ?? true,
    iconUrl: initial?.iconUrl ?? null,
  });

  React.useEffect(() => {
    setForm({
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      type: initial?.type ?? "turn_based",
      description: initial?.description ?? "",
      active: initial?.active ?? true,
      iconUrl: initial?.iconUrl ?? null,
    });
  }, [open]);

  const isEdit = !!initial?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Game" : "New Game"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Tic Tac Toe"
                value={form.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                placeholder="tictactoe"
                value={form.slug ?? ""}
                disabled={isEdit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s/g, "-") }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={form.type ?? "turn_based"}
              onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GAME_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace("_", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Short description of the game..."
              value={form.description ?? ""}
              rows={3}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Icon URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input
              placeholder="https://..."
              value={form.iconUrl ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, iconUrl: e.target.value || null }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.active ?? true}
              onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))}
            />
            <Label>Active (visible to players)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(form)} disabled={isSaving || !form.name || !form.slug}>
            {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Game"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminGames() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: games, isLoading } = useListGames();
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const deleteGame = useDeleteGame();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ApiGame | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });

  const handleCreate = (data: GameFormData) => {
    createGame.mutate(
      {
        data: {
          name: data.name,
          slug: data.slug,
          type: data.type as GameInputType,
          description: data.description,
          active: data.active,
          iconUrl: data.iconUrl ?? null,
        },
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          invalidate();
          toast({ title: "Game Created", description: `"${data.name}" added successfully.` });
        },
        onError: () => toast({ title: "Error", description: "Failed to create game.", variant: "destructive" }),
      }
    );
  };

  const handleEdit = (data: GameFormData) => {
    if (!editTarget) return;
    updateGame.mutate(
      {
        id: editTarget.id,
        data: {
          name: data.name,
          description: data.description,
          active: data.active,
          iconUrl: data.iconUrl ?? null,
        },
      },
      {
        onSuccess: () => {
          setEditTarget(null);
          invalidate();
          toast({ title: "Game Updated", description: `"${data.name}" saved.` });
        },
        onError: () => toast({ title: "Error", description: "Failed to update game.", variant: "destructive" }),
      }
    );
  };

  const handleToggle = (game: ApiGame) => {
    updateGame.mutate(
      { id: game.id, data: { active: !game.active } },
      {
        onSuccess: () => {
          invalidate();
          toast({
            title: game.active ? "Game Disabled" : "Game Enabled",
            description: `"${game.name}" is now ${game.active ? "hidden from" : "visible to"} players.`,
          });
        },
        onError: () => toast({ title: "Error", description: "Failed to toggle game.", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (game: ApiGame) => {
    if (!confirm(`Delete "${game.name}"? This cannot be undone.`)) return;
    deleteGame.mutate(
      { id: game.id },
      {
        onSuccess: () => {
          invalidate();
          toast({ title: "Deleted", description: `"${game.name}" removed.` });
        },
        onError: () => toast({ title: "Error", description: "Failed to delete game.", variant: "destructive" }),
      }
    );
  };

  const totalPlays = games?.reduce((s, g) => s + g.playCount, 0) ?? 0;
  const activeCount = games?.filter((g) => g.active).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Games</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage game catalog, toggle visibility, and track play counts.
          </p>
        </div>
        <Button onClick={() => { setEditTarget(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Game
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Games", value: games?.length ?? 0, icon: <Gamepad2 className="w-4 h-4" /> },
          { label: "Active", value: activeCount, icon: <Activity className="w-4 h-4 text-emerald-500" /> },
          { label: "Total Plays", value: totalPlays.toLocaleString(), icon: <BarChart2 className="w-4 h-4 text-primary" /> },
        ].map(({ label, value, icon }) => (
          <Card key={label} className="border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                {icon}
              </div>
              <div>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Games grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading games...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games?.map((game) => (
            <Card
              key={game.id}
              className={`border-border transition-all ${
                game.active ? "hover:shadow-md" : "opacity-60"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {game.iconUrl ? (
                      <img src={game.iconUrl} alt={game.name} className="w-8 h-8 rounded" />
                    ) : (
                      <Gamepad2 className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={game.active}
                      onCheckedChange={() => handleToggle(game)}
                      disabled={updateGame.isPending}
                    />
                    <Badge variant={game.active ? "default" : "secondary"} className="text-[10px]">
                      {game.active ? "Active" : "Off"}
                    </Badge>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-1 truncate">{game.name}</h3>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-bold ${TYPE_COLORS[game.type] ?? ""}`}
                  >
                    {game.type.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                    /{game.slug}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                  {game.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center text-muted-foreground gap-1.5 text-sm">
                    <Activity className="w-4 h-4" />
                    <span>{game.playCount.toLocaleString()} plays</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Edit"
                      onClick={() => { setEditTarget(game); setDialogOpen(true); }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Delete"
                      onClick={() => handleDelete(game)}
                      disabled={deleteGame.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <GameFormDialog
        open={dialogOpen && !editTarget}
        onOpenChange={(v) => { if (!v) setDialogOpen(false); }}
        onSave={handleCreate}
        isSaving={createGame.isPending}
      />

      {/* Edit dialog */}
      <GameFormDialog
        open={!!editTarget}
        onOpenChange={(v) => { if (!v) setEditTarget(null); }}
        initial={editTarget ?? undefined}
        onSave={handleEdit}
        isSaving={updateGame.isPending}
      />
    </div>
  );
}
