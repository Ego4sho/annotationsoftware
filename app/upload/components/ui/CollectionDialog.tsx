import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, X } from 'lucide-react'
import { Collection, Status } from '../../types'
import { ProgressBar } from './ProgressBar'
import { FileUploadArea } from './FileUploadArea'
import { useToast } from "@/components/ui/use-toast"

interface CollectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (collection: Collection) => void
  initialData?: Collection | null
}

export const CollectionDialog: React.FC<CollectionDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Collection>({
    id: '',
    title: '',
    description: '',
    createdDate: new Date(),
    videoFiles: [],
    audioFiles: [],
    bvhFile: null,
    auxFiles: {},
    progress: {
      labeling: 'not-started',
      rating: 'not-started',
      validated: 'not-started'
    }
  })

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {
        id: '',
        title: '',
        description: '',
        createdDate: new Date(),
        videoFiles: [],
        audioFiles: [],
        bvhFile: null,
        auxFiles: {},
        progress: {
          labeling: 'not-started',
          rating: 'not-started',
          validated: 'not-started'
        }
      })
    }
  }, [isOpen, initialData])

  const handleSubmit = () => {
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Collection title is required",
        variant: "destructive"
      })
      return
    }

    onSave({
      ...formData,
      id: formData.id || Date.now().toString(),
      createdDate: formData.createdDate || new Date()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-[#1A1A1A] border border-[#604abd] w-[calc(100vw-32rem)] max-w-[1200px] max-h-[90vh] flex flex-col overflow-hidden rounded-lg"
        aria-describedby="collection-dialog-description"
      >
        <div id="collection-dialog-description" className="sr-only">
          Dialog for creating or editing a collection
        </div>
        <DialogHeader className="border-b border-[#604abd] px-6 py-4 shrink-0">
          <div className="flex items-center justify-between w-full relative">
            <DialogTitle className="text-[#E5E7EB] text-xl">
              {initialData ? 'Edit Collection' : 'New Collection'}
            </DialogTitle>
            <DialogClose className="p-1 hover:bg-white/10 rounded-full">
              <X className="h-5 w-5 text-white" />
            </DialogClose>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            <div>
              <Label className="text-[#E5E7EB]">Collection Title</Label>
              <Input 
                className="bg-gray-700 text-white border-gray-600"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-[#E5E7EB]">Description</Label>
              <Textarea 
                className="bg-gray-700 text-white border-gray-600 min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-[#E5E7EB]">Creation Date</Label>
              <div className="flex items-center mt-2">
                <Input
                  type="date"
                  value={formData.createdDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData(prev => ({ ...prev, createdDate: new Date(e.target.value) }))}
                  className="bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              {(['labeling', 'rating', 'validated'] as const).map(category => (
                <div key={category} className="space-y-2">
                  <Label className="text-[#E5E7EB] capitalize">{category} Status</Label>
                  <Select
                    value={formData.progress[category]}
                    onValueChange={(value: Status) => setFormData(prev => ({
                      ...prev,
                      progress: {
                        ...prev.progress,
                        [category]: value
                      }
                    }))}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="not-started" className="text-gray-900 hover:bg-gray-100">Not Started</SelectItem>
                      <SelectItem value="in-progress" className="text-gray-900 hover:bg-gray-100">In Progress</SelectItem>
                      <SelectItem value="completed" className="text-gray-900 hover:bg-gray-100">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <ProgressBar status={formData.progress[category]} />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-[#E5E7EB]">Video Files (Max 5)</Label>
                <FileUploadArea
                  files={formData.videoFiles}
                  onFilesChange={(files) => setFormData(prev => ({
                    ...prev,
                    videoFiles: files
                  }))}
                  maxFiles={5}
                  accept="video/*"
                />
              </div>

              <div>
                <Label className="text-[#E5E7EB]">Audio Files (Max 5)</Label>
                <FileUploadArea
                  files={formData.audioFiles}
                  onFilesChange={(files) => setFormData(prev => ({
                    ...prev,
                    audioFiles: files
                  }))}
                  maxFiles={5}
                  accept="audio/*"
                />
              </div>

              <div>
                <Label className="text-[#E5E7EB]">BVH Sensor File</Label>
                <FileUploadArea
                  files={formData.bvhFile ? [formData.bvhFile] : []}
                  onFilesChange={(files) => setFormData(prev => ({
                    ...prev,
                    bvhFile: files[0] || null
                  }))}
                  maxFiles={1}
                  accept=".bvh"
                />
              </div>

              {[1, 2, 3, 4, 5].map(num => (
                <div key={num}>
                  <Label className="text-[#E5E7EB]">AUX Sensor {num}</Label>
                  <FileUploadArea
                    files={formData.auxFiles[num] ? [formData.auxFiles[num]!] : []}
                    onFilesChange={(files) => setFormData(prev => ({
                      ...prev,
                      auxFiles: {
                        ...prev.auxFiles,
                        [num]: files[0] || null
                      }
                    }))}
                    maxFiles={1}
                    accept=".aux,.csv,.txt"
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="border-t border-[#604abd] px-6 py-4 mt-auto shrink-0">
          <Button 
            className="w-full bg-gradient-to-r from-[#604abd] to-[#d84bf7] hover:from-[#7059c4] hover:to-[#de65f7]"
            onClick={handleSubmit}
          >
            {initialData ? 'Save Changes' : 'Create Collection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 