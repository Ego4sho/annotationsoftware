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

interface CollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: Collection | null
  onSave: (collection: Collection) => void
}

export const CollectionDialog: React.FC<CollectionDialogProps> = ({
  open,
  onOpenChange,
  collection,
  onSave
}) => {
  const [formData, setFormData] = useState<Collection | null>(null);
  const { user } = useAuth();
  const { getFiles, clearFiles } = useUploadState();

  useEffect(() => {
    if (collection) {
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
      setFormData({
        id: '',
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
  }, [collection, user]);

  const handleSubmit = () => {
    if (formData) {
      // Get files from Zustand store
      const uploadedVideoFiles = getFiles(formData.id).filter(f => f.type === 'video').map(f => ({
        id: f.id,
        projectId: formData.id,
        userId: user?.uid || '',
        type: f.type,
        fileName: f.file.name,
        originalName: f.file.name,
        storagePath: `users/${user?.uid}/collections/${formData.id}/video/${f.id}`,
        size: f.file.size,
        uploadedAt: Timestamp.now(),
        status: 'ready'
      } as ProjectFile));

      const uploadedAudioFiles = getFiles(formData.id).filter(f => f.type === 'audio').map(f => ({
        id: f.id,
        projectId: formData.id,
        userId: user?.uid || '',
        type: f.type,
        fileName: f.file.name,
        originalName: f.file.name,
        storagePath: `users/${user?.uid}/collections/${formData.id}/audio/${f.id}`,
        size: f.file.size,
        uploadedAt: Timestamp.now(),
        status: 'ready'
      } as ProjectFile));

      const uploadedMotionFiles = getFiles(formData.id).filter(f => f.type === 'motion').map(f => ({
        id: f.id,
        projectId: formData.id,
        userId: user?.uid || '',
        type: f.type,
        fileName: f.file.name,
        originalName: f.file.name,
        storagePath: `users/${user?.uid}/collections/${formData.id}/motion/${f.id}`,
        size: f.file.size,
        uploadedAt: Timestamp.now(),
        status: 'ready'
      } as ProjectFile));

      // Get existing files that weren't modified
      const existingVideoFiles = formData.files.video || [];
      const existingAudioFiles = formData.files.audio || [];
      const existingMotionFiles = formData.files.motion || [];
      const existingAux1Files = formData.files.aux1 || [];
      const existingAux2Files = formData.files.aux2 || [];
      const existingAux3Files = formData.files.aux3 || [];
      const existingAux4Files = formData.files.aux4 || [];
      const existingAux5Files = formData.files.aux5 || [];

      // Update formData with both uploaded and existing files
      const updatedCollection = {
        ...formData,
        updatedAt: Timestamp.now(),
        files: {
          video: [...existingVideoFiles, ...uploadedVideoFiles],
          audio: [...existingAudioFiles, ...uploadedAudioFiles],
          motion: [...existingMotionFiles, ...uploadedMotionFiles],
          aux1: existingAux1Files,
          aux2: existingAux2Files,
          aux3: existingAux3Files,
          aux4: existingAux4Files,
          aux5: existingAux5Files
        }
      };

      console.log('Saving collection with files:', updatedCollection);
      onSave(updatedCollection);
      clearFiles(formData.id);  // Clear the Zustand store for this collection
      onOpenChange(false);
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
        aria-describedby="collection-dialog-description"
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