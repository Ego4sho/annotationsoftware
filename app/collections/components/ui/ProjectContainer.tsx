import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, ChevronRight } from 'lucide-react'
import { Project, Collection } from '../../types'
import { CollectionCard } from './CollectionCard'
import { ProjectProgressBar } from './ProjectProgressBar'
import { getProgressCounts } from '../../utils/progress'

interface ProjectContainerProps {
  project: Project
  deleteMode: boolean
  onDelete: (id: string) => void
  onEditCollection: (collection: Collection) => void
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void
  onDeleteCollection: (id: string, projectId: string) => void
}

export const ProjectContainer: React.FC<ProjectContainerProps> = ({
  project,
  deleteMode,
  onDelete,
  onEditCollection,
  onCollectionMove,
  onDeleteCollection
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCollections = project.collections?.filter(collection =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    try {
      const { id: collectionId, sourceProjectId } = JSON.parse(
        e.dataTransfer.getData('application/json')
      )

      if (sourceProjectId !== project.id) {
        onCollectionMove(collectionId, sourceProjectId, project.id)
      }
    } catch (error) {
      console.error('Drop handling error:', error)
    }
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-col w-full p-4 bg-[#262626] rounded-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center flex-1"
          >
            <ChevronRight 
              className={`h-5 w-5 transform transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
            <div className="ml-2">
              <h3 className="text-lg font-medium text-[#E5E7EB]">{project.title}</h3>
              <p className="text-sm text-gray-400">{project.description}</p>
            </div>
          </button>

          {deleteMode && (
            <Button
              className="p-1 rounded-full bg-red-500 hover:bg-red-600"
              onClick={() => onDelete(project.id)}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {(['labeling', 'rating', 'validated'] as const).map(category => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span className="capitalize">{category}</span>
                <span>{getProgressCounts(project.collections, category)}</span>
              </div>
              <ProjectProgressBar 
                collections={project.collections} 
                category={category} 
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div
              className={`
                space-y-4
                p-4 
                rounded-lg 
                transition-colors
                ${dragOver 
                  ? 'bg-white/20 border-2 border-dashed border-[#604abd]' 
                  : 'bg-white/10 border-2 border-dashed border-transparent'
                }
              `}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search collections in this project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 pl-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {filteredCollections?.map(collection => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    deleteMode={deleteMode}
                    onDelete={(id) => onDeleteCollection(id, project.id)}
                    onEdit={() => onEditCollection(collection)}
                    inProject={true}
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
    </div>
  )
} 