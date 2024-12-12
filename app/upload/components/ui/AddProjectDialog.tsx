import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectData: {
    title: string;
    description: string;
  };
  onProjectDataChange: (data: {
    title: string;
    description: string;
  }) => void;
  onSubmit: () => void;
}

export const AddProjectDialog: React.FC<AddProjectDialogProps> = ({
  open,
  onOpenChange,
  projectData,
  onProjectDataChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px] h-[500px] bg-[#1A1A1A] border-[#604abd] p-0 flex flex-col"
        aria-describedby="project-dialog-description"
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-white">Add New Project</DialogTitle>
          <DialogDescription id="project-dialog-description" className="text-gray-400">
            Create a new project to organize your collections
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                value={projectData.title}
                onChange={(e) => onProjectDataChange({
                  ...projectData,
                  title: e.target.value
                })}
                placeholder="Enter project title"
                className="bg-[#262626] border-[#404040] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => onProjectDataChange({
                  ...projectData,
                  description: e.target.value
                })}
                placeholder="Enter project description"
                className="bg-[#262626] border-[#404040] text-white min-h-[100px]"
              />
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 mt-auto border-t border-[#404040]">
          <Button 
            onClick={onSubmit}
            className="w-full bg-[#604abd] hover:bg-[#4c3a9e] text-white"
          >
            Save Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 