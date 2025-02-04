import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Game } from "@/types/game";
import { useGameContext } from "@/contexts/GameContext";

export function useGameActions() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { joinGame } = useGameContext();

  const handleJoinGame = async (gameId: string) => {
    try {
      await joinGame(gameId);
      // TODO: Implémenter la navigation vers la page de jeu une fois créée
      // navigate(`/game/${gameId}`);
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
