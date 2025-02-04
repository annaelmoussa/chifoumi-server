import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateGameDialog } from "./CreateGameDialog";
import { GameTableRow } from "./GameTableRow";
import { useGameContext } from "@/contexts/GameContext";
import { useGameActions } from "@/hooks/useGameActions";
import { Game } from "@/types/game";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";


export function GameList() {
  const { games, loading, error, createGame, fetchGames } = useGameContext();
  const { handleJoinGame, error: actionError } = useGameActions();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchGames();
    }
  }, []);

  useEffect(() => {
    if (error || actionError) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error || actionError,
      });
    }
  }, [error, actionError]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const getStatusBadge = (game: Game) => {
    if (!game.user2) {
      return <Badge variant="secondary">En attente</Badge>;
    }
    if (game.winner) {
      return <Badge variant="default">Terminée</Badge>;
    }
    return <Badge variant="default">En cours</Badge>;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Mes Parties</h2>
        <CreateGameDialog onCreateGame={createGame} />
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Vue Table</TabsTrigger>
          <TabsTrigger value="cards">Vue Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Joueur 1</TableHead>
                  <TableHead>Joueur 2</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Aucune partie trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  games.map((game: Game) => (
                    <GameTableRow
                      key={game._id}
                      game={game}
                      onJoinGame={handleJoinGame}
                      statusBadge={getStatusBadge(game)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game: Game) => (
              <Card key={game._id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Partie #{game._id.slice(-4)}</span>
                    {getStatusBadge(game)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Joueur 1:</span>
                      <span>{game.user1.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Joueur 2:</span>
                      <span>{game.user2 ? game.user2.username : "En attente"}</span>
                    </div>
                    {!game.user2 && (
                      <Button
                        onClick={() => handleJoinGame(game._id)}
                        className="w-full mt-4"
                      >
                        Rejoindre
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
