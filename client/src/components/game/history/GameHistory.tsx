import React from "react";
import { Game, Turn } from "@/types/game";
import { Clock, User, Trophy } from "lucide-react";

interface GameHistoryProps {
  game: Game;
}

const GameHistory: React.FC<GameHistoryProps> = ({ game }) => {
  return (
    <div className="mt-8">
      <h3 className="font-bold mb-2">Historique des tours</h3>
      <div className="space-y-2">
        {game.turns.map((turn: Turn, index: number) => (
          <div
            key={`${turn.id}-${index}`}
            className="p-2 border rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span>Turn {turn.id}</span>
              </div>
              <span className="flex items-center gap-1">
                <User size={16} className="text-gray-500" />
                {game.user1.username}:{" "}
                {turn.user1 === "?" ? "?" : turn.user1 ?? "en attente..."}
              </span>
              {game.user2 && (
                <span className="flex items-center gap-1">
                  <User size={16} className="text-gray-500" />
                  {game.user2.username}:{" "}
                  {turn.user2 === "?" ? "?" : turn.user2 ?? "en attente..."}
                </span>
              )}
            </div>
            {turn.winner && (
              <span className="font-medium flex items-center gap-2">
                <Trophy size={16} className="text-yellow-500" />
                {turn.winner === "draw"
                  ? "Match nul!"
                  : turn.winner === game.user1.username
                  ? `${game.user1.username} a gagné!`
                  : `${game.user2?.username} a gagné!`}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory;
