import { create } from 'zustand';
import { UploadFile } from '@/types/upload';

interface FilesByCollection {
  [collectionId: string]: UploadFile[];
}

interface UploadState {
  filesByCollection: FilesByCollection;
  addFile: (collectionId: string, file: UploadFile) => void;
  updateFile: (collectionId: string, fileId: string, updates: Partial<UploadFile>) => void;
  removeFile: (collectionId: string, fileId: string) => void;
  clearFiles: (collectionId: string) => void;
  updateFileProgress: (collectionId: string, fileId: string, progress: number, status?: UploadFile['status']) => void;
  getFiles: (collectionId: string) => UploadFile[];
}

export const useUploadState = create<UploadState>()((set, get) => ({
  filesByCollection: {},
  
  addFile: (collectionId: string, file: UploadFile) => 
    set((state) => ({
      filesByCollection: {
        ...state.filesByCollection,
        [collectionId]: [...(state.filesByCollection[collectionId] || []), file]
      }
    })),
  
  updateFile: (collectionId: string, fileId: string, updates: Partial<UploadFile>) =>
    set((state) => ({
      filesByCollection: {
        ...state.filesByCollection,
        [collectionId]: (state.filesByCollection[collectionId] || []).map((file) =>
          file.id === fileId ? { ...file, ...updates } : file
        )
      }
    })),
  
  removeFile: (collectionId: string, fileId: string) =>
    set((state) => ({
      filesByCollection: {
        ...state.filesByCollection,
        [collectionId]: (state.filesByCollection[collectionId] || []).filter((file) => file.id !== fileId)
      }
    })),
  
  clearFiles: (collectionId: string) => 
    set((state) => ({
      filesByCollection: {
        ...state.filesByCollection,
        [collectionId]: []
      }
    })),

  updateFileProgress: (collectionId: string, fileId: string, progress: number, status?: UploadFile['status']) =>
    set((state) => ({
      filesByCollection: {
        ...state.filesByCollection,
        [collectionId]: (state.filesByCollection[collectionId] || []).map((file) =>
          file.id === fileId
            ? {
                ...file,
                progress,
                status: status || (progress < 100 ? 'uploading' : file.status)
              }
            : file
        )
      }
    })),

  getFiles: (collectionId: string) => {
    const state = get();
    return state.filesByCollection[collectionId] || [];
  }
})); 