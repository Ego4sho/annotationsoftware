import { useState, useEffect } from 'react';
import { Collection } from '@/types/upload';
import { Project } from '../types';
import { useToast } from "@/components/ui/use-toast";
import { CollectionDialog } from './ui/CollectionDialog';
import { StatusCard } from './ui/StatusCard';
import { ProjectCard } from './ui/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { collectionService } from '@/lib/services/collectionService';
import { useAuth } from '@/lib/context/AuthContext';

interface DashboardUIProps {
  initialCollections: Collection[];
  initialProjects: Project[];
  isCollectionDialogOpen: boolean;
  setIsCollectionDialogOpen: (open: boolean) => void;
  editingCollection: Collection | null;
  setEditingCollection: (collection: Collection | null) => void;
  onAddNewCollection: () => void;
  onEditProject: (id: string, data: { title: string; description: string; createdDate: any }) => void;
}

export const DashboardUI = ({
  initialCollections,
  initialProjects,
  isCollectionDialogOpen,
  setIsCollectionDialogOpen,
  editingCollection,
  setEditingCollection,
  onAddNewCollection,
  onEditProject
}: DashboardUIProps) => {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [deleteMode, setDeleteMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortFilter, setSortFilter] = useState<'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress'>('newest');

  const { toast } = useToast();
  const { user } = useAuth();

  // Update local state when initial data changes
  useEffect(() => {
    setCollections(initialCollections);
  }, [initialCollections]);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleCreateCollection = async (newCollection: Collection) => {
    try {
      const savedCollection = await collectionService.createCollection({
        ...newCollection,
        userId: user?.uid || ''
      });
      setCollections(prev => [savedCollection, ...prev]);
      setIsCollectionDialogOpen(false);
      toast({
        title: "Success",
        description: "Collection created successfully",
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive"
      });
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setIsCollectionDialogOpen(true);
  };

  const handleSaveCollection = async (updatedCollection: Collection) => {
    try {
      if (editingCollection) {
        const savedCollection = await collectionService.updateCollection(updatedCollection);
        setCollections(prev => prev.map(c => 
          c.id === savedCollection.id ? savedCollection : c
        ));
        
        setProjects(prev => prev.map(project => ({
          ...project,
          collections: project.collections?.map(c => 
            c.id === savedCollection.id ? savedCollection : c
          ) || []
        })));
      } else {
        await handleCreateCollection(updatedCollection);
      }
      setEditingCollection(null);
      setIsCollectionDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Collection updated successfully",
      });
    } catch (error) {
      console.error('Error saving collection:', error);
      toast({
        title: "Error",
        description: "Failed to save collection",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await collectionService.deleteCollection(id);
      setCollections(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive"
      });
    }
  };

  // Filter and sort collections
  const filteredCollections = collections
    .filter(collection => 
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (collection.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortFilter) {
        case 'newest':
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        case 'oldest':
          return a.createdAt.toMillis() - b.createdAt.toMillis();
        case 'completed':
          return (b.status === 'ready' ? 1 : 0) - (a.status === 'ready' ? 1 : 0);
        case 'not-started':
          return (b.status === 'incomplete' ? 1 : 0) - (a.status === 'incomplete' ? 1 : 0);
        case 'in-progress':
          return (b.status === 'processing' ? 1 : 0) - (a.status === 'processing' ? 1 : 0);
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={sortFilter} onValueChange={(value: any) => setSortFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={deleteMode ? "destructive" : "outline"}
            onClick={() => setDeleteMode(!deleteMode)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleteMode ? "Cancel Delete" : "Delete Mode"}
          </Button>
          <Button onClick={onAddNewCollection}>
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollections.map((collection) => (
          <StatusCard
            key={collection.id}
            collection={collection}
            deleteMode={deleteMode}
            onEdit={() => handleEditCollection(collection)}
            onDelete={() => handleDeleteCollection(collection.id)}
          />
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Projects</h2>
          <Button onClick={() => setIsCollectionDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              deleteMode={deleteMode}
              onDelete={() => {
                setProjects(prev => prev.filter(p => p.id !== project.id));
                toast({
                  title: "Success",
                  description: "Project deleted successfully",
                });
              }}
            />
          ))}
        </div>
      </div>

      <CollectionDialog
        isOpen={isCollectionDialogOpen}
        onClose={() => setIsCollectionDialogOpen(false)}
        collection={editingCollection}
        onSave={handleSaveCollection}
      />
    </div>
  );
}; 