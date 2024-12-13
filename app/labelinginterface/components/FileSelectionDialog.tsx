'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/AuthContext"
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore'
import { getApp } from 'firebase/app'
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collection, Project } from "@/types/upload"
import { SelectableCollectionCard } from "./SelectableCollectionCard"
import { SelectableProjectContainer } from "./SelectableProjectContainer"

interface FileSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileSelect?: (fileType: string, fileId: string) => void
}

interface CollectionWithProject extends Omit<Collection, 'projectId'> {
  projectId?: string | null;
}

export function FileSelectionDialog({
  open,
  onOpenChange,
  onFileSelect
}: FileSelectionDialogProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collections, setCollections] = useState<CollectionWithProject[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!open || !user) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const app = getApp();
        const db = getFirestore(app);

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
        })) as CollectionWithProject[];

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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      }
    }

    fetchData();
  }, [open, user]);

  const handleFileSelect = async (type: string, id: string) => {
    console.log('FileSelectionDialog - Handling file selection:', { type, id });
    if (onFileSelect) {
      await onFileSelect(type, id);
    }
    onOpenChange(false);
  };

  // Get unassigned collections
  const unassignedCollections = collections.filter(c => !c.projectId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E1E1E] text-white max-w-7xl h-[80vh] p-0">
        <ScrollArea className="h-full">
          <div className="px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Select Files</DialogTitle>
              <DialogDescription className="text-gray-400">
                Choose files from your collections or projects to begin labeling
              </DialogDescription>
            </DialogHeader>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner />
                <span className="ml-2">Loading data...</span>
              </div>
            ) : error ? (
              <div className="text-red-500 p-8">
                Error: {error}
              </div>
            ) : (
              <div className="space-y-8 mt-6">
                {/* Projects section */}
                {projects.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Projects</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.map(project => (
                        <SelectableProjectContainer
                          key={project.id}
                          project={project}
                          collections={collections}
                          onFileSelect={handleFileSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Unassigned Collections section */}
                {unassignedCollections.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Unassigned Collections</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {unassignedCollections.map(collection => (
                        <SelectableCollectionCard
                          key={collection.id}
                          collection={collection}
                          onFileSelect={handleFileSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {collections.length === 0 && projects.length === 0 && (
                  <div className="text-center text-gray-400 p-8">
                    No collections or projects found
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 