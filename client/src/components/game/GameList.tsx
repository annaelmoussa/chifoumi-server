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
import { CreateGameDialog } from "./CreateGameDialog";
import { GameTableRow } from "./GameTableRow";
import { useGameContext } from "@/contexts/GameContext";
import { useGameActions } from "@/hooks/useGameActions";
import { Game } from "@/types/game";

export function GameList() {
  const { games, loading, error, createGame, fetchGames } = useGameContext();
  const { handleJoinGame, error: actionError } = useGameActions();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchGames();
    }
  }, []);

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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Mes Parties</h2>
        <CreateGameDialog onCreateGame={createGame} />
      </div>

      {(error || actionError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error || actionError}
        </div>
      )}

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
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
