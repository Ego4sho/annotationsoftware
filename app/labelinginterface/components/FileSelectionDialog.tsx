import { Dialog, DialogContent, DialogPortal, DialogOverlay, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { Collection, Project } from "@/types/upload"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CollectionCard } from "@/app/upload/components/ui/CollectionCard"
import { ProjectContainer } from "@/app/upload/components/ui/ProjectContainer"

interface FileSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: Project[]
  collections: Collection[]
  onFileSelect: (fileType: string, fileId: string) => void
}

export function FileSelectionDialog({
  open,
  onOpenChange,
  projects = [],
  collections = [],
  onFileSelect
}: FileSelectionDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortFilter, setSortFilter] = useState<'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress'>('newest')

  useEffect(() => {
    if (open) {
      console.log('FileSelectionDialog - Raw Data:', {
        projects: projects.map(p => ({
          id: p.id,
          name: p.name,
          userId: p.userId,
          collectionsCount: p.collections?.length || 0
        })),
        collections: collections.map(c => ({
          id: c.id,
          name: c.name,
          userId: c.userId,
          projectId: c.projectId,
          fileTypes: c.files ? Object.keys(c.files).filter(key => c.files[key as keyof typeof c.files]?.length > 0) : []
        }))
      });
    }
  }, [open, projects, collections]);

  // Filter collections by search term
  const filteredCollections = collections?.filter(collection =>
    collection && collection.id &&
    !collection.deleted &&
    (collection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

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

  useEffect(() => {
    if (open) {
      console.log('FileSelectionDialog - Data Processing:', {
        rawCollections: collections.length,
        filteredCollections: filteredCollections.length,
        sortedCollections: sortedCollections.length,
        projects: projects.length
      });
    }
  }, [open, collections, filteredCollections, sortedCollections, projects]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent 
          className="fixed left-[50%] top-[50%] z-50 w-[90vw] max-w-7xl h-[80vh] translate-x-[-50%] translate-y-[-50%] overflow-y-auto bg-[#1E1E1E] text-white rounded-lg border border-[#404040] p-6"
          aria-describedby="file-selection-description"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Select Files</DialogTitle>
            <DialogDescription id="file-selection-description" className="text-gray-400">
              Choose files from your collections or projects to begin labeling
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 mt-6">
            {/* Collections Section */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Collections</h2>
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-[#262626] border-[#404040] text-white placeholder-gray-400"
                  />
                  <Select value={sortFilter} onValueChange={(value: typeof sortFilter) => setSortFilter(value)}>
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
                </div>
              </div>

              {/* Collections Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedCollections.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400">
                    No collections found
                  </div>
                ) : (
                  sortedCollections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                      deleteMode={false}
                      onDelete={() => {}}
                      onEdit={() => {}}
                      showFileSelectionButtons={true}
                      onFileSelect={onFileSelect}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Projects Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Projects</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400">
                    No projects found
                  </div>
                ) : (
                  projects.map((project) => (
                    <ProjectContainer
                      key={project.id}
                      project={project}
                      collections={collections}
                      deleteMode={false}
                      onDelete={() => {}}
                      onEditCollection={() => {}}
                      onCollectionMove={() => {}}
                      onDeleteCollection={() => {}}
                      onEditProject={() => {}}
                      showFileSelectionButtons={true}
                      onFileSelect={onFileSelect}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
} 