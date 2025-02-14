import React from "react";
import { Game } from "@/types/game";
import { useAuthContext } from "@/contexts/AuthContext";
import { UserCheck } from "lucide-react";

interface PlayersHeaderProps {
  game: Game;
}

const PlayersHeader: React.FC<PlayersHeaderProps> = ({ game }) => {
  const { user } = useAuthContext();
  const isPlayer1 =
    user && game ? user.username === game.user1?.username : false;
  const isPlayer2 =
    user && game ? user.username === game.user2?.username : false;

  return (
    <div className="flex justify-between mb-8">
      <div className="text-center">
        <h3 className="font-bold">{game.user1.username}</h3>
        {isPlayer1 && (
          <UserCheck className="inline h-4 w-4 ml-2" aria-label="Vous" />
        )}
      </div>
      <div className="text-2xl font-bold">VS</div>
      <div className="text-center">
        <h3 className="font-bold">{game.user2?.username ?? "En attente..."}</h3>
        {isPlayer2 && (
          <UserCheck className="inline h-4 w-4 ml-2" aria-label="Vous" />
        )}
      </div>
    </div>
  );
};

export default PlayersHeader;
