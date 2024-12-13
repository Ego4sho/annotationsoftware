import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FileSelectionDialog } from "./FileSelectionDialog"
import { VideoPlayerContainer } from "@/app/labeling/components/VideoPlayerContainer"

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
    <div className="flex h-screen bg-black">
      <div className="flex-1 flex flex-col gap-4 p-4">
        {/* Top Section */}
        <div className="h-[45%] flex gap-4">
          {/* Video Player */}
          <div className="w-1/2">
            <VideoPlayerContainer />
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1 rounded">Test Label 1</div>

      <FileSelectionDialog
        open={isFileSelectionOpen}
        onOpenChange={setIsFileSelectionOpen}
        onFileSelect={handleFileSelect}
      />
    </div>
  )
}