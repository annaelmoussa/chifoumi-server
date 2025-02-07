import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Game } from "@/types/game";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface GameTableRowProps {
  game: Game;
  onJoinGame: (gameId: string) => void;
  statusBadge: ReactNode;
}

export function GameTableRow({ game, onJoinGame, statusBadge }: GameTableRowProps) {
  const navigate = useNavigate();
  const formattedDate = new Date(game.createdAt).toLocaleDateString();

  const handleViewGame = () => {
    navigate(`/games/${game._id}`);
  };

  return (
    <TableRow>
      <TableCell>{game.user1.username}</TableCell>
      <TableCell>{game.user2 ? game.user2.username : "En attente"}</TableCell>
      <TableCell>{statusBadge}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!game.user2 && (
              <DropdownMenuItem onClick={() => onJoinGame(game._id)}>
                Rejoindre la partie
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleViewGame}>
              Voir la partie
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
