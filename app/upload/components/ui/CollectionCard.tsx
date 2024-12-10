import { Collection, ProjectFile } from '@/types/upload';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';

interface CollectionCardProps {
  collection: Collection;
  deleteMode: boolean;
  onDelete: (id: string) => void;
  onEdit: (collection: Collection) => void;
}

const getProgressColor = (status: 'not-started' | 'in-progress' | 'completed') => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-600';
  }
};

const getProgressWidth = (status: 'not-started' | 'in-progress' | 'completed') => {
  switch (status) {
    case 'completed':
      return '100%';
    case 'in-progress':
      return '50%';
    default:
      return '0%';
  }
};

export const CollectionCard = ({ collection, deleteMode, onDelete, onEdit }: CollectionCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    console.log('Deleting collection:', collection.id);
    if (onDelete) {
      onDelete(collection.id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: collection.id,
      type: 'collection'
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Safely get file counts
  const getFileCount = (type: 'video' | 'audio' | 'motion') => {
    if (!collection.files || !collection.files[type]) {
      return 0;
    }
    return collection.files[type].length;
  };

  return (
    <Card
      className="bg-[#262626] border-[#604abd] p-3 cursor-pointer hover:bg-[#303030] relative"
      onClick={() => onEdit(collection)}
      draggable
      onDragStart={handleDragStart}
    >
      {deleteMode && (
        <Button
          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 z-10"
          onClick={handleDelete}
          type="button"
        >
          <Trash2 className="h-4 w-4 text-white" />
        </Button>
      )}

      <div className="space-y-3">
        <div>
          <h3 className="text-[#E5E7EB] font-medium text-base truncate">{collection.name}</h3>
          <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{collection.description}</p>
          <p className="text-gray-400 text-xs mt-0.5">
            {format(collection.createdAt.toDate(), 'MMM d, yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-300">Videos</p>
            <p className="text-sm font-bold text-white">{getFileCount('video')}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-300">Audio</p>
            <p className="text-sm font-bold text-white">{getFileCount('audio')}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-300">Sensors</p>
            <p className="text-sm font-bold text-white">{getFileCount('motion')}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          {(['labeling', 'rating', 'validated'] as const).map(category => (
            <div key={category} className="space-y-0.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 capitalize">{category}</span>
                <span className="text-xs text-gray-400 capitalize">
                  {collection.progress?.[category] || 'not-started'}
                </span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getProgressColor(collection.progress?.[category] || 'not-started')}`}
                  style={{
                    width: getProgressWidth(collection.progress?.[category] || 'not-started')
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};