import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Collection } from '@/types/upload';
import { Project } from '../types';
import { useAuth } from '@/lib/context/AuthContext';

export const useCollectionsAndProjects = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setCollections([]);
      setProjects([]);
      setLoading(false);
      return;
    }

    console.log('Setting up collections and projects subscriptions for user:', user.uid);

    // Subscribe to collections
    const collectionsQuery = query(
      collection(db, 'collections'),
      where('userId', '==', user.uid),
      where('deleted', 'in', [false, null]),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribeCollections = onSnapshot(collectionsQuery, (snapshot) => {
      // Use a Map to ensure unique collections by ID
      const collectionsMap = new Map();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log('Collection data:', { id: doc.id, deleted: data.deleted, projectId: data.projectId, ...data });
        
        // Only add if we haven't seen this ID before and it's not deleted
        if (!collectionsMap.has(doc.id) && data.deleted !== true) {
          collectionsMap.set(doc.id, {
            ...data,
            id: doc.id,
            files: {
              video: data.files?.video || [],
              audio: data.files?.audio || [],
              motion: data.files?.motion || [],
              aux1: data.files?.aux1 || [],
              aux2: data.files?.aux2 || [],
              aux3: data.files?.aux3 || [],
              aux4: data.files?.aux4 || [],
              aux5: data.files?.aux5 || []
            },
            progress: data.progress || {
              labeling: 'not-started',
              rating: 'not-started',
              validated: 'not-started'
            },
            projectId: data.projectId || null,
            deleted: false
          } as Collection);
        }
      });
      
      const collectionsData = Array.from(collectionsMap.values());
      console.log('Collections updated:', {
        total: snapshot.docs.length,
        active: collectionsData.length,
        deleted: snapshot.docs.length - collectionsData.length
      });
      setCollections(collectionsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching collections:', error);
      if (error.code === 'failed-precondition') {
        console.error('Missing index for collections. Please create the required index.');
      }
      setLoading(false);
    });

    // Subscribe to projects
    const projectsQuery = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid),
      where('deleted', '==', false),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsMap = new Map();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log('Project data:', { id: doc.id, ...data });
        
        if (!projectsMap.has(doc.id)) {
          projectsMap.set(doc.id, {
            ...data,
            id: doc.id,
            collections: data.collections || []
          } as Project);
        }
      });
      
      const projectsData = Array.from(projectsMap.values());
      console.log('Projects updated:', projectsData);
      setProjects(projectsData);
    }, (error) => {
      console.error('Error fetching projects:', error);
      if (error.code === 'failed-precondition') {
        console.error('Missing index for projects. Please create the required index for: userId, deleted, createdAt DESC');
      }
    });

    return () => {
      console.log('Cleaning up subscriptions');
      unsubscribeCollections();
      unsubscribeProjects();
    };
  }, [user]);

  return {
    collections,
    projects,
    loading
  };
}; 