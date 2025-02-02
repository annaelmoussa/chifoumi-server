import { Game, User } from "@/types/game";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useGameContext } from "@/contexts/GameContext";

interface GameTableRowProps {
  game: Game;
  currentUser: User | null;
}

export function GameTableRow({ game, currentUser }: GameTableRowProps) {
  const { joinGame } = useGameContext();

  const isCreator = currentUser?._id === game.user1._id;
  const canJoin = !isCreator && !game.user2 && !game.winner;
  const isParticipant = isCreator || currentUser?._id === game.user2?._id;

  const getStatus = () => {
    if (game.winner) {
      return (
        <span className="text-green-600">
          Terminée - Gagnant: {game.winner.username}
        </span>
      );
    }
    if (!game.user2) {
      return <span className="text-yellow-600">En attente d'un adversaire</span>;
    }
    return <span className="text-blue-600">En cours</span>;
  };

  const handleJoinGame = async () => {
    if (canJoin) {
      await joinGame(game._id);
    }
  };

  return (
    <TableRow>
      <TableCell>{game.user1.username}</TableCell>
      <TableCell>{game.user2?.username || "-"}</TableCell>
      <TableCell>{getStatus()}</TableCell>
      <TableCell>
        {(() => {
          try {
            const date = new Date(game.createdAt);
            if (isNaN(date.getTime())) {
              return "Date invalide";
            }
            return formatDistanceToNow(date, {
              addSuffix: true,
              locale: fr,
            });
          } catch (error) {
            return "Date invalide";
          }
        })()}
      </TableCell>
      <TableCell>
        {canJoin ? (
          <Button onClick={handleJoinGame} size="sm">
            Rejoindre
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={!isParticipant}
            onClick={() => {
              // TODO: Implémenter la navigation vers la page de jeu
              console.log("Naviguer vers la partie:", game._id);
            }}
          >
            {isParticipant ? "Voir" : "Non disponible"}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
