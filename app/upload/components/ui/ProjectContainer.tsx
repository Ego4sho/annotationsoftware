import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, ChevronRight, Pencil } from 'lucide-react'
import { Project, Collection } from '@/types/upload'
import { CollectionCard } from './CollectionCard'
import { ProjectProgressBar } from './ProjectProgressBar'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Timestamp } from 'firebase/firestore'
import { cn } from '@/lib/utils'
import { Card } from "@/components/ui/card"

interface ProjectContainerProps {
  project: Project
  collections: Collection[]
  deleteMode: boolean
  onDelete: (id: string) => void
  onEditCollection: (collection: Collection) => void
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void
  onDeleteCollection: (id: string, projectId: string) => void
  onEditProject: (id: string, data: { title: string; name: string; description: string; createdAt: Timestamp }) => void
  showFileSelectionButtons?: boolean
  onFileSelect?: (fileType: string, fileId: string) => void
}

export function ProjectContainer({
  project,
  collections,
  deleteMode,
  onDelete,
  onEditCollection,
  onCollectionMove,
  onDeleteCollection,
  onEditProject,
  showFileSelectionButtons = false,
  onFileSelect
}: ProjectContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editData, setEditData] = useState({
    title: project.name,
    description: project.description
  })

  const projectCollections = collections.filter(c => c.projectId === project.id)
  const filteredCollections = projectCollections.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDragOver = (e: React.DragOver<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.collectionId && data.sourceProjectId) {
        onCollectionMove(data.collectionId, data.sourceProjectId, project.id)
      }
    } catch (error) {
      console.error('Error handling drop:', error)
    }
  }

  const handleEditSubmit = () => {
    onEditProject(project.id, {
      title: editData.title,
      name: editData.title,
      description: editData.description,
      createdAt: project.createdAt
    })
    setIsEditDialogOpen(false)
  }

  // Calculate progress counts
  const getProgressCounts = (category: 'labeling' | 'rating' | 'validated') => {
    return projectCollections.filter(c => c.progress[category] === 'completed').length
  }

  const labelingCount = getProgressCounts('labeling')
  const ratingCount = getProgressCounts('rating')
  const validatedCount = getProgressCounts('validated')

  return (
    <div className={cn(
      "group relative transition-all duration-300",
      isExpanded && "row-span-2 z-10"
    )}>
      <Card 
        className={cn(
          "bg-[#262626] border-[#604abd] cursor-pointer hover:bg-[#303030] relative transition-all duration-300 h-full",
          isDragOver && "border-purple-500 bg-purple-500/10",
          deleteMode && "border-red-500 hover:border-red-600",
          isExpanded && "!h-auto"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] px-1 rounded">Upload Page Project Container</div>
        <div className="p-2">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-white">{project.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-1">{project.description}</p>
              <p className="text-[10px] text-gray-500">
                Created: {format(project.createdAt.toDate(), 'MMM d, yyyy')}
              </p>
            </div>
            {!showFileSelectionButtons && (
              <div className="flex gap-1">
                {deleteMode ? (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(project.id)}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditDialogOpen(true);
                      }}
                      className="h-6 w-6 border-[#604abd] text-white hover:bg-[#604abd]/20"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                      }}
                      className={cn(
                        "h-6 w-6 border-[#604abd] text-white hover:bg-[#604abd]/20 transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-2 space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Labeling</span>
              </div>
              <ProjectProgressBar collections={projectCollections} category="labeling" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Rating</span>
              </div>
              <ProjectProgressBar collections={projectCollections} category="rating" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Validated</span>
              </div>
              <ProjectProgressBar collections={projectCollections} category="validated" />
            </div>
          </div>
        </div>

        <div 
          className={cn(
            "border-t border-[#404040] overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="p-2 space-y-2">
            <div className="flex items-center gap-1">
              <Search className="w-3 h-3 text-gray-400" />
              <Input
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 h-6 text-xs bg-[#1A1A1A] border-[#404040] text-white placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  deleteMode={deleteMode}
                  onDelete={(id) => onDeleteCollection(id, project.id)}
                  onEdit={onEditCollection}
                  showFileSelectionButtons={showFileSelectionButtons}
                  onFileSelect={onFileSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent 
          className="bg-[#1E1E1E] text-white"
          aria-describedby="edit-project-description"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Edit Project</DialogTitle>
            <DialogDescription id="edit-project-description" className="text-gray-400">
              Update the project details below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-[#262626] border-[#404040] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#262626] border-[#404040] text-white min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              onClick={handleEditSubmit}
              className="w-full bg-[#604abd] hover:bg-[#4c3a9e] text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 