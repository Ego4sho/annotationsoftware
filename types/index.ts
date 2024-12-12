export interface HomePageProps {
  handleSignIn: () => Promise<void>
  handleSignUp: () => Promise<void>
  isLoading?: boolean
  error?: string
}

export interface HomePageState {
  isLoading: boolean
  error?: string
}

export interface Collection {
  id: string;
  name: string;
  userId: string;
  projectId?: string | null;
  deleted?: boolean;
  files?: {
    video?: string[];
    audio?: string[];
    motion?: string[];
    aux1?: string[];
    aux2?: string[];
    aux3?: string[];
    aux4?: string[];
    aux5?: string[];
  };
  progress?: {
    labeling?: 'not-started' | 'in-progress' | 'completed';
    rating?: 'not-started' | 'in-progress' | 'completed';
    validated?: 'not-started' | 'in-progress' | 'completed';
  };
}

export interface Project {
  id: string;
  name: string;
  userId: string;
  deleted?: boolean;
  collections?: string[];
  description?: string;
} 