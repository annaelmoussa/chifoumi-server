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
import { Game } from "@/types/game";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

interface GameContextType {
  games: Game[];
  loading: boolean;
  error: string | null;
  createGame: () => Promise<void>;
  joinGame: (gameId: string) => Promise<void>;
  fetchGames: () => Promise<void>;
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
      const updatedGame = await response.json();
      setGames((prev) =>
        prev.map((game) => (game._id === gameId ? updatedGame : game))
      );
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
      }

      const eventSource = new EventSourcePolyfill(
        `${API_URL}/matches/${gameId}/subscribe`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "PLAYER1_JOIN":
          case "PLAYER2_JOIN":
            setGames((prev) =>
              prev.map((game) =>
                game._id === data.matchId
                  ? { ...game, user2: data.payload.user }
                  : game
              )
            );
            break;
          case "PLAYER1_MOVED":
          case "PLAYER2_MOVED":
          case "TURN_ENDED":
          case "MATCH_ENDED":
            setGames((prev) =>
              prev.map((game) =>
                game._id === data.matchId
                  ? { ...game, ...data.payload.game }
                  : game
              )
            );
            break;
        }
      };

      eventSource.onerror = () => {
        console.error("SSE error, falling back to polling");
        eventSource.close();
        activeSubscriptions.delete(gameId);
      };

      activeSubscriptions.set(gameId, eventSource);
      return eventSource;
    },
    [activeSubscriptions]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch initial games
    fetchGames();

    return () => {
      // Cleanup all subscriptions
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
