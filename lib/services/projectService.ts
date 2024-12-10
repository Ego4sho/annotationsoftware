import { db } from '@/lib/firebase';
import { Project } from '@/types/upload';
import { addDoc, updateDoc, doc, getDocs, query, where, Timestamp, collection as firestoreCollection } from 'firebase/firestore';

const PROJECTS_COLLECTION = 'projects';

interface CreateProjectData {
  name: string;
  description: string;
  userId: string;
  createdAt?: Timestamp;
}

export const projectService = {
  async createProject(data: CreateProjectData) {
    try {
      const now = Timestamp.now();
      const projectData = {
        name: data.name,
        description: data.description,
        userId: data.userId,
        createdAt: now,
        updatedAt: now,
        collections: [],
        deleted: false,
        status: 'incomplete' as const
      };

      const projectRef = await addDoc(firestoreCollection(db, PROJECTS_COLLECTION), projectData);
      console.log('Project created with ID:', projectRef.id);
      
      return { ...projectData, id: projectRef.id } as Project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async updateProject(project: Project) {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, project.id);
      
      const updateData = {
        name: project.name,
        description: project.description,
        updatedAt: Timestamp.now(),
        collections: project.collections || [],
        deleted: project.deleted || false,
        status: project.status
      };

      console.log('Updating project with data:', updateData);
      await updateDoc(docRef, updateData);
      console.log('Project updated:', project.id);
      
      return {
        ...project,
        ...updateData
      } as Project;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async deleteProject(projectId: string) {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, projectId);
      await updateDoc(docRef, {
        deleted: true,
        updatedAt: Timestamp.now()
      });
      console.log('Project deleted:', projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}; 