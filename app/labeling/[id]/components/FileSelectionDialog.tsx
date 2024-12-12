'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCollectionsAndProjects } from '@/app/upload/hooks/useCollectionsAndProjects';
import { useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

interface FileSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileSelectionDialog({ open, onOpenChange }: FileSelectionDialogProps) {
  const { collections, projects, loading, error } = useCollectionsAndProjects();

  useEffect(() => {
    // Monitor auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('FileSelectionDialog - Auth State Changed:', {
        isAuthenticated: !!user,
        email: user?.email
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('FileSelectionDialog - Raw Data:', {
      collections,
      projects
    });

    console.log('FileSelectionDialog - Data Processing:', {
      rawCollections: collections.length,
      filteredCollections: collections.filter(c => !c.deleted).length,
      sortedCollections: collections.filter(c => !c.deleted && !c.projectId).length,
      projects: projects.length
    });
  }, [collections, projects]);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Files</DialogTitle>
          </DialogHeader>
          <div className="p-4">Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Files</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-red-500">Error: {error}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Files</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Projects ({projects.length})</h3>
            {projects.map(project => (
              <div key={project.id} className="p-2 border rounded mb-2">
                {project.name}
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Collections ({collections.length})</h3>
            {collections.map(collection => (
              <div key={collection.id} className="p-2 border rounded mb-2">
                {collection.name}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 