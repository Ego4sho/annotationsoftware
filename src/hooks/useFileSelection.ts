import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface FileSelectionResult {
  fileId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fullFile: File;
}

export const useFileSelection = () => {
  const blobUrlsRef = useRef<string[]>([]);

  // Cleanup function to revoke blob URLs
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
          console.log('Revoked blob URL:', url);
        } catch (error) {
          console.error('Error revoking blob URL:', error);
        }
      });
    };
  }, []);

  const handleFileSelection = useCallback(async (file: File, fileType: string): Promise<FileSelectionResult> => {
    console.log('Processing file selection:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (fileType === 'audio' && !file.type.startsWith('audio/')) {
      throw new Error('Invalid audio file type');
    }

    // Create blob URL
    const fileUrl = URL.createObjectURL(file);
    blobUrlsRef.current.push(fileUrl);
    console.log('Created blob URL:', fileUrl);

    // Test if the blob URL is accessible
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to access blob URL');
      }
      const blob = await response.blob();
      console.log('Successfully accessed blob:', {
        size: blob.size,
        type: blob.type
      });
    } catch (error) {
      console.error('Error accessing blob URL:', error);
      URL.revokeObjectURL(fileUrl);
      blobUrlsRef.current = blobUrlsRef.current.filter(url => url !== fileUrl);
      throw error;
    }

    return {
      fileId: uuidv4(),
      fileName: file.name,
      fileType,
      fileUrl,
      fullFile: file
    };
  }, []);

  return { handleFileSelection };
}; 