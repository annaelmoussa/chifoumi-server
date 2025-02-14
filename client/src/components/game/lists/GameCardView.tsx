import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Game } from "@/types/game";
import { useNavigate } from "react-router-dom";

interface GameCardViewProps {
  games: Game[];
  getStatusBadge: (game: Game) => JSX.Element;
  handleJoinGame: (id: string) => void;
}

export function GameCardView({
  games,
  getStatusBadge,
  handleJoinGame,
}: Readonly<GameCardViewProps>) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {games.map((game: Game) => (
        <Card
          key={game._id}
          onClick={() => navigate(`/games/${game._id}`)}
          className="cursor-pointer"
        >
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinGame(game._id);
                  }}
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
  );
}
