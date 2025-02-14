import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GameTableRow } from "@/components/game/lists/GameTableRow";
import { Game } from "@/types/game";

interface GameTableViewProps {
  games: Game[];
  getStatusBadge: (game: Game) => JSX.Element;
  handleJoinGame: (id: string) => void;
}

export function GameTableView({
  games,
  getStatusBadge,
  handleJoinGame,
}: Readonly<GameTableViewProps>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Joueur 1</TableHead>
            <TableHead>Joueur 2</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
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
  );
}
