import React from "react";
import { useListGiveaways } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Gift, Users, Trophy } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function Giveaways() {
  const { data: giveaways, isLoading } = useListGiveaways();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Giveaways</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage Discord giveaways and winners.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Giveaway
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title & Prize</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Ends/Ended</TableHead>
              <TableHead>Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading giveaways...</TableCell>
              </TableRow>
            ) : giveaways?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No giveaways found.</TableCell>
              </TableRow>
            ) : (
              giveaways?.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>
                    <div className="font-bold">{g.title}</div>
                    <div className="text-sm text-primary font-medium flex items-center mt-1">
                      <Gift className="w-3 h-3 mr-1" />
                      {g.prize}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={g.status === 'active' ? 'default' : g.status === 'ended' ? 'secondary' : 'destructive'}>
                      {g.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm font-medium">
                      <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                      {g.participantCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {g.status === 'active' 
                      ? formatDistanceToNow(new Date(g.endsAt), { addSuffix: true })
                      : format(new Date(g.endsAt), "MMM d, yyyy HH:mm")
                    }
                  </TableCell>
                  <TableCell>
                    {g.winnerName ? (
                      <div className="flex items-center text-sm font-medium text-emerald-500">
                        <Trophy className="w-4 h-4 mr-1.5" />
                        {g.winnerName}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Pending</span>
                    )}
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
