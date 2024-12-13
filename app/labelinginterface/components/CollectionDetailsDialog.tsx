import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collection } from "@/types/upload"
import { format } from 'date-fns'
import { ProgressBar } from "@/app/upload/components/ui/ProgressBar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CollectionDetailsDialogProps {
  collection: Collection
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileSelect: (fileType: string, fileId: string) => void
}

const FILE_TYPES = [
  { key: 'video', label: 'Video' },
  { key: 'audio', label: 'Audio' },
  { key: 'motion', label: 'Sensor' },
  { key: 'aux1', label: 'Auxiliary Sensor 1' },
  { key: 'aux2', label: 'Auxiliary Sensor 2' },
  { key: 'aux3', label: 'Auxiliary Sensor 3' },
  { key: 'aux4', label: 'Auxiliary Sensor 4' },
  { key: 'aux5', label: 'Auxiliary Sensor 5' }
] as const;

export function CollectionDetailsDialog({
  collection,
  open,
  onOpenChange,
  onFileSelect
}: CollectionDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[#1E1E1E] text-white border-[#604abd]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{collection.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Description and Date */}
            <div className="space-y-2">
              <p className="text-gray-400">{collection.description}</p>
              <p className="text-sm text-gray-400">
                Created: {format(collection.createdAt.toDate(), 'MMM d, yyyy')}
              </p>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              {(['labeling', 'rating', 'validated'] as const).map(category => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 capitalize">{category}</span>
                    <span className="text-sm text-gray-400 capitalize">
                      {collection.progress?.[category] || 'not-started'}
                    </span>
                  </div>
                  <ProgressBar status={collection.progress?.[category] || 'not-started'} />
                </div>
              ))}
            </div>

            {/* Files Sections */}
            <div className="space-y-6">
              {FILE_TYPES.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">{label}</h3>
                  {collection.files?.[key]?.length ? (
                    <div className="space-y-2">
                      {collection.files[key].map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2 bg-[#262626] rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm text-white truncate">{file.fileName}</p>
                            <p className="text-xs text-gray-400">
                              Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            onClick={() => onFileSelect(key, file.id)}
                            className="ml-4 bg-[#604abd] hover:bg-[#4c3a9e]"
                          >
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No {label.toLowerCase()} files available</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 