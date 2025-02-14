import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
  login: (username: string, password: string) => Promise<User | null>;
  register: (
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const auth = useAuth();

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, [auth]);

  const login = async (username: string, password: string) => {
    const user = await auth.login({ username, password });
    if (user) setUser(user);
    return user;
  };

  const register = async (
    username: string,
    password: string,
    confirmPassword: string
  ) => {
    const user = await auth.register({ username, password, confirmPassword });
    if (user) setUser(user);
    return user;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: auth.isLoading,
        error: auth.error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
