import { Collection } from "@/types/upload";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';

interface StatusCardProps {
  collection: Collection;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteMode?: boolean;
}

const getProgressColor = (status: 'not-started' | 'in-progress' | 'completed') => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
      return 'bg-yellow-500';
    default:
      return 'bg-red-500';
  }
};

const getProgressWidth = (status: 'not-started' | 'in-progress' | 'completed') => {
  switch (status) {
    case 'completed':
      return '100%';
    case 'in-progress':
      return '66%';
    default:
      return '33%';
  }
};

export const StatusCard = ({ collection, onEdit, onDelete, deleteMode = false }: StatusCardProps) => {
  return (
    <Card className="bg-[#262626] border-[#604abd] p-4 cursor-pointer hover:bg-[#303030] relative" onClick={() => onEdit?.()}>
      {deleteMode && (
        <Button
          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <Trash2 className="h-4 w-4 text-white" />
        </Button>
      )}

      <CardContent className="space-y-4 p-0">
        <div>
          <h3 className="text-[#E5E7EB] font-medium text-lg">{collection.name}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 mt-1">{collection.description}</p>
          <p className="text-gray-400 text-xs mt-1">
            Created: {format(collection.createdAt.toDate(), 'MMM d, yyyy')}
          </p>
        </div>

        <div className="space-y-1 text-sm text-gray-400">
          <p>Videos: {collection.files.video.length}</p>
          <p>Audio: {collection.files.audio.length}</p>
          <p>Motion: {collection.files.motion.length}</p>
        </div>

        <div className="space-y-2">
          {(['labeling', 'rating', 'validated'] as const).map(category => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 capitalize">{category}</span>
                <span className="text-xs text-gray-400 capitalize">
                  {collection.progress[category]}
                </span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getProgressColor(collection.progress[category])}`}
                  style={{
                    width: getProgressWidth(collection.progress[category])
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 