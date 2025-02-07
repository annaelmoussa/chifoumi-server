import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "@/hooks/useGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PlayersHeader from "@/components/game/headers/PlayersHeader";
import MovesDisplay from "@/components/game/moves/MovesDisplay";
import GameControls from "@/components/game/controls/GameControls";
import GameHistory from "@/components/game/history/GameHistory";
import { ArrowLeft } from "lucide-react";

const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    game,
    loading,
    currentMove,
    canPlay,
    getTurnStatus,
    playMove,
    displayTurn,
  } = useGame(id || "");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Game</CardTitle>
        </CardHeader>
        <CardContent>
          <PlayersHeader game={game} />
          <MovesDisplay game={game} displayTurn={displayTurn} />
          <GameControls
            game={game}
            turnStatus={getTurnStatus()}
            canPlay={canPlay}
            currentMove={currentMove}
            playMove={playMove}
          />
          <GameHistory game={game} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GamePage;
