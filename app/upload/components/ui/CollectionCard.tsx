import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { format } from 'date-fns'
import { Collection } from '../../types'

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
      className="bg-[#262626] border-[#604abd] p-3 cursor-pointer hover:bg-[#303030] relative h-[160px] flex flex-col overflow-hidden"
    >
      {deleteMode && (
        <Button
          className="absolute -top-1 -right-1 p-0.5 rounded-full bg-red-500 hover:bg-red-600 z-10 scale-[0.65]"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(collection.id, collection.currentProjectId)
          }}
        >
          <X className="h-2.5 w-2.5 text-white" />
        </Button>
      )}

      <div className="flex flex-col h-full">
        <div>
          <h3 className="text-[#E5E7EB] font-medium text-[14px] truncate mb-2">{collection.title}</h3>
        </div>

        <div className="space-y-0.5 mb-2">
          <p className="text-gray-400 text-[9px] line-clamp-1">{collection.description}</p>
          <p className="text-gray-400 text-[8px]">
            Created: {format(collection.createdDate, 'MMM d, yyyy')}
          </p>
          <div className="flex gap-2 text-[8px] text-gray-400">
            <p>V:{collection.videoFiles.length}</p>
            <p>A:{collection.audioFiles.length}</p>
            <p>S:{Object.values(collection.auxFiles).filter(Boolean).length + (collection.bvhFile ? 1 : 0)}</p>
          </div>
        </div>

        <div className="space-y-[2px] mt-auto">
          {(['labeling', 'rating', 'validated'] as const).map(category => (
            <div key={category} className="space-y-[1px]">
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-gray-400 capitalize">{category}</span>
                <span className="text-[7px] text-gray-400">{collection.progress[category]}</span>
              </div>
              <div className="h-[3px] bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    collection.progress[category] === 'not-started' ? 'bg-red-500' :
                    collection.progress[category] === 'in-progress' ? 'bg-orange-500' :
                    'bg-green-500'
                  } transition-all duration-300`}
                  style={{ 
                    width: collection.progress[category] === 'not-started' ? '33%' :
                           collection.progress[category] === 'in-progress' ? '66%' :
                           '100%' 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
} 