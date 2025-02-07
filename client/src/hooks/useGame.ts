import { useState, useEffect } from "react";
import { Game } from "@/types/game";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGameEvents } from "@/hooks/useGameEvents";

export type Move = "rock" | "paper" | "scissors";

export const useGame = (id: string) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentMove, setCurrentMove] = useState<Move | null>(null);

  const { toast } = useToast();
  const { user } = useAuthContext();

  const isPlayer1 =
    user && game ? user.username === game.user1?.username : false;
  const isPlayer2 =
    user && game ? user.username === game.user2?.username : false;

  let currentTurn;
  let displayTurn;
  if (game?.turns && game.turns.length > 0) {
    const lastTurn = game.turns[game.turns.length - 1];
    if (lastTurn.winner || (lastTurn.user1 && lastTurn.user2)) {
      currentTurn = { id: game.turns.length + 1, user1: null, user2: null };
    } else {
      currentTurn = { ...lastTurn, id: game.turns.length };
    }
    displayTurn = lastTurn;
  } else if (game?.user2) {
    currentTurn = { id: 1, user1: null, user2: null };
    displayTurn = { id: 1, user1: null, user2: null };
  } else {
    currentTurn = undefined;
    displayTurn = undefined;
  }

  const canPlay = Boolean(
    !currentMove &&
      game?.user2 &&
      !game.winner &&
      currentTurn &&
      ((isPlayer1 && !currentTurn.user1) ||
        (isPlayer2 && !currentTurn.user2 && currentTurn.user1))
  );

  const getTurnStatus = () => {
    if (!game?.user2) return "Waiting for player 2 to join...";
    if (game.winner) return null;
    if (currentMove) return "Waiting for opponent...";
    if (!currentTurn) return "Waiting to start...";

    const isYourTurn =
      (isPlayer1 && !currentTurn.user1) ||
      (isPlayer2 && !currentTurn.user2 && currentTurn.user1);

    return isYourTurn ? "Your turn!" : "Opponent's turn";
  };

  useGameEvents(id, (updatedGame: Game) => {
    if (updatedGame._id === id) {
      setGame(updatedGame);
      if (updatedGame.turns && updatedGame.turns.length > 0) {
        const lastTurn = updatedGame.turns[updatedGame.turns.length - 1];
        if (lastTurn.winner || (lastTurn.user1 && lastTurn.user2)) {
          setCurrentMove(null);
        }
      }
    }
  });

  useEffect(() => {
    const fetchGame = async () => {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
      try {
        const response = await fetch(`${API_URL}/matches/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch game");
        const data = await response.json();
        setGame(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch game details",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id, toast]);

  const playMove = async (move: Move) => {
    if (!game || !user || !currentTurn) return;
    try {
      setCurrentMove(move);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const turnId = currentTurn.id;
      const response = await fetch(`${API_URL}/matches/${id}/turns/${turnId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ move }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to play move");
      }

      const updatedGameResponse = await fetch(`${API_URL}/matches/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!updatedGameResponse.ok) {
        throw new Error("Failed to fetch updated game state");
      }
      const updatedGame = await updatedGameResponse.json();
      setGame(updatedGame);
    } catch (error) {
      setCurrentMove(null);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to play move",
      });
    }
  };

  return {
    game,
    loading,
    currentMove,
    canPlay,
    getTurnStatus,
    playMove,
    displayTurn,
  };
};
