import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { Game, Turn } from "@/types/game";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

interface GameContextType {
  games: Game[];
  loading: boolean;
  error: string | null;
  createGame: () => Promise<void>;
  joinGame: (gameId: string) => Promise<void>;
  fetchGames: () => Promise<void>;
  fetchGame: (gameId: string) => Promise<Game>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSubscriptions] = useState(
    new Map<string, EventSourcePolyfill>()
  );
  const loadingRef = useRef(false);
  const { toast } = useToast();

  const fetchGames = useCallback(async () => {
    if (loadingRef.current) return;
    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/matches`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch games");
      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const createGame = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/matches`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to create game");
      const newGame = await response.json();
      setGames((prev) => [...prev, newGame]);
      subscribeToGame(newGame._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchGame = async (gameId: string) => {
    try {
      const response = await fetch(`${API_URL}/matches/${gameId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch game");
      const updatedGame = await response.json();
      setGames((prev) =>
        prev.map((game) => (game._id === gameId ? updatedGame : game))
      );
      return updatedGame;
    } catch (err) {
      console.error("Error fetching game:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const joinGame = async (gameId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/matches/${gameId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to join game");
      await fetchGame(gameId);
      subscribeToGame(gameId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const subscribeToGame = useCallback(
    (gameId: string) => {
      if (activeSubscriptions.has(gameId)) {
        activeSubscriptions.get(gameId)?.close();
        activeSubscriptions.delete(gameId);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
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

      eventSource.onopen = (event) => {
        console.log("SSE connection opened:", event);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("SSE message received:", data);

          if (Array.isArray(data)) {
            data.forEach(message => {
              if (message.type) {
                handleGameEvent(message);
              }
            });
            return;
          }

          handleGameEvent(data);
        } catch (error) {
          console.error("Error processing SSE message:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Erreur lors de la réception des mises à jour en temps réel",
          });
        }
      };

      const handleGameEvent = (data: any) => {
        console.log("Processing game event:", data);
        
        const updateGame = async (matchId: string) => {
          try {
            const response = await fetch(`${API_URL}/matches/${matchId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!response.ok) throw new Error("Failed to fetch game");
            const updatedGame = await response.json();
            
            setGames((prev) =>
              prev.map((game) => {
                if (game._id === matchId) {
                  return {
                    ...updatedGame,
                    turns: updatedGame.turns.map((turn: Turn) => ({
                      ...turn,
                      user1: turn.winner ? turn.user1 : (turn.user1 || undefined),
                      user2: turn.winner ? turn.user2 : (turn.user2 || undefined),
                    })),
                  };
                }
                return game;
              })
            );
          } catch (error) {
            console.error("Error updating game state:", error);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de mettre à jour l'état du jeu",
            });
          }
        };

        const forceGameUpdate = async (matchId: string) => {
          try {
            const response = await fetch(`${API_URL}/matches/${matchId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!response.ok) throw new Error("Failed to fetch game");
            const updatedGame = await response.json();
            setGames((prev) => prev.map((game) => game._id === matchId ? updatedGame : game));
          } catch (error) {
            console.error("Error force updating game state:", error);
          }
        };

        switch (data.type) {
          case "PLAYER1_JOIN":
          case "PLAYER2_JOIN":
            updateGame(data.matchId);
            break;

          case "NEW_TURN":
            setGames((prev) =>
              prev.map((game) => {
                if (game._id === data.matchId) {
                  const newTurn: Turn = {
                    id: data.payload.turnId,
                    user1: undefined,
                    user2: undefined,
                    winner: undefined,
                  };
                  return {
                    ...game,
                    turns: [...game.turns, newTurn],
                  };
                }
                return game;
              })
            );
            setTimeout(() => updateGame(data.matchId), 100);
            setTimeout(() => forceGameUpdate(data.matchId), 300);
            break;

          case "PLAYER1_MOVED":
          case "PLAYER2_MOVED":
            setGames((prev) =>
              prev.map((game) => {
                if (game._id === data.matchId) {
                  const updatedTurns = [...game.turns];
                  const currentTurn = { ...updatedTurns[updatedTurns.length - 1] };
                  
                  if (data.type === "PLAYER1_MOVED") {
                    currentTurn.user1 = "?";
                  } else {
                    currentTurn.user2 = "?";
                  }

                  return {
                    ...game,
                    turns: [...updatedTurns.slice(0, -1), currentTurn],
                  };
                }
                return game;
              })
            );
            setTimeout(() => updateGame(data.matchId), 100);
            break;

          case "TURN_ENDED":
            setGames((prev) =>
              prev.map((game) => {
                if (game._id === data.matchId) {
                  const updatedTurns = [...game.turns];
                  const currentTurn = { ...updatedTurns[updatedTurns.length - 1] };
                  currentTurn.winner = data.payload.winner;
                  
                  return {
                    ...game,
                    turns: [...updatedTurns.slice(0, -1), currentTurn],
                  };
                }
                return game;
              })
            );
            setTimeout(() => updateGame(data.matchId), 100);
            setTimeout(() => forceGameUpdate(data.matchId), 300);
            break;

          case "MATCH_ENDED":
            updateGame(data.matchId);
            setTimeout(() => forceGameUpdate(data.matchId), 200);
            break;

          default:
            console.log("Received event:", data.type, data);
        }
      };

      eventSource.onerror = (event) => {
        console.error("SSE error:", event);
        const retryAfter = 5000;
        setTimeout(() => {
          console.log("Attempting to reconnect SSE...");
          eventSource.close();
          activeSubscriptions.delete(gameId);
          subscribeToGame(gameId);
        }, retryAfter);

        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Tentative de reconnexion en cours...",
        });
      };

      activeSubscriptions.set(gameId, eventSource);
      return eventSource;
    },
    [activeSubscriptions, toast]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchGames();

    return () => {
      activeSubscriptions.forEach((eventSource) => eventSource.close());
      activeSubscriptions.clear();
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        games,
        loading,
        error,
        createGame,
        joinGame,
        fetchGames,
        fetchGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}
