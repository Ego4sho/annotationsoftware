'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProjectSelectionView } from "./components/ui/ProjectSelectionView";
import { CollectionSelectionView } from "./components/ui/CollectionSelectionView";
import { FileSelectionView } from "./components/ui/FileSelectionView";
import { useCollectionsAndProjects } from "@/app/upload/hooks/useCollectionsAndProjects";
import { Collection, Project } from "@/types/upload";

export default function LabelPage() {
  const router = useRouter();
  const { collections = [], projects = [], loading } = useCollectionsAndProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const projectCollections = collections.filter(c => c.projectId === selectedProjectId);
  const unassignedCollections = collections.filter(c => !c.projectId);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedCollectionId(null);
  };

  const handleUnassignedSelect = () => {
    setSelectedProjectId(null);
    setSelectedCollectionId(null);
  };

  const handleCollectionSelect = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
  };

  const handleBack = () => {
    if (selectedCollectionId) {
      setSelectedCollectionId(null);
    } else if (selectedProjectId) {
      setSelectedProjectId(null);
    }
  };

  const handleFileSelect = (fileType: string, fileId: string) => {
    router.push('/labelinginterface');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A1A]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#604abd]"></div>
      </div>
    );
  }

  return (
    <Dialog open={true}>
      <DialogContent 
        className="max-w-4xl bg-[#1A1A1A] border-[#604abd] p-6"
        aria-describedby="label-dialog-description"
      >
        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded">Test Label 3</div>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Label Files</DialogTitle>
          <DialogDescription id="label-dialog-description" className="text-gray-400">
            Select files from your projects and collections to begin labeling
          </DialogDescription>
        </DialogHeader>

        {selectedCollectionId ? (
          <FileSelectionView
            collection={collections.find(c => c.id === selectedCollectionId)!}
            onBack={handleBack}
            onFileSelect={handleFileSelect}
          />
        ) : selectedProjectId ? (
          <CollectionSelectionView
            collections={projectCollections}
            projectName={selectedProject?.name}
            onBack={handleBack}
            onCollectionSelect={handleCollectionSelect}
          />
        ) : (
          <ProjectSelectionView
            projects={projects}
            collections={collections}
            onProjectSelect={handleProjectSelect}
            onUnassignedSelect={handleUnassignedSelect}
          />
        )}
      </DialogContent>
    </Dialog>
  );
} 