export interface User {
  _id: string;
  username: string;
}

export interface Turn {
  id: number;
  user1?: string;
  user2?: string;
  winner?: string;
}

export interface Game {
  _id: string;
  user1: User;
  user2: User | null;
  turns: Turn[];
  createdAt: string;
  winner?: {
    username: string;
  };
}
