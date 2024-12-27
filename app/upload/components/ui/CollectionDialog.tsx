import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from 'lucide-react'
import { Collection, ProjectFile } from '@/types/upload'
import { useState, useEffect } from 'react'
import { Timestamp } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/lib/context/AuthContext'
import { FileUploadArea } from './FileUploadArea'
import { format } from 'date-fns'
import { useUploadState } from '../../hooks/useUploadState'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { useToast } from "@/components/ui/use-toast"

interface CollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: Collection | null
  onSave: (collection: Collection) => void
}

const MAX_RETRY_ATTEMPTS = 3;
const CHUNK_SIZE = 256 * 1024; // 256KB chunks for better upload reliability

export const CollectionDialog: React.FC<CollectionDialogProps> = ({
  open,
  onOpenChange,
  collection,
  onSave
}) => {
  const [formData, setFormData] = useState<Collection | null>(null);
  const { user } = useAuth();
  const { getFiles, clearFiles, updateFileProgress } = useUploadState();
  const { toast } = useToast();

  useEffect(() => {
    if (collection) {
      // Editing existing collection
      setFormData({
        ...collection,
        files: collection.files || {
          video: [],
          audio: [],
          motion: [],
          aux1: [],
          aux2: [],
          aux3: [],
          aux4: [],
          aux5: []
        }
      });
    } else {
      // Creating new collection - generate ID immediately
      const newCollectionId = uuidv4();
      setFormData({
        id: newCollectionId,
        name: '',
        description: '',
        userId: user?.uid || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'incomplete',
        files: {
          video: [],
          audio: [],
          motion: [],
          aux1: [],
          aux2: [],
          aux3: [],
          aux4: [],
          aux5: []
        },
        progress: {
          labeling: 'not-started',
          rating: 'not-started',
          validated: 'not-started'
        }
      } as Collection);
    }
  }, [collection, user, open]); // Added open to dependencies to reset on dialog open

  const handleSubmit = async () => {
    if (formData) {
      try {
        console.log('Starting collection save and file uploads for collection:', formData.id);
        console.log('Current user:', user?.uid);

        // Get files to upload first
        const filesToUpload = getFiles(formData.id);
        console.log('Files to upload:', filesToUpload.map(f => ({
          name: f.file.name,
          type: f.type,
          size: f.file.size,
          id: f.id
        })));

        // Create initial collection with empty files array
        const initialCollection = {
          ...formData,
          updatedAt: Timestamp.now(),
          files: {
            video: [],
            audio: [],
            motion: [],
            aux1: [],
            aux2: [],
            aux3: [],
            aux4: [],
            aux5: []
          }
        };
        
        console.log('Creating initial collection:', initialCollection);
        await onSave(initialCollection);
        
        // Upload files to Firebase Storage and get permanent URLs
        const uploadFile = async (file: UploadFile): Promise<ProjectFile> => {
          const fileId = file.id;
          const fileName = file.file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
          const path = `files/${user?.uid}/${formData.id}/${fileId}-${fileName}`;
          
          console.log('Starting upload for file:', {
            fileName: file.file.name,
            path,
            fileSize: file.file.size,
            fileType: file.file.type,
            collectionId: formData.id,
            fileId: fileId
          });
          
          updateFileProgress(formData.id, fileId, 0, 'uploading');
          
          let retryAttempt = 0;
          
          const attemptUpload = async (): Promise<ProjectFile> => {
            try {
              const storageRef = ref(storage, path);
              const metadata = {
                contentType: file.file.type,
                customMetadata: {
                  collectionId: formData.id,
                  fileId: fileId,
                  originalName: file.file.name
                }
              };

              const uploadTask = uploadBytesResumable(storageRef, file.file, metadata);
              
              return new Promise((resolve, reject) => {
                let lastProgress = 0;
                let progressTimeout: NodeJS.Timeout | null = null;
                let lastProgressUpdate = Date.now();

                const resetProgressTimeout = () => {
                  if (progressTimeout) {
                    clearTimeout(progressTimeout);
                    progressTimeout = null;
                  }
                  progressTimeout = setTimeout(() => {
                    const timeSinceLastUpdate = Date.now() - lastProgressUpdate;
                    if (lastProgress < 100 && timeSinceLastUpdate > 30000) { // Increased timeout to 30 seconds
                      console.log('Upload progress stalled, retrying...');
                      uploadTask.cancel();
                      reject(new Error('Upload progress stalled'));
                    }
                  }, 30000); // 30 second timeout
                };

                uploadTask.on(
                  'state_changed',
                  (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    lastProgress = progress;
                    lastProgressUpdate = Date.now();
                    
                    console.log(`Upload progress for ${file.file.name}:`, {
                      progress,
                      bytesTransferred: snapshot.bytesTransferred,
                      totalBytes: snapshot.totalBytes,
                      state: snapshot.state
                    });
                    
                    updateFileProgress(formData.id, fileId, progress, 'uploading');
                    resetProgressTimeout();
                  },
                  (error) => {
                    if (progressTimeout) {
                      clearTimeout(progressTimeout);
                      progressTimeout = null;
                    }
                    console.error('Upload error:', {
                      error,
                      code: error.code,
                      message: error.message,
                      serverResponse: error.serverResponse
                    });
                    reject(error);
                  },
                  async () => {
                    if (progressTimeout) {
                      clearTimeout(progressTimeout);
                      progressTimeout = null;
                    }
                    try {
                      console.log(`Upload completed for ${file.file.name}, getting download URL...`);
                      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                      console.log(`Got download URL for ${file.file.name}:`, downloadURL);
                      updateFileProgress(formData.id, fileId, 100, 'complete');
                      
                      resolve({
                        id: fileId,
                        projectId: formData.id,
                        userId: user?.uid || '',
                        type: file.type,
                        fileName: file.file.name,
                        originalName: file.file.name,
                        fileUrl: downloadURL,
                        storagePath: path,
                        size: file.file.size,
                        uploadedAt: Timestamp.now(),
                        status: 'ready'
                      } as ProjectFile);
                    } catch (error) {
                      console.error('Error getting download URL:', error);
                      reject(error);
                    }
                  }
                );

                // Clean up on unmount
                return () => {
                  if (progressTimeout) {
                    clearTimeout(progressTimeout);
                    progressTimeout = null;
                  }
                };
              });
            } catch (error) {
              console.error('Upload attempt failed:', error);
              throw error;
            }
          };

          // Implement retry logic with exponential backoff
          while (retryAttempt < MAX_RETRY_ATTEMPTS) {
            try {
              return await attemptUpload();
            } catch (error) {
              retryAttempt++;
              if (retryAttempt < MAX_RETRY_ATTEMPTS) {
                const delay = Math.pow(2, retryAttempt) * 1000; // Exponential backoff
                console.log(`Retry attempt ${retryAttempt} for ${file.file.name}, waiting ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
              } else {
                updateFileProgress(formData.id, fileId, 0, 'error');
                toast({
                  title: "Upload Error",
                  description: `Failed to upload ${file.file.name} after ${MAX_RETRY_ATTEMPTS} attempts`,
                  variant: "destructive"
                });
                throw error;
              }
            }
          }

          throw new Error(`Failed to upload ${file.file.name} after ${MAX_RETRY_ATTEMPTS} attempts`);
        };

        // Upload files sequentially
        const uploadedFiles = [];
        for (const file of filesToUpload) {
          try {
            const uploadedFile = await uploadFile(file);
            uploadedFiles.push(uploadedFile);
          } catch (error) {
            console.error(`Failed to upload ${file.file.name}:`, error);
            // Continue with other files even if one fails
          }
        }
        console.log('All files uploaded:', uploadedFiles);

        // Group uploaded files by type
        const uploadedVideoFiles = uploadedFiles.filter(f => f.type === 'video');
        const uploadedAudioFiles = uploadedFiles.filter(f => f.type === 'audio');
        const uploadedMotionFiles = uploadedFiles.filter(f => f.type === 'motion');

        // Update collection with uploaded files
        const updatedCollection = {
          ...formData,
          updatedAt: Timestamp.now(),
          files: {
            video: uploadedVideoFiles,
            audio: uploadedAudioFiles,
            motion: uploadedMotionFiles,
            aux1: [],
            aux2: [],
            aux3: [],
            aux4: [],
            aux5: []
          }
        };

        console.log('Saving updated collection with files:', updatedCollection);
        await onSave(updatedCollection);
        clearFiles(formData.id);  // Clear the Zustand store for this collection
        onOpenChange(false);

        toast({
          title: "Success",
          description: `Successfully uploaded ${uploadedFiles.length} of ${filesToUpload.length} files`,
        });

        // Reset form data after successful save
        if (!collection) {
          setFormData(null);
        }
      } catch (error) {
        console.error('Error submitting collection:', error);
        toast({
          title: "Error",
          description: "Failed to save collection and upload files. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteFile = (type: 'video' | 'audio' | 'motion', fileId: string) => {
    if (formData) {
      setFormData({
        ...formData,
        files: {
          ...formData.files,
          [type]: (formData.files?.[type] || []).filter(file => file.id !== fileId)
        }
      });
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] h-[80vh] bg-[#1A1A1A] border-[#604abd] p-0 flex flex-col"
        aria-describedby={formData ? "collection-dialog-description" : undefined}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-white">
            {collection ? 'Edit Collection' : 'Add New Collection'}
          </DialogTitle>
          <DialogDescription id="collection-dialog-description" className="text-gray-400">
            {collection ? 'Update collection details and manage files' : 'Create a new collection and add files'}
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {/* Details Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Title</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter collection title"
                  className="bg-[#262626] border-[#404040] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter collection description"
                  className="bg-[#262626] border-[#404040] text-white min-h-[80px]"
                />
              </div>
            </div>

            {/* Status Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Status</h3>
              {(['labeling', 'rating', 'validated'] as const).map(category => (
                <div key={category} className="space-y-2">
                  <Label className="text-white capitalize">{category} Status</Label>
                  <Select
                    value={formData.progress[category]}
                    onValueChange={(value: 'not-started' | 'in-progress' | 'completed') => 
                      setFormData(prev => prev ? ({
                        ...prev,
                        progress: {
                          ...prev.progress,
                          [category]: value
                        }
                      }) : prev)
                    }
                  >
                    <SelectTrigger className="bg-[#262626] border-[#404040] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#262626] border-[#404040]">
                      <SelectItem value="not-started" className="text-white">Not Started</SelectItem>
                      <SelectItem value="in-progress" className="text-white">In Progress</SelectItem>
                      <SelectItem value="completed" className="text-white">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Files Section */}
            <div className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">Video Files</Label>
                <FileUploadArea
                  projectId={formData.id}
                  collectionId={formData.id}
                  accept="video/*"
                  maxFiles={5}
                  fileType="video"
                  disabled={false}
                  collection={formData}
                  onDeleteFile={handleDeleteFile}
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Audio Files</Label>
                <FileUploadArea
                  projectId={formData.id}
                  collectionId={formData.id}
                  accept="audio/*"
                  maxFiles={5}
                  fileType="audio"
                  disabled={false}
                  collection={formData}
                  onDeleteFile={handleDeleteFile}
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Sensor Files</Label>
                <FileUploadArea
                  projectId={formData.id}
                  collectionId={formData.id}
                  accept=".bvh,.json"
                  maxFiles={5}
                  fileType="motion"
                  disabled={false}
                  collection={formData}
                  onDeleteFile={handleDeleteFile}
                />
              </div>

              {/* AUX Sensor Sections */}
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={`aux${num}`}>
                  <Label className="text-white mb-2 block">AUX Sensor {num}</Label>
                  <FileUploadArea
                    projectId={formData.id}
                    collectionId={formData.id}
                    accept=".txt,.csv,.dat"
                    maxFiles={1}
                    fileType={`aux${num}` as 'aux1' | 'aux2' | 'aux3' | 'aux4' | 'aux5'}
                    disabled={false}
                    collection={formData}
                    onDeleteFile={handleDeleteFile}
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-[#404040]">
          <Button 
            onClick={handleSubmit}
            className="w-full bg-[#604abd] hover:bg-[#4c3a9e] text-white"
          >
            {collection ? 'Save Changes' : 'Create Collection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 