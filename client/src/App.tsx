import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthPage } from "@/pages/AuthPage";
import { GameList } from "@/components/game/lists/GameList";
import GamePage from "@/pages/GamePage";
import StatisticsPage from "@/pages/StatisticsPage";
import { GameProvider } from "@/contexts/GameContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import UserNav from "@/components/UserNav";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <UserNav />
          <main className="min-h-screen bg-background">
            <Routes>
              <Route
                path="/"
                element={
                  localStorage.getItem("token") ? (
                    <Navigate to="/games" replace />
                  ) : (
                    <AuthPage />
                  )
                }
              />
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <GameList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/:id"
                element={
                  <ProtectedRoute>
                    <GamePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/statistics"
                element={
                  <ProtectedRoute>
                    <StatisticsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Toaster />
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
