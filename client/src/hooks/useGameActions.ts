import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Game } from "@/types/game";

export function useGameActions() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleJoinGame = (gameId: string) => {
    console.log("Rejoindre la partie", gameId);
    // TODO: Implémenter la navigation vers la page de jeu
    // navigate(`/game/${gameId}`);
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
