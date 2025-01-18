import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateGameDialogProps {
  onCreateGame: () => void;
}

export function CreateGameDialog({ onCreateGame }: CreateGameDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Nouvelle Partie</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle partie</DialogTitle>
          <DialogDescription>
            Voulez-vous créer une nouvelle partie ? Vous serez mis en attente
            d'un adversaire.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onCreateGame}>Créer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
