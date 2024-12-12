import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { Collection, Project } from '@/types';

export function useCollectionsAndProjects() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useCollectionsAndProjects hook initialized');
    const user = auth.currentUser;
    console.log('Current user:', user?.email);

    if (!user) {
      console.log('No authenticated user found');
      setLoading(false);
      setError('User not authenticated');
      return;
    }

    try {
      console.log('Setting up Firebase listeners...');

      // Collections listener
      const collectionsQuery = query(
        collection(db, 'collections'),
        where('userId', '==', user.uid)
      );

      console.log('Collections query created:', {
        path: collectionsQuery.path,
        filters: collectionsQuery.filters
      });

      const unsubCollections = onSnapshot(collectionsQuery, 
        (snapshot) => {
          console.log('Collections snapshot received:', {
            size: snapshot.size,
            empty: snapshot.empty
          });

          const collectionsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Collection[];

          console.log('Processed collections:', {
            count: collectionsData.length,
            sample: collectionsData.length > 0 ? collectionsData[0].id : 'none'
          });

          setCollections(collectionsData);
        },
        (error) => {
          console.error('Collections listener error:', error);
          setError(error.message);
        }
      );

      // Projects listener
      const projectsQuery = query(
        collection(db, 'projects'),
        where('userId', '==', user.uid)
      );

      console.log('Projects query created:', {
        path: projectsQuery.path,
        filters: projectsQuery.filters
      });

      const unsubProjects = onSnapshot(projectsQuery,
        (snapshot) => {
          console.log('Projects snapshot received:', {
            size: snapshot.size,
            empty: snapshot.empty
          });

          const projectsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Project[];

          console.log('Processed projects:', {
            count: projectsData.length,
            sample: projectsData.length > 0 ? projectsData[0].id : 'none'
          });

          setProjects(projectsData);
        },
        (error) => {
          console.error('Projects listener error:', error);
          setError(error.message);
        }
      );

      setLoading(false);

      return () => {
        console.log('Cleaning up Firebase listeners');
        unsubCollections();
        unsubProjects();
      };
    } catch (err) {
      console.error('Error in useCollectionsAndProjects:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setLoading(false);
    }
  }, []);

  return { collections, projects, loading, error };
} 