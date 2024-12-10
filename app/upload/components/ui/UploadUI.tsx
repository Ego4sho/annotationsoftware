'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collection, Project } from '@/types/upload'
import { CollectionCard } from './CollectionCard'
import { CollectionDialog } from './CollectionDialog'
import { ProjectContainer } from './ProjectContainer'
import { AddProjectDialog } from './AddProjectDialog'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { CollectionCardSkeleton } from './CollectionCardSkeleton'

interface UploadUIProps {
  projects: Project[];
  collections: Collection[];
  loading: boolean;
  searchTerm: string;
  sortFilter: 'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress';
  deleteMode: boolean;
  isAddingProjectOpen: boolean;
  newProjectData: {
    title: string;
    description: string;
  };
  onSearchChange: (term: string) => void;
  onSortFilterChange: (filter: 'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress') => void;
  onDeleteCollection: (id: string, projectId?: string) => Promise<void>;
  onSaveCollection: (collection: Collection) => Promise<void>;
  onDeleteModeToggle: () => void;
  onDeleteProject: (id: string) => Promise<void>;
  onCreateProject: () => Promise<void>;
  onAddingProjectToggle: () => void;
  onNewProjectDataChange: (data: { title: string; description: string }) => void;
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void;
  onEditProject: (projectId: string, data: { title: string; name: string; description: string; createdAt: Timestamp }) => Promise<void>;
}

export const UploadUI: React.FC<UploadUIProps> = ({
  projects,
  collections,
  loading,
  searchTerm,
  sortFilter,
  deleteMode,
  isAddingProjectOpen,
  newProjectData,
  onSearchChange,
  onSortFilterChange,
  onDeleteCollection,
  onSaveCollection,
  onDeleteModeToggle,
  onDeleteProject,
  onCreateProject,
  onAddingProjectToggle,
  onNewProjectDataChange,
  onCollectionMove,
  onEditProject
}) => {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const handleDeleteCollection = async (collectionId: string, projectId?: string) => {
    console.log('Deleting collection:', { collectionId, projectId });
    try {
      await onDeleteCollection(collectionId, projectId);
      console.log('Collection deleted successfully');
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const handleEditCollection = (collection: Collection) => {
    console.log('Editing collection:', collection);
    setEditingCollection(collection);
    setIsCollectionDialogOpen(true);
  };

  const handleSaveCollection = async (updatedCollection: Collection) => {
    console.log('Saving collection:', updatedCollection);
    try {
      await onSaveCollection(updatedCollection);
      setIsCollectionDialogOpen(false);
      setEditingCollection(null);
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  const handleAddNewCollection = () => {
    setEditingCollection(null);
    setIsCollectionDialogOpen(true);
  };

  // Filter projects by search term
  const filteredProjects = projects.filter(project => 
    project && project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get all collection IDs that are in projects
  const collectionsInProjects = new Set(
    projects.flatMap(project => project.collections || [])
  );

  // Filter collections by search term and exclude those in projects
  const filteredCollections = collections.filter(collection =>
    // First check if collection exists and is not deleted
    collection && collection.id &&
    // Then check if it's not in any project
    !collectionsInProjects.has(collection.id) &&
    !collection.deleted &&  // Explicitly check for deleted flag
    // Then apply search filter
    (collection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort collections based on filter
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    if (!a || !b || !a.createdAt || !b.createdAt) return 0;
    
    switch (sortFilter) {
      case 'newest':
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      case 'oldest':
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      case 'completed':
        return Object.values(b.progress || {}).filter(status => status === 'completed').length -
               Object.values(a.progress || {}).filter(status => status === 'completed').length;
      case 'in-progress':
        return Object.values(b.progress || {}).filter(status => status === 'in-progress').length -
               Object.values(a.progress || {}).filter(status => status === 'in-progress').length;
      case 'not-started':
        return Object.values(b.progress || {}).filter(status => status === 'not-started').length -
               Object.values(a.progress || {}).filter(status => status === 'not-started').length;
      default:
        return 0;
    }
  });

  // Get collections for each project
  const getProjectCollections = (projectId: string) => {
    const projectCollectionIds = projects.find(p => p.id === projectId)?.collections || [];
    return collections.filter(collection => 
      collection && collection.id &&
      projectCollectionIds.includes(collection.id) &&
      !collection.deleted &&  // Explicitly check for deleted flag
      (collection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return (
    <div className="space-y-8">
      {/* Collections Section */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Collections</h2>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 bg-[#262626] border-[#404040] text-white placeholder-gray-400"
            />
            <Select value={sortFilter} onValueChange={onSortFilterChange}>
              <SelectTrigger className="w-40 bg-[#262626] border-[#404040] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#262626] border-[#404040]">
                <SelectItem value="newest" className="text-white">Newest First</SelectItem>
                <SelectItem value="oldest" className="text-white">Oldest First</SelectItem>
                <SelectItem value="completed" className="text-white">Completed</SelectItem>
                <SelectItem value="in-progress" className="text-white">In Progress</SelectItem>
                <SelectItem value="not-started" className="text-white">Not Started</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={onDeleteModeToggle}
              className={cn(
                "border-[#604abd] text-white",
                deleteMode && "bg-red-500 hover:bg-red-600 border-red-500"
              )}
            >
              {deleteMode ? "Exit Delete Mode" : "Delete Mode"}
            </Button>
            <Button
              onClick={handleAddNewCollection}
              className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white hover:from-[#7059c4] hover:to-[#de65f7]"
            >
              Add Collection
            </Button>
          </div>
        </div>

        {/* Collections Grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('bg-purple-500/10');
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove('bg-purple-500/10');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-purple-500/10');
            try {
              const data = JSON.parse(e.dataTransfer.getData('application/json'));
              if (data.collectionId && data.sourceProjectId) {
                onCollectionMove(data.collectionId, data.sourceProjectId, 'none');
              }
            } catch (error) {
              console.error('Error handling drop:', error);
            }
          }}
        >
          {loading ? (
            [...Array(8)].map((_, i) => (
              <CollectionCardSkeleton key={i} />
            ))
          ) : (
            sortedCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                deleteMode={deleteMode}
                onDelete={handleDeleteCollection}
                onEdit={handleEditCollection}
              />
            ))
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <Button
            onClick={onAddingProjectToggle}
            className="bg-[#604abd] hover:bg-[#4c3a9e] text-white"
          >
            Add Project
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectContainer
              key={project.id}
              project={project}
              collections={collections}
              deleteMode={deleteMode}
              onDelete={onDeleteProject}
              onEditCollection={handleEditCollection}
              onCollectionMove={onCollectionMove}
              onDeleteCollection={handleDeleteCollection}
              onEditProject={onEditProject}
            />
          ))}
        </div>
      </div>

      {/* Collection Dialog */}
      <CollectionDialog
        open={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
        onSave={handleSaveCollection}
        collection={editingCollection}
      />

      {/* Add Project Dialog */}
      <AddProjectDialog
        open={isAddingProjectOpen}
        onOpenChange={onAddingProjectToggle}
        projectData={newProjectData}
        onProjectDataChange={onNewProjectDataChange}
        onSubmit={onCreateProject}
      />
    </div>
  );
}; 