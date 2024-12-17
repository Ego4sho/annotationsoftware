'use client';

import { useState } from 'react';
import { Project, Collection } from '@/types/upload';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SelectableCollectionCard } from './SelectableCollectionCard';

interface SelectableProjectContainerProps {
  project: Project;
  collections: Collection[];
  onFileSelect: (fileType: string, fileId: string) => void;
}

export function SelectableProjectContainer({
  project,
  collections,
  onFileSelect
}: SelectableProjectContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get collections that belong to this project
  const projectCollections = collections.filter(c => c.projectId === project.id);

  return (
    <Card className="bg-[#262626] border-[#604abd] p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
          <p className="text-sm text-gray-400">{projectCollections.length} collections</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:bg-[#363636]"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4">
          {projectCollections.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {projectCollections.map(collection => (
                <SelectableCollectionCard
                  key={collection.id}
                  collection={collection}
                  onFileSelect={onFileSelect}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No collections in this project</p>
          )}
        </div>
      )}
    </Card>
  );
} 