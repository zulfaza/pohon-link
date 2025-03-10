export interface Link {
  id: string;
  title: string;
  url: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  customUrl: string;
  title: string;
  bio?: string | null;
  avatarUrl?: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
  updatedAt: string;
}
