import { useCallback } from 'react'
import { useDropzone, Accept } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { useUploadState } from '../../hooks/useUploadState'
import { v4 as uuidv4 } from 'uuid'
import { Progress } from "@/components/ui/progress"
import { useToast } from '@/components/ui/use-toast'
import { UploadFile, FileType, Collection, ProjectFile } from '@/types/upload'
import { Button } from "@/components/ui/button"

const getMimeTypes = (fileType: string): Accept => {
  switch (fileType) {
    case 'video':
      return {
        'video/mp4': ['.mp4'],
        'video/quicktime': ['.mov']
      };
    case 'audio':
      return {
        'audio/mpeg': ['.mp3'],
        'audio/wav': ['.wav']
      };
    case 'motion':
      return {
        'application/octet-stream': ['.bvh'],
        'text/plain': ['.txt', '.csv']
      };
    case 'aux1':
    case 'aux2':
    case 'aux3':
    case 'aux4':
    case 'aux5':
      return {
        'text/plain': ['.txt', '.csv'],
        'application/octet-stream': ['.dat']
      };
    default:
      return {};
  }
};

export interface FileUploadAreaProps {
  projectId: string
  collectionId: string
  accept: string
  maxFiles: number
  fileType: FileType | 'aux1' | 'aux2' | 'aux3' | 'aux4' | 'aux5'
  disabled?: boolean
  collection?: Collection | null
  onDeleteFile?: (type: FileType | 'aux1' | 'aux2' | 'aux3' | 'aux4' | 'aux5', fileId: string) => void
}

export const FileUploadArea = ({
  projectId,
  collectionId,
  accept,
  maxFiles,
  fileType,
  disabled = false,
  collection,
  onDeleteFile
}: FileUploadAreaProps) => {
  const { getFiles, addFile, removeFile, updateFileProgress } = useUploadState();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Check if we've already reached the max files limit including saved files
    const savedFiles = collection?.files?.[fileType] || [];
    const uploadingFiles = getFiles(collectionId).filter(f => f.type === fileType && f.status !== 'complete');
    const totalFiles = savedFiles.length + uploadingFiles.length;
    const remainingSlots = maxFiles - totalFiles;
    
    if (remainingSlots <= 0) {
      toast({
        title: "Error",
        description: `Maximum ${maxFiles} ${fileType} files allowed`,
        variant: "destructive"
      });
      return;
    }

    // Only accept files up to the remaining slots
    const filesToUpload = acceptedFiles.slice(0, remainingSlots);

    filesToUpload.forEach(file => {
      const fileId = uuidv4();
      addFile(collectionId, {
        id: fileId,
        file,
        type: fileType,
        progress: 0,
        status: 'pending'
      });
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          updateFileProgress(collectionId, fileId, progress);
        }
        if (progress === 100) {
          clearInterval(interval);
          updateFileProgress(collectionId, fileId, 100, 'complete');
          toast({
            title: "Success",
            description: `${file.name} uploaded successfully`,
          });
        }
      }, 500);
    });
  }, [addFile, collectionId, fileType, updateFileProgress, toast, maxFiles, collection]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getMimeTypes(fileType),
    maxFiles,
    disabled,
    multiple: maxFiles > 1
  });

  const handleRemoveFile = (fileId: string) => {
    removeFile(collectionId, fileId);
  };

  // Get files that are currently being uploaded or completed but not saved
  const uploadingFiles = getFiles(collectionId)
    .filter((f: UploadFile) => 
      f.type === fileType
    );

  // Get saved files from the collection
  const savedFiles = collection?.files?.[fileType] || [];

  // Show uploading/completed files if they exist, otherwise show saved files
  const showUploadingFiles = uploadingFiles.length > 0;
  const showSavedFiles = !showUploadingFiles && savedFiles.length > 0;

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-purple-500/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-400">
          {isDragActive ? (
            'Drop files here'
          ) : (
            `Drag & drop ${fileType} files here, or click to select`
          )}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum {maxFiles} file{maxFiles > 1 ? 's' : ''}
        </p>
      </div>

      {/* Show files being uploaded or completed but not saved */}
      {showUploadingFiles && (
        <div className="space-y-2">
          {uploadingFiles.map((file: UploadFile) => (
            <div key={file.id} className="bg-[#262626] rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300 truncate flex-1 mr-2">{file.file.name}</span>
                <span className="text-xs text-gray-400">
                  {file.status === 'complete' ? '100%' : file.status === 'uploading' ? `${file.progress}%` : ''}
                </span>
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                  disabled={disabled || file.status === 'uploading'}
                >
                  ×
                </button>
              </div>
              {(file.status === 'uploading' || file.status === 'complete') && (
                <Progress 
                  value={file.progress} 
                  className="h-1 bg-gray-700"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Show saved files */}
      {showSavedFiles && (
        <div className="mt-2 space-y-1">
          {savedFiles.map((file: ProjectFile) => (
            <div key={file.id} className="flex items-center justify-between text-sm text-gray-400 bg-[#262626] p-2 rounded">
              <span>{file.fileName}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-red-500/20"
                onClick={() => onDeleteFile?.(fileType, file.id)}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 