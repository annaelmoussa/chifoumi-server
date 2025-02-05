import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '@/contexts/GameContext';
import { useAuthContext } from '@/contexts/AuthContext';

const GameStatistics = () => {
  const { games } = useGameContext();
  const { user } = useAuthContext();

  if (!user) return null;

  // Filter games where the current user is a participant and the game has a winner (finished game)
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
          <div>Parties jouées: {totalPlayed}</div>
          <div>Parties gagnées: {wins}</div>
          <div>Parties perdues: {losses}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStatistics; 