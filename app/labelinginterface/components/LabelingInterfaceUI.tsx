import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FileSelectionDialog } from "./FileSelectionDialog"
import { VideoPlayerContainer } from "@/app/labeling/components/VideoPlayerContainer"
import { FolderOpen } from "lucide-react"

interface LabelingInterfaceProps {
  onFileSelect: (fileType: string, fileId: string) => void
  selectedVideoUrl?: string
}

export function LabelingInterfaceUI({
  onFileSelect,
  selectedVideoUrl
}: LabelingInterfaceProps) {
  const [isFileSelectionOpen, setIsFileSelectionOpen] = useState(false)

  const handleFileSelect = (fileType: string, fileId: string) => {
    console.log('LabelingInterfaceUI - Handling file selection:', { fileType, fileId });
    onFileSelect(fileType, fileId);
    setIsFileSelectionOpen(false);
  };

  console.log('LabelingInterfaceUI - Current video URL:', selectedVideoUrl);

  return (
    <div className="flex h-screen bg-black">
      <div className="flex-1 flex flex-col gap-4 p-4">
        {/* Top Section */}
        <div className="h-[45%] flex gap-4">
          {/* Video Player */}
          <div className="w-1/2">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-2">
                <Button
                  onClick={() => setIsFileSelectionOpen(true)}
                  variant="outline"
                  className="text-white hover:bg-[#604abd]/20"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Select Files
                </Button>
              </div>
              <VideoPlayerContainer videoUrl={selectedVideoUrl} />
            </div>
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