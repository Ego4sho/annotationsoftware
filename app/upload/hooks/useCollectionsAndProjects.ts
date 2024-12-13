import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { Collection, Project } from '@/types';
import { onAuthStateChanged } from 'firebase/auth';

export function useCollectionsAndProjects() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useCollectionsAndProjects hook initialized');
    let unsubAuth: (() => void) | undefined;
    let unsubCollections: (() => void) | undefined;
    let unsubProjects: (() => void) | undefined;

    try {
      unsubAuth = onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', {
          isAuthenticated: !!user,
          email: user?.email,
          uid: user?.uid
        });

        if (!user) {
          console.log('No authenticated user found');
          setLoading(false);
          setError('User not authenticated');
          return;
        }

        console.log('Setting up Firebase listeners...');
        setLoading(true);

        // Collections listener
        const collectionsQuery = query(
          collection(db, 'collections'),
          where('userId', '==', user.uid)
        );

        console.log('Collections query created:', {
          path: collectionsQuery.path,
          filters: collectionsQuery.filters
        });

        unsubCollections = onSnapshot(collectionsQuery, 
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
              sample: collectionsData.length > 0 ? {
                id: collectionsData[0].id,
                name: collectionsData[0].name,
                files: collectionsData[0].files
              } : 'none'
            });

            setCollections(collectionsData);
            setLoading(false);
          },
          (error) => {
            console.error('Collections listener error:', error);
            setError(error.message);
            setLoading(false);
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

        unsubProjects = onSnapshot(projectsQuery,
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
              sample: projectsData.length > 0 ? {
                id: projectsData[0].id,
                name: projectsData[0].name
              } : 'none'
            });

            setProjects(projectsData);
            setLoading(false);
          },
          (error) => {
            console.error('Projects listener error:', error);
            setError(error.message);
            setLoading(false);
          }
        );
      });
    } catch (err) {
      console.error('Error in useCollectionsAndProjects:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setLoading(false);
    }

    return () => {
      console.log('Cleaning up Firebase listeners');
      unsubAuth?.();
      unsubCollections?.();
      unsubProjects?.();
    };
  }, []);

  return { collections, projects, loading, error };
} 