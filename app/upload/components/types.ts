export interface NewProjectData {
  title: string;
  description: string;
  createdDate: string; // Store as YYYY-MM-DD string
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdDate: Date;
  collections: Collection[];
}

export type Status = 'not-started' | 'in-progress' | 'completed';

export interface UploadUIProps {
  collections: Collection[];
  projects: Project[];
  deleteMode: boolean;
  searchTerm: string;
  sortFilter: 'newest' | 'oldest';
  editingCollection: Collection | null;
  isCollectionDialogOpen: boolean;
  isAddingProjectOpen: boolean;
  newProjectData: NewProjectData;
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void;
  onCreateCollection: (collection: Collection) => void;
  onEditCollection: (collection: Collection) => void;
  onSaveCollection: (collection: Collection) => void;
  onDeleteCollection: (id: string, projectId?: string) => void;
  onAddProject: () => void;
  onDeleteProject: (id: string) => void;
  onDeleteModeToggle: () => void;
  onSearchChange: (term: string) => void;
  onSortFilterChange: (filter: 'newest' | 'oldest') => void;
  onCollectionDialogClose: () => void;
  onAddingProjectToggle: () => void;
  onNewProjectDataChange: (data: NewProjectData) => void;
  onAddNewCollection: () => void;
  onEditProject: (id: string, data: { title: string; description: string; createdDate: Date }) => void;
}

export interface Progress {
  labeling: Status;
  rating: Status;
  validated: Status;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  createdDate: Date;
  videoFiles: File[];
  audioFiles: File[];
  bvhFile: File | null;
  auxFiles: {
    [key: number]: File | null;
  };
  progress: Progress;
  currentProjectId?: string;
}

export interface ProjectEditData {
  title: string;
  description: string;
  createdDate: string;
} 