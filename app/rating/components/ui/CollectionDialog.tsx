'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, X } from 'lucide-react'
import { Collection, Status } from '../types'
import { FileUploadArea } from './FileUploadArea'
import { ProgressBar } from './ProgressBar'

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
  console.log('Dialog rendered, isOpen:', isOpen);

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
        id: Date.now().toString(),
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

  const handleSave = () => {
    console.log('Saving form data:', formData);
    onSave(formData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-[#1A1A1A] border border-[#604abd] w-[90vw] max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-lg">
        <DialogHeader className="border-b border-[#604abd] px-6 py-4">
          <div className="flex items-center justify-between w-full relative">
            <Button variant="ghost" className="p-1 hover:bg-white/10 rounded-full">
              <Trash2 className="h-5 w-5 text-white" />
            </Button>
            <DialogTitle className="absolute left-1/2 transform -translate-x-1/2 text-[#E5E7EB] text-xl">
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

            {/* Add all other form fields here */}
          </div>
        </ScrollArea>

        <div className="border-t border-[#604abd] px-6 py-4">
          <Button 
            className="w-full bg-gradient-to-r from-[#604abd] to-[#d84bf7] hover:from-[#7059c4] hover:to-[#de65f7]"
            onClick={handleSave}
          >
            {initialData ? 'Save Changes' : 'Create Collection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 