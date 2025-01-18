export interface User {
  _id: string;
  username: string;
}

export interface Turn {
  id: number;
  move?: string;
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
