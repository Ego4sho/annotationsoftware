import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FileSelectionDialog } from "./FileSelectionDialog"
import { VideoPlayerContainer } from "@/app/labeling/components/VideoPlayerContainer"
import { FolderOpen } from "lucide-react"
import { TimelineCard } from "@/app/labeling/components/TimelineCard"

interface LabelingInterfaceProps {
  onFileSelect: (fileType: string, fileId: string) => void
  selectedVideoUrl?: string
}

export function LabelingInterfaceUI({
  onFileSelect,
  selectedVideoUrl
}: LabelingInterfaceProps) {
  const [isFileSelectionOpen, setIsFileSelectionOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [isChannelViewExpanded, setIsChannelViewExpanded] = useState(false)

  const handleFileSelect = (fileType: string, fileId: string) => {
    console.log('LabelingInterfaceUI - Handling file selection:', { fileType, fileId });
    onFileSelect(fileType, fileId);
    setIsFileSelectionOpen(false);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const handleChannelViewToggle = () => {
    setIsChannelViewExpanded(!isChannelViewExpanded);
  };

  const handleRowReorder = (fromIndex: number, toIndex: number) => {
    setSelectedChannels(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
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
              <VideoPlayerContainer 
                videoUrl={selectedVideoUrl}
                onTimeUpdate={setCurrentTime}
                onDurationChange={setDuration}
              />
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="flex-1">
          <TimelineCard
            timelineRows={[]}
            isChannelViewExpanded={isChannelViewExpanded}
            selectedChannels={selectedChannels}
            allChannels={Array.from({ length: 126 }, (_, i) => `Channel ${i + 1}`)}
            onChannelViewToggle={handleChannelViewToggle}
            onChannelToggle={handleChannelToggle}
            onRowReorder={handleRowReorder}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
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