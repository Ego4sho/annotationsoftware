import { useState, useCallback } from 'react';
import { FileType, ProjectFile } from '@/types/upload';
import { UploadService } from '@/lib/services/uploadService';
import { useAuth } from '@/lib/context/AuthContext';

interface UseFileUploadReturn {
  uploadFile: (file: File, type: FileType, projectId: string) => Promise<ProjectFile>;
  progress: number;
  error: string | null;
  isUploading: boolean;
  reset: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { user } = useAuth();

  const reset = useCallback(() => {
    setProgress(0);
    setError(null);
    setIsUploading(false);
  }, []);

  const uploadFile = useCallback(async (
    file: File,
    type: FileType,
    projectId: string
  ): Promise<ProjectFile> => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      const projectFile = await UploadService.uploadFile(
        file,
        type,
        projectId,
        user.uid,
        (uploadProgress: number) => setProgress(uploadProgress),
        (uploadError: string) => setError(uploadError)
      );

      return projectFile;
    } catch (error) {
      const err = error as Error;
      setError(err.message);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  return {
    uploadFile,
    progress,
    error,
    isUploading,
    reset
  };
}; 