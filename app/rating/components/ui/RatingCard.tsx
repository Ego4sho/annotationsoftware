import { RatingCardProps } from '../types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, Trash2 } from 'lucide-react';

export const RatingCard: React.FC<RatingCardProps> = ({ 
  rating, 
  isEditing, 
  onEdit, 
  onDelete, 
  editingRating, 
  setEditingRating, 
  handleEditRating 
}) => {
  return (
    <div className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] p-4 rounded-lg flex flex-col items-center justify-center relative group">
      {editingRating?.id === rating.id ? (
        <>
          <Input
            value={editingRating.name}
            onChange={(e) => setEditingRating(prev => prev ? {...prev, name: e.target.value} : null)}
            className="bg-gray-700 text-white border-gray-600 w-full mb-2 text-center"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={editingRating.scaleStart}
              onChange={(e) => setEditingRating(prev => prev ? {...prev, scaleStart: parseInt(e.target.value)} : null)}
              className="w-16 bg-gray-700 text-white border-gray-600 text-center"
              min={1}
            />
            <span className="text-white">-</span>
            <Input
              type="number"
              value={editingRating.scaleEnd}
              onChange={(e) => setEditingRating(prev => prev ? {...prev, scaleEnd: parseInt(e.target.value)} : null)}
              className="w-16 bg-gray-700 text-white border-gray-600 text-center"
              min={2}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-green-500 hover:text-green-700 p-0 mt-2"
            onClick={() => handleEditRating(rating)}
          >
            <Check className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <span className="text-white text-center font-semibold">{rating.name}</span>
          <span className="text-gray-200 text-center">{rating.scaleStart}-{rating.scaleEnd}</span>
          {isEditing && (
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-700 p-0"
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 p-0"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 