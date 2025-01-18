import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthPage } from "./components/auth/AuthPage";
import { GameList } from "./components/game/GameList";
import { GameProvider } from "./contexts/GameContext";
import { AuthProvider } from "./contexts/AuthContext";

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
          <main className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <GameList />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
