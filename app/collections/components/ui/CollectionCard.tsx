import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { format } from 'date-fns'
import { Collection } from '../../types'
import { ProgressBar } from './ProgressBar'

interface CollectionCardProps {
  collection: Collection
  deleteMode: boolean
  onDelete: (id: string, projectId?: string) => void
  onEdit: (collection: Collection) => void
  inProject?: boolean
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  deleteMode,
  onDelete,
  onEdit,
  inProject = false
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      ...collection,
      sourceProjectId: inProject ? collection.currentProjectId : null
    }))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Card
      draggable={true}
      onDragStart={handleDragStart}
      onClick={() => onEdit(collection)}
      className="bg-[#262626] border-[#604abd] p-4 cursor-pointer hover:bg-[#303030] relative"
    >
      {deleteMode && (
        <Button
          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 z-10"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(collection.id, collection.currentProjectId)
          }}
        >
          <X className="h-4 w-4 text-white" />
        </Button>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-[#E5E7EB] font-medium text-lg">{collection.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 mt-1">{collection.description}</p>
          <p className="text-gray-400 text-xs mt-1">
            Created: {format(collection.createdDate, 'MMM d, yyyy')}
          </p>
        </div>

        <div className="space-y-1 text-sm text-gray-400">
          <p>Videos: {collection.videoFiles.length}</p>
          <p>Audio: {collection.audioFiles.length}</p>
          <p>Sensors: {Object.values(collection.auxFiles).filter(Boolean).length + (collection.bvhFile ? 1 : 0)}</p>
        </div>

        <div className="space-y-2">
          {(['labeling', 'rating', 'validated'] as const).map(category => (
            <div key={category} className="space-y-1">
              <span className="text-xs text-gray-400 capitalize">{category}</span>
              <ProgressBar status={collection.progress[category]} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
} 