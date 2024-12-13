import { useCallback } from 'react'
import { useDropzone, Accept } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { useUploadState } from '../../hooks/useUploadState'
import { v4 as uuidv4 } from 'uuid'
import { Progress } from "@/components/ui/progress"
import { useToast } from '@/components/ui/use-toast'
import { UploadFile, FileType, Collection, ProjectFile } from '@/types/upload'
import { Button } from "@/components/ui/button"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useAuth } from '@/lib/context/AuthContext'

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
  const { user } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload files",
        variant: "destructive"
      });
      return;
    }

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

    filesToUpload.forEach(async (file) => {
      const fileId = uuidv4();
      addFile(collectionId, {
        id: fileId,
        file,
        type: fileType,
        progress: 0,
        status: 'uploading'
      });

      try {
        // Create storage reference
        const storage = getStorage();
        const storagePath = `users/${user.uid}/collections/${collectionId}/${fileType}/${fileId}`;
        const fileRef = ref(storage, storagePath);

        // Start upload
        const uploadTask = uploadBytesResumable(fileRef, file);

        // Monitor upload progress
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            updateFileProgress(collectionId, fileId, progress);
          },
          (error) => {
            console.error('Upload error:', error);
            updateFileProgress(collectionId, fileId, 0, 'error');
            toast({
              title: "Error",
              description: `Failed to upload ${file.name}`,
              variant: "destructive"
            });
          },
          async () => {
            try {
              // Upload completed successfully
              updateFileProgress(collectionId, fileId, 100, 'complete');
              toast({
                title: "Success",
                description: `${file.name} uploaded successfully`,
              });
            } catch (error) {
              console.error('Error getting download URL:', error);
              updateFileProgress(collectionId, fileId, 0, 'error');
              toast({
                title: "Error",
                description: `Failed to process ${file.name}`,
                variant: "destructive"
              });
            }
          }
        );
      } catch (error) {
        console.error('Upload error:', error);
        updateFileProgress(collectionId, fileId, 0, 'error');
        toast({
          title: "Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    });
  }, [addFile, collectionId, fileType, updateFileProgress, toast, maxFiles, collection, user]);

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