import { Collection as FirebaseCollection, Project as FirebaseProject } from '@/types/upload';
import { Timestamp } from 'firebase/firestore';

export type Status = 'not-started' | 'in-progress' | 'completed'

export interface Progress {
  labeling: Status
  rating: Status
  validated: Status
}

export interface ProjectFile {
  id: string;
  projectId: string;
  userId: string;
  type: 'video' | 'audio' | 'motion';
  fileName: string;
  originalName: string;
  fileUrl: string;
  size: number;
  uploadedAt: Timestamp;
  status: 'ready' | 'processing' | 'error';
  processingProgress?: number;
  error?: string;
  metadata?: {
    duration?: number;
    frameRate?: number;
    resolution?: string;
    format?: string;
  };
}

export interface File {
  id: string
  name: string
  type: 'video' | 'audio' | 'sensor'
  size?: string
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'incomplete' | 'processing' | 'ready' | 'error';
  files: {
    video: ProjectFile[];
    audio: ProjectFile[];
    motion: ProjectFile[];
  };
  progress: Progress;
  currentProjectId?: string;
  deleted?: boolean;
  // Legacy file structures
  videoFiles?: ProjectFile[];
  audioFiles?: ProjectFile[];
  motionFiles?: ProjectFile[];
  projectFiles?: ProjectFile[];
  projectId?: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'incomplete' | 'processing' | 'ready' | 'error';
  fileCount: {
    video: number;
    audio: number;
    motion: number;
  };
  totalSize: number;
  collections?: Collection[];
  deleted?: boolean;
}

export interface UploadState {
  files: File[]
  collections: Collection[]
  projects: Project[]
  deleteMode: boolean
  searchTerm: string
  sortFilter: 'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress'
  editingCollection: Collection | null
  isCollectionDialogOpen: boolean
  isAddingProjectOpen: boolean
  newProjectData: Omit<Project, 'id' | 'collections'>
}

export interface UploadUIProps extends UploadState {
  onFileUpload: (files: File[]) => void
  onFileDelete: (id: string) => void
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void
  onCreateCollection: (collection: Collection) => void
  onEditCollection: (collection: Collection | null) => void
  onSaveCollection: (collection: Collection) => void
  onDeleteCollection: (id: string, projectId?: string) => void
  onAddProject: () => void
  onDeleteProject: (id: string) => void
  onDeleteModeToggle: () => void
  onSearchChange: (term: string) => void
  onSortFilterChange: (filter: UploadState['sortFilter']) => void
  onCollectionDialogClose: () => void
  onAddingProjectToggle: () => void
  onNewProjectDataChange: (data: Partial<Omit<Project, 'id' | 'collections'>>) => void
  onAddNewCollection: () => void
  onEditProject: (projectId: string, data: { title: string; name: string; description: string }) => void
} 