import { useGameContext } from "@/contexts/GameContext";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export const useGames = () => {
  const { games, loading, error, createGame, fetchGames } = useGameContext();
  const { toast } = useToast();

  const handleCreateGame = useCallback(async () => {
    try {
      await createGame();
      toast({
        title: "Partie créée avec succès",
        description: "Vous pouvez maintenant jouer !",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la partie",
        variant: "destructive",
      });
    }
  }, [createGame, toast]);

  const refreshGames = useCallback(async () => {
    try {
      await fetchGames();
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de rafraîchir la liste des parties",
        variant: "destructive",
      });
    }
  }, [fetchGames, toast]);

  return {
    games,
    loading,
    error,
    createGame: handleCreateGame,
    refreshGames,
  };
}; 