import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "@/contexts/GameContext";

export function useGameActions() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { joinGame } = useGameContext();

  const handleJoinGame = async (gameId: string) => {
    try {
      await joinGame(gameId);
      navigate(`/games/${gameId}`);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err: unknown) => {
    setError(err instanceof Error ? err.message : "Une erreur est survenue");
  };

  const clearError = () => {
    setError("");
  };

  return {
    error,
    handleJoinGame,
    handleError,
    clearError,
  };
}
