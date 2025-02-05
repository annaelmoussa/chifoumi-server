import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Game, Turn } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGameEvents } from "@/hooks/useGameEvents";
import MoveCard from "./MoveCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

type Move = "rock" | "paper" | "scissors";

const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMove, setCurrentMove] = useState<Move | null>(null);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const isPlayer1 = user && game ? user.username === game.user1?.username : false;
  const isPlayer2 = user && game ? user.username === game.user2?.username : false;
  const currentTurn = game?.turns && game.turns.length > 0 
    ? (game.turns[game.turns.length - 1].winner || (game.turns[game.turns.length - 1].user1 && game.turns[game.turns.length - 1].user2))
      ? { id: game.turns.length + 1, user1: null, user2: null }
      : { ...game.turns[game.turns.length - 1], id: game.turns.length }
    : game?.user2 
      ? { id: 1, user1: null, user2: null }
      : undefined;

  const displayTurn = game?.turns && game.turns.length > 0
    ? game.turns[game.turns.length - 1]
    : (game?.user2 ? { id: 1, user1: null, user2: null } : undefined);

  console.log("User:", user?.username);
console.log("Player1:", game?.user1?.username);
console.log("Player2:", game?.user2?.username);

  
  console.log("Game state:", {
    gameId: game?._id,
    user: user?.username,
    user1: game?.user1?.username,
    user2: game?.user2?.username,
    isPlayer1,
    isPlayer2,
    currentTurn,
    turnsCount: game?.turns?.length,
    player1Move: currentTurn?.user1,
    player2Move: currentTurn?.user2
  });

  const canPlay = Boolean(
    !currentMove &&
    game?.user2 &&
    !game.winner &&
    currentTurn &&
    ((isPlayer1 && (!currentTurn.user1 || currentTurn.user1 === null)) ||
     (isPlayer2 && (!currentTurn.user2 || currentTurn.user2 === null) && currentTurn.user1))
  );

  const getTurnStatus = () => {
    if (!game?.user2) return "Waiting for player 2 to join...";
    if (game.winner) return null;
    if (currentMove) return "Waiting for opponent...";
    if (!currentTurn) return "Waiting to start...";
    
    const isYourTurn = (isPlayer1 && (!currentTurn.user1 || currentTurn.user1 === null)) || 
                       (isPlayer2 && (!currentTurn.user2 || currentTurn.user2 === null) && currentTurn.user1);
    
    if (isYourTurn) return "Your turn!";
    return "Opponent's turn";
  };

  console.log({
    currentMove,
    user2Exists: !!game?.user2,
    currentTurnExists: !!currentTurn,
    noWinner: !game?.winner,
    player1CanMove: isPlayer1 && !currentTurn?.user1,
    player2CanMove: isPlayer2 && !currentTurn?.user2,
    currentTurnState: currentTurn,
    user1Move: currentTurn?.user1,
    user2Move: currentTurn?.user2
  });
  

  useGameEvents(id || "", (updatedGame) => {
    console.log("Received game update:", updatedGame);
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
      console.error("Error playing move:", error);
      setCurrentMove(null);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to play move",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-8">
            <div className="text-center">
              <h3 className="font-bold">{game.user1.username}</h3>
              {isPlayer1 && <span className="text-sm">(You)</span>}
            </div>
            <div className="text-2xl font-bold">VS</div>
            <div className="text-center">
              <h3 className="font-bold">{game.user2?.username || "Waiting..."}</h3>
              {isPlayer2 && <span className="text-sm">(You)</span>}
            </div>
          </div>
          <div className="flex justify-center gap-8 my-4">
            <div>
              <MoveCard move={displayTurn?.user1 ? displayTurn.user1 as "rock" | "paper" | "scissors" : null} revealed={Boolean(displayTurn?.user1)} />
              <p className="text-center text-sm mt-2">{game.user1.username}</p>
            </div>
            <div>
              <MoveCard move={displayTurn?.user2 ? displayTurn.user2 as "rock" | "paper" | "scissors" : null} revealed={Boolean(displayTurn?.user2)} />
              <p className="text-center text-sm mt-2">{game.user2 ? game.user2.username : "Waiting..."}</p>
            </div>
          </div>

          {game.winner ? (
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">
                {game.winner.username === user?.username
                  ? "You won! 🎉"
                  : game.winner.username === "draw"
                  ? "It's a draw! 🤝"
                  : "You lost! 😢"}
              </h3>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl">{getTurnStatus()}</h3>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => playMove("rock")}
                  disabled={!canPlay}
                  variant={currentMove === "rock" ? "default" : "outline"}
                >
                  🪨 Rock
                </Button>
                <Button
                  onClick={() => playMove("paper")}
                  disabled={!canPlay}
                  variant={currentMove === "paper" ? "default" : "outline"}
                >
                  📄 Paper
                </Button>
                <Button
                  onClick={() => playMove("scissors")}
                  disabled={!canPlay}
                  variant={currentMove === "scissors" ? "default" : "outline"}
                >
                  ✂️ Scissors
                </Button>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="font-bold mb-2">Game History</h3>
            <div className="space-y-2">
              {game.turns.map((turn: Turn, index: number) => (
                <div
                  key={turn.id}
                  className="p-2 border rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <span>Turn {turn.id}</span>
                    <span>
                      {game.user1.username}: {turn.user1 === "?" ? "?" : turn.user1 || "waiting..."}
                    </span>
                    {game.user2 && (
                      <span>
                        {game.user2.username}: {turn.user2 === "?" ? "?" : turn.user2 || "waiting..."}
                      </span>
                    )}
                  </div>
                  {turn.winner && (
                    <span className="font-medium">
                      {turn.winner === "draw"
                        ? "Draw!"
                        : turn.winner === game.user1.username
                        ? `${game.user1.username} won!`
                        : `${game.user2?.username} won!`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamePage; 