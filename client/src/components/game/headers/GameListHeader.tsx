import { CreateGameDialog } from "@/components/game/dialogs/CreateGameDialog";

interface GameListHeaderProps {
  createGame: () => Promise<void>;
}

export function GameListHeader({ createGame }: GameListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold tracking-tight">Mes Parties</h2>
      <CreateGameDialog onCreateGame={createGame} />
    </div>
  );
}
