import React from "react";
import { Button } from "@/components/ui/button";
import { Game } from "@/types/game";
import { useAuthContext } from "@/contexts/AuthContext";

interface GameControlsProps {
  game: Game;
  turnStatus: string | null;
  canPlay: boolean;
  currentMove: "rock" | "paper" | "scissors" | null;
  playMove: (move: "rock" | "paper" | "scissors") => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  game,
  turnStatus,
  canPlay,
  currentMove,
  playMove,
}) => {
  const { user } = useAuthContext();

  if (game.winner) {
    return (
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold">
          {game.winner.username === user?.username
            ? "Vous avez gagné ! 🎉"
            : game.winner.username === "draw"
            ? "Match nul ! 🤝"
            : "Vous avez perdu ! 😢"}
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-xl">{turnStatus}</h3>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => playMove("rock")}
          disabled={!canPlay}
          variant={currentMove === "rock" ? "default" : "outline"}
        >
          🪨 Pierre
        </Button>
        <Button
          onClick={() => playMove("paper")}
          disabled={!canPlay}
          variant={currentMove === "paper" ? "default" : "outline"}
        >
          📄 Papier
        </Button>
        <Button
          onClick={() => playMove("scissors")}
          disabled={!canPlay}
          variant={currentMove === "scissors" ? "default" : "outline"}
        >
          ✂️ Ciseaux
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
