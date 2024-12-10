import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AddNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: { title: string; content: string }) => void
}

export const AddNoteDialog: React.FC<AddNoteDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave({ title, content })
      setTitle('')
      setContent('')
    }
  }

  const handleClose = () => {
    setTitle('')
    setContent('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1A1A1A] border border-[#604abd]">
        <DialogHeader>
          <DialogTitle className="text-[#E5E7EB]">Add Note</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-[#E5E7EB]">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
              placeholder="Enter note title..."
            />
          </div>
          
          <div>
            <Label className="text-[#E5E7EB]">Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-gray-700 text-white border-gray-600 min-h-[100px]"
              placeholder="Enter note content..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white"
            disabled={!title.trim() || !content.trim()}
          >
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 