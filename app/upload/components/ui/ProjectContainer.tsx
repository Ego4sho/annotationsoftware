import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, ChevronRight, Pencil } from 'lucide-react'
import { Project, Collection } from '@/types/upload'
import { CollectionCard } from './CollectionCard'
import { ProjectProgressBar } from './ProjectProgressBar'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Timestamp } from 'firebase/firestore'
import { getProgressCounts } from '../../utils/progress'
import { cn } from '@/lib/utils'

interface ProjectContainerProps {
  project: Project
  collections: Collection[]
  deleteMode: boolean
  onDelete: (id: string) => void
  onEditCollection: (collection: Collection) => void
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void
  onDeleteCollection: (id: string, projectId: string) => void
  onEditProject: (id: string, data: { title: string; name: string; description: string; createdAt: Timestamp }) => void
}

interface ProjectEditData {
  name: string;
  description: string;
}

export const ProjectContainer: React.FC<ProjectContainerProps> = ({
  project,
  collections,
  deleteMode,
  onDelete,
  onEditCollection,
  onCollectionMove,
  onDeleteCollection,
  onEditProject
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editData, setEditData] = useState<ProjectEditData>(() => ({
    name: project.name,
    description: project.description || ''
  }))

  useEffect(() => {
    setEditData({
      name: project.name,
      description: project.description || ''
    });
  }, [project]);

  // Get the actual collection objects from the IDs
  const projectCollections = (project.collections || [])
    .map(id => collections.find(c => c.id === id && !c.deleted))
    .filter((c): c is Collection => c !== undefined && !c.deleted)

  const filteredCollections = projectCollections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (collection.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.type === 'collection') {
        onCollectionMove(data.id, null, project.id)
      }
    } catch (error) {
      console.error('Drop handling error:', error)
    }
  }

  const handleEditSave = () => {
    const updatedData = {
      title: editData.name.trim(),
      name: editData.name.trim(),
      description: editData.description.trim(),
      createdAt: project.createdAt
    };
    onEditProject(project.id, updatedData);
    setIsEditDialogOpen(false);
  };

  const handleDeleteCollection = (collectionId: string) => {
    console.log('Deleting collection from project:', { collectionId, projectId: project.id });
    onDeleteCollection(collectionId, project.id);
  };

  return (
    <div 
      className="w-full space-y-2"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn(
        "flex flex-col w-full p-3 bg-[#262626] rounded-lg transition-colors",
        dragOver && "border-2 border-dashed border-[#604abd] bg-white/20"
      )}>
        <div className="flex items-start justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
          >
            <ChevronRight 
              className={`h-4 w-4 text-white transform transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </button>

          <div className="flex-1 text-center -ml-6">
            <h3 className="text-[#E5E7EB] font-bold text-lg truncate">
              {project.name}
            </h3>
          </div>

          <div className="flex gap-2">
            <Button
              className="p-1 rounded-full bg-transparent hover:bg-white/10"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4 text-white" />
            </Button>
            {deleteMode && (
              <Button
                className="p-1 rounded-full bg-red-500 hover:bg-red-600"
                onClick={() => onDelete(project.id)}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
        </div>

        {project.description && (
          <div className="mt-2 mb-1">
            <p className="text-gray-400 text-[10px] text-center whitespace-pre-wrap break-words">
              {project.description}
            </p>
          </div>
        )}

        <p className="text-gray-400 text-[9px] text-center mb-2">
          {format(project.createdAt.toDate(), 'MMM d, yyyy')}
        </p>

        <div className="space-y-[2px]">
          {(['labeling', 'rating', 'validated'] as const).map(category => {
            const progress = getProgressCounts(projectCollections, category);
            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-gray-400 capitalize text-[9px]">{category}</span>
                  <span className="text-gray-400 text-[9px]">
                    {progress.notStarted}/{progress.total} Not Started
                    {progress.inProgress > 0 && ` • ${progress.inProgress}/${progress.total} In Progress`}
                    {progress.completed > 0 && ` • ${progress.completed}/${progress.total} Completed`}
                  </span>
                </div>
                <div className="h-1">
                  <ProjectProgressBar 
                    collections={projectCollections} 
                    category={category} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence initial={false} mode="sync">
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={cn(
              "space-y-4 p-4 rounded-lg bg-[#262626]",
              dragOver && "border-2 border-dashed border-[#604abd] bg-white/20"
            )}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search collections"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 pl-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                {filteredCollections.map(collection => (
                  <CollectionCard
                    key={`project-${project.id}-collection-${collection.id}`}
                    collection={collection}
                    deleteMode={deleteMode}
                    onDelete={handleDeleteCollection}
                    onEdit={onEditCollection}
                  />
                ))}
              </div>

              {(!filteredCollections || filteredCollections.length === 0) && (
                <div className="text-center py-8 text-gray-400">
                  {searchTerm 
                    ? 'No collections found matching your search'
                    : 'Drag and drop collection cards here'}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border border-[#604abd]">
          <DialogHeader>
            <DialogTitle className="text-[#E5E7EB]">Edit Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#E5E7EB]">Title</Label>
              <Input
                id="title"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#E5E7EB]">Description</Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white hover:from-[#7059c4] hover:to-[#de65f7]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 