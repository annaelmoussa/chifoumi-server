import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthFormData, LoginResponse, User } from "@/types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

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

      const result = await response.json();
      const token = result.token;
      localStorage.setItem("token", token);
      
      const userData = parseJwt(token);
      if (!userData) {
        throw new Error("Token invalide");
      }
      
      const user: User = {
        _id: userData._id,
        username: userData.username
      };
      
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/games");
      return user;
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
