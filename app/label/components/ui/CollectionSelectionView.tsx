import { Collection } from '@/types/upload';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { CollectionCard } from '@/app/upload/components/ui/CollectionCard';

interface CollectionSelectionViewProps {
  collections: Collection[];
  projectName?: string;
  onBack: () => void;
  onCollectionSelect: (collectionId: string) => void;
}

export function CollectionSelectionView({
  collections,
  projectName,
  onBack,
  onCollectionSelect
}: CollectionSelectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-[#262626]"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <h2 className="text-2xl font-bold text-white">
          {projectName ? `Collections in ${projectName}` : 'Unassigned Collections'}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <div key={collection.id} onClick={() => onCollectionSelect(collection.id)}>
            <CollectionCard
              collection={collection}
              onEdit={() => onCollectionSelect(collection.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 