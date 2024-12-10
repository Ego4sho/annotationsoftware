import { Timestamp } from 'firebase/firestore';

export type FileType = 'video' | 'audio' | 'motion' | 'aux1' | 'aux2' | 'aux3' | 'aux4' | 'aux5';

export type Status = 'not-started' | 'in-progress' | 'completed';

export interface Progress {
  labeling: Status;
  rating: Status;
  validated: Status;
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
    aux1: ProjectFile[];
    aux2: ProjectFile[];
    aux3: ProjectFile[];
    aux4: ProjectFile[];
    aux5: ProjectFile[];
  };
  progress: Progress;
  projectId?: string;
  deleted?: boolean;
}

export interface UploadFile {
  id: string;
  file: File;
  type: FileType;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  userId: string;
  type: FileType;
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

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  collections: string[];
  deleted: boolean;
  status: 'incomplete' | 'processing' | 'ready' | 'error';
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  type: FileType;
  fileName: string;
}

export interface UploadError {
  fileId: string;
  error: string;
  type: FileType;
  fileName: string;
} 