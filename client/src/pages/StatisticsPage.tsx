import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameStatistics from "@/components/game/statistics/GameStatistics";
import { ArrowLeft, BarChart } from "lucide-react";

const StatisticsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Retour
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader className="flex items-center space-x-2">
          <BarChart className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-bold">Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <GameStatistics />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPage;
