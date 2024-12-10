import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProjectFile } from '@/types/upload';

interface UseProjectFilesReturn {
  files: ProjectFile[];
  loading: boolean;
  error: string | null;
}

export const useProjectFiles = (projectId: string): UseProjectFilesReturn => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError('Project ID is required');
      setLoading(false);
      return;
    }

    const filesRef = collection(db, 'projects', projectId, 'files');
    const filesQuery = query(
      filesRef,
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      filesQuery,
      (snapshot) => {
        const projectFiles: ProjectFile[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          projectFiles.push({
            ...data,
            id: doc.id,
            uploadedAt: data.uploadedAt
          } as ProjectFile);
        });
        setFiles(projectFiles);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  return {
    files,
    loading,
    error
  };
}; 