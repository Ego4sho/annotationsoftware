import { ChevronLeft, ChevronRight, ChevronsRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '../utils/formatTime';
import { useState, useCallback } from 'react';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onPlaybackRateChange: (rate: number) => void;
}

export function VideoControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onPlaybackRateChange,
}: VideoControlsProps) {
  const [showFrames, setShowFrames] = useState(false);
  const FPS = 30; // Assuming 30 frames per second, adjust as needed

  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0]);
  };

  const formatFrameCount = (timeInSeconds: number) => {
    const frameNumber = Math.floor(timeInSeconds * FPS);
    return `Frame ${frameNumber}`;
  };

  const toggleTimeDisplay = () => {
    setShowFrames(!showFrames);
  };

  const handleFrameStep = (forward: boolean) => {
    const frameTime = 1 / FPS;
    const newTime = currentTime + (forward ? frameTime : -frameTime);
    onSeek(newTime);
  };

  const handlePlayPauseClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayPause();
  }, [onPlayPause]);

  return (
    <div className="p-2 space-y-1 bg-[#1E1E1E]">
      {/* Controls row */}
      <div className="flex items-center h-8 gap-1">
        <div className="flex items-center gap-1">
          <button
            onClick={handlePlayPauseClick}
            className="p-1 hover:bg-black/20 rounded text-white/80"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button 
            onClick={() => handleFrameStep(false)}
            className="p-1 hover:bg-black/20 rounded text-white/80"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleFrameStep(true)}
            className="p-1 hover:bg-black/20 rounded text-white/80"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-black/20 rounded text-white/80">
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={onMuteToggle}
            className="p-1 hover:bg-black/20 rounded text-white/80"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <div className="w-20">
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleTimeDisplay}
            className="text-xs font-mono text-white/80 hover:text-white bg-black/20 px-2 py-1 rounded"
          >
            {showFrames ? formatFrameCount(currentTime) : formatTime(currentTime)}
          </button>
          <Select
            value={playbackRate.toString()}
            onValueChange={(value) => onPlaybackRateChange(parseFloat(value))}
          >
            <SelectTrigger className="h-6 w-16 bg-black/20 text-white/80 border-0 text-xs">
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent className="bg-[#1E1E1E] text-white/80 border border-white/10">
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 