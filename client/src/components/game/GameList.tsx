import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

interface Match {
  _id: string;
  user1: {
    username: string;
    _id: string;
  };
  user2: {
    username: string;
    _id: string;
  } | null;
  turns: any[];
  createdAt: string;
  winner?: {
    username: string;
  };
}

export function GameList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Non authentifié");

      const response = await fetch(`${API_URL}/matches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la récupération des parties");

      const data = await response.json();
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const createMatch = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Non authentifié");

      const response = await fetch(`${API_URL}/matches`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création de la partie");

      await fetchMatches();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Mes Parties</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nouvelle Partie</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle partie</DialogTitle>
              <DialogDescription>
                Voulez-vous créer une nouvelle partie ? Vous serez mis en
                attente d'un adversaire.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={createMatch}>Créer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Joueur 1</TableHead>
              <TableHead>Joueur 2</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Aucune partie trouvée
                </TableCell>
              </TableRow>
            ) : (
              matches.map((match) => (
                <TableRow key={match._id}>
                  <TableCell>
                    {new Date(match.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{match.user1.username}</TableCell>
                  <TableCell>
                    {match.user2 ? match.user2.username : "En attente..."}
                  </TableCell>
                  <TableCell>
                    {match.winner
                      ? `Terminé - Gagnant: ${match.winner.username}`
                      : match.user2
                      ? "En cours"
                      : "En attente"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // TODO: Implémenter la navigation vers la page de jeu
                        console.log("Rejoindre la partie", match._id);
                      }}
                    >
                      {match.user2 ? "Rejoindre" : "En attente"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
