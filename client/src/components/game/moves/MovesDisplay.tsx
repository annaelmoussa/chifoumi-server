import React from "react";
import MoveCard from "@/components/game/moves/MoveCard";
import { Game, Turn } from "@/types/game";

interface MovesDisplayProps {
  game: Game;
  displayTurn?:
    | Turn
    | { id: number; user1: string | null; user2: string | null };
}

const MovesDisplay: React.FC<MovesDisplayProps> = ({ game, displayTurn }) => {
  return (
    <div className="flex justify-center gap-8 my-4">
      <div>
        <MoveCard
          move={
            displayTurn?.user1
              ? (displayTurn.user1 as "rock" | "paper" | "scissors")
              : null
          }
          revealed={Boolean(displayTurn?.user1)}
        />
        <p className="text-center text-sm mt-2">{game.user1.username}</p>
      </div>
      <div>
        <MoveCard
          move={
            displayTurn?.user2
              ? (displayTurn.user2 as "rock" | "paper" | "scissors")
              : null
          }
          revealed={Boolean(displayTurn?.user2)}
        />
        <p className="text-center text-sm mt-2">
          {game.user2 ? game.user2.username : "En attente..."}
        </p>
      </div>
    </div>
  );
};

export default MovesDisplay;
