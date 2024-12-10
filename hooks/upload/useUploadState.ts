import { create } from 'zustand';
import { UploadFile } from '@/types/upload';

interface UploadState {
  files: UploadFile[];
  addFile: (file: UploadFile) => void;
  updateFile: (fileId: string, updates: Partial<UploadFile>) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  updateFileProgress: (fileId: string, progress: number, status?: UploadFile['status']) => void;
}

export const useUploadState = create<UploadState>()((set) => ({
  files: [],
  
  addFile: (file: UploadFile) => 
    set((state) => ({
      files: [...state.files, file]
    })),
  
  updateFile: (fileId: string, updates: Partial<UploadFile>) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === fileId ? { ...file, ...updates } : file
      )
    })),
  
  removeFile: (fileId: string) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== fileId)
    })),
  
  clearFiles: () => set({ files: [] }),

  updateFileProgress: (fileId: string, progress: number, status?: UploadFile['status']) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress,
              status: status || (progress < 100 ? 'uploading' : file.status)
            }
          : file
      )
    }))
})); 