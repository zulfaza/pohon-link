export interface Link {
  id: string;
  title: string;
  url: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  customUrl: string;
  title: string;
  bio?: string | null;
  avatarUrl?: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: Date;
  updatedAt: Date;
}
