import { Card, CardContent } from "@/components/ui/card"
import { Collection } from "@/types/upload"
import { format } from 'date-fns'
import { ProgressBar } from "@/app/upload/components/ui/ProgressBar"
import { CollectionDetailsDialog } from "./CollectionDetailsDialog"
import { useState } from "react"

interface SelectableCollectionCardProps {
  collection: Collection
  onFileSelect: (fileType: string, fileId: string) => void
}

export function SelectableCollectionCard({
  collection,
  onFileSelect
}: SelectableCollectionCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <Card 
        className="bg-[#262626] border-[#604abd] p-4 cursor-pointer hover:bg-[#303030] relative"
        onClick={() => setShowDetails(true)}
      >
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 rounded">Label Page Collection Card</div>
        <CardContent className="space-y-4 p-0">
          <div>
            <h3 className="text-[#E5E7EB] font-medium text-base truncate">{collection.name}</h3>
            <p className="text-gray-400 text-xs line-clamp-2 mt-1">{collection.description}</p>
            <p className="text-gray-400 text-xs mt-1">
              {format(collection.createdAt.toDate(), 'MMM d, yyyy')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="text-[10px] text-gray-400 mb-0.5">Video</div>
              <div className="text-xs font-medium text-white">
                {collection.files?.video?.length || 0}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 mb-0.5">Audio</div>
              <div className="text-xs font-medium text-white">
                {collection.files?.audio?.length || 0}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 mb-0.5">Sensor</div>
              <div className="text-xs font-medium text-white">
                {collection.files?.motion?.length || 0}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {(['labeling', 'rating', 'validated'] as const).map(category => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 capitalize">{category}</span>
                  <span className="text-xs text-gray-400 capitalize">
                    {collection.progress?.[category] || 'not-started'}
                  </span>
                </div>
                <ProgressBar status={collection.progress?.[category] || 'not-started'} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CollectionDetailsDialog
        collection={collection}
        open={showDetails}
        onOpenChange={setShowDetails}
        onFileSelect={onFileSelect}
      />
    </>
  )
} 