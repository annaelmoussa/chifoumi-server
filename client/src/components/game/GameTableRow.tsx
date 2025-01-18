import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Game } from "@/types/game";

interface GameTableRowProps {
  game: Game;
  onJoinGame: (gameId: string) => void;
}

export function GameTableRow({ game, onJoinGame }: GameTableRowProps) {
  return (
    <TableRow>
      <TableCell>{new Date(game.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>{game.user1.username}</TableCell>
      <TableCell>
        {game.user2 ? game.user2.username : "En attente..."}
      </TableCell>
      <TableCell>
        {game.winner
          ? `Terminé - Gagnant: ${game.winner.username}`
          : game.user2
          ? "En cours"
          : "En attente"}
      </TableCell>
      <TableCell>
        <Button variant="outline" onClick={() => onJoinGame(game._id)}>
          {game.user2 ? "Rejoindre" : "En attente"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
