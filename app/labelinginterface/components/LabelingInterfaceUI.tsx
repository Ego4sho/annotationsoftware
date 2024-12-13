import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FileSelectionDialog } from "./FileSelectionDialog"

interface LabelingInterfaceProps {
  onFileSelect: (fileType: string, fileId: string) => void
}

export function LabelingInterfaceUI({
  onFileSelect
}: LabelingInterfaceProps) {
  const [isFileSelectionOpen, setIsFileSelectionOpen] = useState(false)

  const handleFileSelect = (fileType: string, fileId: string) => {
    console.log('File selected:', { fileType, fileId });
    onFileSelect(fileType, fileId);
    setIsFileSelectionOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full rounded-lg border border-indigo-500/20 bg-[#1E1E1E] p-4 space-y-4">
        <Button 
          onClick={() => setIsFileSelectionOpen(true)}
          className="w-full py-2 px-4 bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white hover:from-[#7059c4] hover:to-[#de65f7] rounded-lg transition-all duration-300"
        >
          Select Files
        </Button>
      </div>

      <FileSelectionDialog
        open={isFileSelectionOpen}
        onOpenChange={setIsFileSelectionOpen}
        onFileSelect={handleFileSelect}
      />
    </div>
  )
}