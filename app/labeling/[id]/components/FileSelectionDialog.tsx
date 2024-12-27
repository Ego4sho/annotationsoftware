'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCollectionsAndProjects } from '@/app/upload/hooks/useCollectionsAndProjects';
import { useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Collection, Project } from '@/types/upload';
import { SelectableCollectionCard } from '@/app/labelinginterface/components/SelectableCollectionCard';
import { SelectableProjectContainer } from '@/app/labelinginterface/components/SelectableProjectContainer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect?: (fileType: string, fileId: string) => void;
  projects: Project[];
  collections: Collection[];
}

export function FileSelectionDialog({ 
  open, 
  onOpenChange, 
  onFileSelect,
  projects,
  collections 
}: FileSelectionDialogProps) {
  const handleFileSelect = (type: string, id: string) => {
    console.log('FileSelectionDialog (Test Label 2) - Handling file selection:', { type, id });
    if (onFileSelect) {
      onFileSelect(type, id);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="bg-[#1E1E1E] text-white max-w-7xl h-[80vh] p-0" data-portal-root="file-selection">
        <ScrollArea className="h-full">
          <div className="px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Select Files</DialogTitle>
            </DialogHeader>

            <div className="space-y-8 mt-6">
              {/* Projects section */}
              {projects.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Projects</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map(project => (
                      <SelectableProjectContainer
                        key={`project-${project.id}`}
                        project={project}
                        collections={collections}
                        onFileSelect={handleFileSelect}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Collections section */}
              {collections.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Collections</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {collections.map(collection => (
                      <SelectableCollectionCard
                        key={`collection-${collection.id}`}
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 