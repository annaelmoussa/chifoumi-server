import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CreateGameDialogProps {
  onCreateGame: () => Promise<void>;
}

export function CreateGameDialog({ onCreateGame }: Readonly<CreateGameDialogProps>) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      await onCreateGame();
      setOpen(false);
      toast({
        title: "Partie créée",
        description: "Votre partie a été créée avec succès. En attente d'un adversaire...",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la partie. Veuillez réessayer.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nouvelle Partie
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle partie</DialogTitle>
          <DialogDescription>
            Voulez-vous créer une nouvelle partie ? Vous serez mis en attente
            d'un adversaire.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Annuler
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className={cn(
              "relative",
              isCreating && "cursor-not-allowed opacity-50"
            )}
          >
            {isCreating ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
