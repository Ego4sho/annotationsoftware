export interface Session {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  files: {
    video?: string;
    motion?: string;
    audio?: string[];
  };
} 