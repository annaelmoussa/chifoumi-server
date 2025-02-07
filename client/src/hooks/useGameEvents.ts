import { useEffect, useRef } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { Game } from "@/types/game";
import { useToast } from "@/hooks/use-toast";
import { useGameContext } from "@/contexts/GameContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

interface GameEvent {
  type: string;
  matchId: string;
  payload: any;
}

export function useGameEvents(gameId: string, onGameUpdate: (game: Game) => void) {
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const { toast } = useToast();
  const { fetchGame } = useGameContext();
  const lastProcessedEventsRef = useRef<string>("");
  const lastEventTimeRef = useRef<number>(0);

  const updateGameState = async (immediate = false) => {
    const now = Date.now();
    if (!immediate && now - lastEventTimeRef.current < 50) {
      return;
    }
    lastEventTimeRef.current = now;

    try {
      const updatedGame = await fetchGame(gameId);
      if (updatedGame) {
        onGameUpdate(updatedGame);
      }
    } catch (error) {
      console.error("Failed to fetch updated game state:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const eventSource = new EventSourcePolyfill(
      `${API_URL}/matches/${gameId}/subscribe`,
      {
        heartbeatTimeout: 45000,
        withCredentials: true,
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const events = JSON.parse(event.data);
        const eventsArray = Array.isArray(events) ? events : [events];

        const eventsString = JSON.stringify(eventsArray);
        if (eventsString === lastProcessedEventsRef.current) {
          return;
        }
        lastProcessedEventsRef.current = eventsString;
        eventsArray.forEach((data: GameEvent) => {
          switch (data.type) {
            case "PLAYER1_JOIN":
              updateGameState(true);
              toast({
                title: "Nouveau joueur",
                description: "Le joueur 1 a rejoint la partie !",
              });
              break;

            case "PLAYER2_JOIN":
              updateGameState(true);
              toast({
                title: "Nouveau joueur",
                description: "Le joueur 2 a rejoint la partie !",
              });
              break;

            case "NEW_TURN":
              updateGameState(true);
              toast({
                title: "Nouveau tour",
                description: "C'est un nouveau tour !",
              });
              setTimeout(() => updateGameState(true), 100);
              break;

            case "PLAYER1_MOVED":
              updateGameState();
              toast({
                title: "Coup joué",
                description: "Le joueur 1 a joué son coup !",
              });
              break;

            case "PLAYER2_MOVED":
              updateGameState();
              toast({
                title: "Coup joué",
                description: "Le joueur 2 a joué son coup !",
              });
              break;

            case "TURN_ENDED":
              updateGameState(true);
              const { winner } = data.payload;
              toast({
                title: "Fin du tour",
                description: winner === "draw" 
                  ? "Match nul pour ce tour !" 
                  : `${winner} a gagné ce tour !`,
              });
              setTimeout(() => updateGameState(true), 100);
              break;

            case "MATCH_ENDED":
              updateGameState(true);
              const matchWinner = data.payload.winner;
              toast({
                title: "Fin de la partie !",
                description: matchWinner === "draw"
                  ? "La partie se termine sur un match nul !"
                  : `${matchWinner} a gagné la partie !`,
                variant: "default",
              });
              break;
          }
        });
      } catch (error) {
        console.error("Error processing SSE message:", error);
      }
    };

    eventSource.onerror = () => {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Connexion perdue. Tentative de reconnexion...",
      });
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [gameId, onGameUpdate, toast, fetchGame]);

  return eventSourceRef.current;
} 