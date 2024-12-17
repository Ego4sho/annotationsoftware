'use client';

import { useState } from 'react';
import { Collection } from '@/types/upload';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ProgressBar } from '@/app/upload/components/ui/ProgressBar';

interface SelectableCollectionCardProps {
  collection: Collection;
  onFileSelect: (fileType: string, fileId: string) => void;
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

export function SelectableCollectionCard({
  collection,
  onFileSelect
}: SelectableCollectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFileSelect = (fileType: string, file: any) => {
    console.log('SelectableCollectionCard - Handling file selection:', {
      fileType,
      fileId: file.id,
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      storagePath: file.storagePath,
      collectionId: collection.id
    });

    onFileSelect(fileType, file.id);
  };

  return (
    <Card className="bg-[#262626] border-[#604abd] p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
          <p className="text-sm text-gray-400">{collection.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            Created: {format(collection.createdAt.toDate(), 'MMM d, yyyy')}
          </p>
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

      {/* Progress Bars */}
      <div className="space-y-2 mb-4">
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

      {isExpanded && (
        <div className="space-y-4">
          {FILE_TYPES.map(({ key, label }) => {
            const files = collection.files?.[key] || [];
            if (files.length === 0) return null;

            return (
              <div key={key} className="space-y-2">
                <h4 className="text-sm font-medium text-white">{label}</h4>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-[#363636] rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-white truncate">{file.fileName}</p>
                        <p className="text-xs text-gray-400">
                          Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        onClick={() => handleFileSelect(key, file)}
                        size="sm"
                        className="ml-2 bg-[#604abd] hover:bg-[#4c3a9e]"
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
} 