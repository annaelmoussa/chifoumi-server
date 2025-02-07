import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '@/contexts/GameContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { Crown, XCircle, List } from "lucide-react";

const GameStatistics = () => {
  const { games } = useGameContext();
  const { user } = useAuthContext();

  if (!user) return null;

  const playedGames = games.filter(game => {
    const isParticipant = game.user1.username === user.username || (game.user2 && game.user2.username === user.username);
    return isParticipant && game.winner;
  });

  const totalPlayed = playedGames.length;
  const wins = playedGames.filter(game => game.winner?.username === user.username).length;
  const losses = totalPlayed - wins;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Statistiques des parties jouées</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <List className="h-5 w-5 text-blue-500 mr-2" />
            <span>Parties jouées: {totalPlayed}</span>
          </div>
          <div className="flex items-center">
            <Crown className="h-5 w-5 text-yellow-500 mr-2" />
            <span>Parties gagnées: {wins}</span>
          </div>
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <span>Parties perdues: {losses}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStatistics; 