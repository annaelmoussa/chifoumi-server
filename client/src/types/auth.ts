export interface User {
  _id: string;
  username: string;
}

export interface AuthFormData {
  username: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
