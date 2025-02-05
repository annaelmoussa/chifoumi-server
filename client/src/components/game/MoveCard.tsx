import React from "react";

interface MoveCardProps {
  move: "rock" | "paper" | "scissors" | null;
  revealed: boolean;
}

const MoveCard: React.FC<MoveCardProps> = ({ move, revealed }) => {
  const getMoveIcon = () => {
    if (move === "rock") return "🪨";
    if (move === "paper") return "📄";
    if (move === "scissors") return "✂️";
    return "";
  };

  return (
    <div className="flip-card w-24 h-32">
      <div className={`flip-card-inner ${revealed ? "flipped" : ""} w-full h-full`}>
        <div className="flip-card-front flex items-center justify-center bg-gray-300 rounded-lg">
          <span className="text-2xl font-bold">?</span>
        </div>
        <div className="flip-card-back flex items-center justify-center bg-white border rounded-lg">
          <span className="text-2xl">{getMoveIcon()}</span>
        </div>
      </div>
    </div>
  );
};

export default MoveCard; 