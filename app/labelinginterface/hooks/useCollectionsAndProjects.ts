import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Collection, Project } from '@/types/upload';

export function useCollectionsAndProjects() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        // Fetch collections
        const collectionsRef = collection(db, 'collections');
        const collectionsQuery = query(
          collectionsRef,
          where('userId', '==', user.uid),
          where('deleted', '==', false)
        );
        const collectionsSnapshot = await getDocs(collectionsQuery);
        const collectionsData = collectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Collection[];
        setCollections(collectionsData);

        // Fetch projects
        const projectsRef = collection(db, 'projects');
        const projectsQuery = query(
          projectsRef,
          where('userId', '==', user.uid),
          where('deleted', '==', false)
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [user]);

  return { collections, projects };
} 