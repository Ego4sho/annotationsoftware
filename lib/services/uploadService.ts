import { storage, db } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Project, Collection, ProjectFile, FileType } from '@/types/upload';

export const UploadService = {
  async createProject(name: string, description: string, userId: string): Promise<Project> {
    const projectId = uuidv4();
    const project: Project = {
      id: projectId,
      userId,
      name,
      description,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'incomplete',
      fileCount: {
        video: 0,
        audio: 0,
        motion: 0
      },
      totalSize: 0
    };

    await setDoc(doc(db, 'projects', projectId), project);
    return project;
  },

  async uploadFile(
    file: File,
    type: FileType,
    projectId: string,
    userId: string,
    onProgress: (progress: number) => void,
    onError: (error: string) => void
  ): Promise<ProjectFile> {
    try {
      const fileId = uuidv4();
      const fileRef = ref(storage, `users/${userId}/projects/${projectId}/${type}/${fileId}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            onError(error.message);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const projectFile: ProjectFile = {
                id: fileId,
                projectId,
                userId,
                type,
                fileName: file.name,
                originalName: file.name,
                fileUrl: downloadURL,
                size: file.size,
                uploadedAt: Timestamp.now(),
                status: 'processing',
              };

              await setDoc(doc(db, 'projects', projectId, 'files', fileId), projectFile);
              resolve(projectFile);
            } catch (error) {
              console.error('Error getting download URL:', error);
              onError('Failed to get download URL');
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Upload error:', error);
      onError('Failed to start upload');
      throw error;
    }
  }
}; 