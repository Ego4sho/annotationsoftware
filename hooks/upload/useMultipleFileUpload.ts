import { useState, useCallback } from 'react';
import { FileType, ProjectFile, UploadFile, UploadProgress, UploadError } from '@/types/upload';
import { UploadService } from '@/lib/services/uploadService';
import { v4 as uuidv4 } from 'uuid';

interface FileProgress {
  [fileId: string]: number;
}

interface FileErrors {
  [fileId: string]: string;
}

interface UseMultipleFileUploadReturn {
  uploadFiles: (files: File[], type: FileType, projectId: string) => Promise<ProjectFile[]>;
  progress: FileProgress;
  errors: FileErrors;
  isUploading: boolean;
  reset: () => void;
}

export const useMultipleFileUpload = (): UseMultipleFileUploadReturn => {
  const [progress, setProgress] = useState<FileProgress>({});
  const [errors, setErrors] = useState<FileErrors>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const reset = useCallback(() => {
    setProgress({});
    setErrors({});
    setIsUploading(false);
  }, []);

  const uploadFiles = useCallback(async (
    files: File[],
    type: FileType,
    projectId: string
  ): Promise<ProjectFile[]> => {
    try {
      setIsUploading(true);
      setErrors({});
      setProgress({});

      const uploadFiles: UploadFile[] = files.map(file => ({
        id: uuidv4(),
        file,
        type,
        progress: 0,
        status: 'pending'
      }));

      const handleProgress = (progress: UploadProgress) => {
        setProgress(prev => ({
          ...prev,
          [progress.fileId]: progress.progress
        }));
      };

      const handleError = (error: UploadError) => {
        setErrors(prev => ({
          ...prev,
          [error.fileId]: error.error
        }));
      };

      const projectFiles = await UploadService.uploadMultipleFiles(
        uploadFiles,
        projectId,
        handleProgress,
        handleError
      );

      return projectFiles;
    } catch (error) {
      const err = error as Error;
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadFiles,
    progress,
    errors,
    isUploading,
    reset
  };
}; 