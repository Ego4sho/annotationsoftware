import { Collection } from '@/types/upload';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface FileSelectionViewProps {
  collection: Collection;
  selectedFiles: { [key: string]: boolean };
  onBack: () => void;
  onFileSelect: (fileId: string, type: 'video' | 'audio' | 'motion') => void;
}

export function FileSelectionView({
  collection,
  selectedFiles,
  onBack,
  onFileSelect
}: FileSelectionViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-[#262626]"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Button>
        <h2 className="text-2xl font-bold text-white">
          Files in {collection.name}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Video Files */}
        {collection.files.video.length > 0 && (
          <Card className="bg-[#262626] border-[#604abd] p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Video Files</h3>
            <div className="space-y-3">
              {collection.files.video.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-[#1A1A1A] rounded">
                  <div className="text-white">
                    <p className="font-medium">{file.fileName}</p>
                    <p className="text-sm text-gray-400">
                      {(file.metadata?.duration || 0).toFixed(2)}s | {file.metadata?.resolution || 'Unknown'}
                    </p>
                  </div>
                  <Switch
                    checked={selectedFiles[file.id] || false}
                    onCheckedChange={() => onFileSelect(file.id, 'video')}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Audio Files */}
        {collection.files.audio.length > 0 && (
          <Card className="bg-[#262626] border-[#604abd] p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Audio Files</h3>
            <div className="space-y-3">
              {collection.files.audio.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-[#1A1A1A] rounded">
                  <div className="text-white">
                    <p className="font-medium">{file.fileName}</p>
                    <p className="text-sm text-gray-400">
                      {(file.metadata?.duration || 0).toFixed(2)}s | {file.metadata?.format || 'Unknown'}
                    </p>
                  </div>
                  <Switch
                    checked={selectedFiles[file.id] || false}
                    onCheckedChange={() => onFileSelect(file.id, 'audio')}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Motion Files */}
        {collection.files.motion.length > 0 && (
          <Card className="bg-[#262626] border-[#604abd] p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Sensor Files</h3>
            <div className="space-y-3">
              {collection.files.motion.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-[#1A1A1A] rounded">
                  <div className="text-white">
                    <p className="font-medium">{file.fileName}</p>
                    <p className="text-sm text-gray-400">
                      {file.size / 1024} KB | {file.metadata?.format || 'Unknown'}
                    </p>
                  </div>
                  <Switch
                    checked={selectedFiles[file.id] || false}
                    onCheckedChange={() => onFileSelect(file.id, 'motion')}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 