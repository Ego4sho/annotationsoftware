export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  quickTags: string[];
  steps: {
    id: string;
    name: string;
    description?: string;
    duration?: number;
  }[];
} 