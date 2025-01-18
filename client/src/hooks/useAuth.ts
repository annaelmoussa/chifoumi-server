import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthFormData, LoginResponse, User } from "@/types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Identifiants invalides");
      }

      const result: LoginResponse = await response.json();
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/games");
      return result.user;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setError("");

      if (data.password !== data.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'inscription");
      }

      // Auto-login after successful registration
      return login({
        username: data.username,
        password: data.password,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  return {
    isLoading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
  };
}
