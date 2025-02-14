import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGameContext } from "@/contexts/GameContext";
import { useGameActions } from "@/hooks/useGameActions";
import { Game } from "@/types/game";
import { useToast } from "@/hooks/use-toast";
import GameStatistics from "../statistics/GameStatistics";
import { GameListHeader } from "@/components/game/headers/GameListHeader";
import { GameTableView } from "@/components/game/lists/GameTableView";
import { GameCardView } from "@/components/game/lists/GameCardView";

export function GameList() {
  const { games, loading, error, createGame, fetchGames } = useGameContext();
  const { handleJoinGame, error: actionError } = useGameActions();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchGames();
    }
  }, [fetchGames]);

  useEffect(() => {
    if (error || actionError) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error ?? actionError,
      });
    }
  }, [error, actionError, toast]);

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
      <GameListHeader createGame={createGame} />
      <GameStatistics />

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Vue Table</TabsTrigger>
          <TabsTrigger value="cards">Vue Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <GameTableView
            games={games}
            getStatusBadge={getStatusBadge}
            handleJoinGame={handleJoinGame}
          />
        </TabsContent>

        <TabsContent value="cards">
          <GameCardView
            games={games}
            getStatusBadge={getStatusBadge}
            handleJoinGame={handleJoinGame}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
