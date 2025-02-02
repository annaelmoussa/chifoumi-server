import { useEffect } from "react";
import { useGames } from "@/hooks/useGames";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { GameTableRow } from "./GameTableRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthContext } from "@/contexts/AuthContext";

export function GameList() {
  const { games, loading, createGame, refreshGames } = useGames();
  const { user } = useAuthContext();

  useEffect(() => {
    refreshGames();
  }, [refreshGames]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des parties</h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshGames}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Rafraîchir
          </Button>
          <Button onClick={createGame} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle partie
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Créateur</TableHead>
              <TableHead>Adversaire</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  {loading
                    ? "Chargement..."
                    : "Aucune partie disponible. Créez-en une !"}
                </TableCell>
              </TableRow>
            ) : (
              games.map((game) => (
                <GameTableRow key={game._id} game={game} currentUser={user} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
