import { Card } from "@/components/ui/card"
import { Collection } from "@/types/upload"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { ProgressBar } from "./ProgressBar"

interface CollectionCardProps {
  collection: Collection
  deleteMode: boolean
  onDelete: (id: string, projectId?: string) => void
  onEdit: (collection: Collection) => void
  showFileSelectionButtons?: boolean
  onFileSelect?: (fileType: string, fileId: string) => void
}

export function CollectionCard({
  collection,
  deleteMode,
  onDelete,
  onEdit,
  showFileSelectionButtons = false,
  onFileSelect
}: CollectionCardProps) {
  const getFileCount = (files: any[]) => {
    return Array.isArray(files) ? files.length : 0
  }

  return (
    <Card 
      className={cn(
        "bg-[#262626] border-[#604abd] p-4 space-y-4 transition-all duration-300 relative",
        deleteMode && "border-red-500 hover:border-red-600",
        !deleteMode && !showFileSelectionButtons && "cursor-grab active:cursor-grabbing"
      )}
      draggable={!deleteMode && !showFileSelectionButtons}
      onDragStart={(e) => {
        if (!deleteMode && !showFileSelectionButtons) {
          e.dataTransfer.setData('application/json', JSON.stringify({
            collectionId: collection.id,
            sourceProjectId: collection.projectId || 'none'
          }));
        }
      }}
    >
      <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 rounded">Upload Page Collection Card</div>
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white">{collection.name}</h3>
            <p className="text-sm text-gray-400">{collection.description}</p>
          </div>
          {!showFileSelectionButtons && (
            <div className="flex gap-2">
              {deleteMode ? (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(collection.id, collection.projectId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(collection)}
                  className="border-[#604abd] text-white hover:bg-[#604abd]/20"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Created: {format(collection.createdAt.toDate(), 'MMM d, yyyy')}
        </div>
      </div>

      {showFileSelectionButtons ? (
        <div className="space-y-2">
          {collection.files.video.map(file => (
            <Button
              key={file.id}
              variant="outline"
              className="w-full justify-start text-left text-sm text-gray-400 hover:text-white"
              onClick={() => onFileSelect?.('video', file.id)}
            >
              {file.fileName}
            </Button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-1 bg-[#1A1A1A] rounded">
            <div className="text-[10px] text-gray-400 mb-0.5">Video</div>
            <div className="text-xs font-medium text-white">{getFileCount(collection.files.video)}</div>
          </div>
          <div className="text-center p-1 bg-[#1A1A1A] rounded">
            <div className="text-[10px] text-gray-400 mb-0.5">Audio</div>
            <div className="text-xs font-medium text-white">{getFileCount(collection.files.audio)}</div>
          </div>
          <div className="text-center p-1 bg-[#1A1A1A] rounded">
            <div className="text-[10px] text-gray-400 mb-0.5">Motion</div>
            <div className="text-xs font-medium text-white">{getFileCount(collection.files.motion)}</div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {(['labeling', 'rating', 'validated'] as const).map(category => (
          <div key={category} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 capitalize">{category}</span>
              <span className={cn(
                "text-gray-400 capitalize",
                collection.progress[category] === 'completed' && "text-green-500",
                collection.progress[category] === 'in-progress' && "text-yellow-500",
                collection.progress[category] === 'not-started' && "text-red-500"
              )}>
                {collection.progress[category]}
              </span>
            </div>
            <ProgressBar status={collection.progress[category]} />
          </div>
        ))}
      </div>
    </Card>
  );
}