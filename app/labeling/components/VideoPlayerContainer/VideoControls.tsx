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
import { useState } from 'react';

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

  const handleProgressChange = (value: number[]) => {
    onSeek(value[0]);
  };

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

  return (
    <div className="p-4 space-y-4 bg-[#1E1E1E]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className="p-1 hover:bg-black/20 rounded text-white/80"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <button className="p-1 hover:bg-black/20 rounded text-white/80">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1 hover:bg-black/20 rounded text-white/80">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="p-1 hover:bg-black/20 rounded text-white/80">
            <ChevronsRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onMuteToggle}
              className="p-1 hover:bg-black/20 rounded text-white/80"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <div className="w-24">
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
        <button
          onClick={toggleTimeDisplay}
          className="text-white/80 font-mono hover:text-white transition-colors duration-200 cursor-pointer bg-black/20 px-2 py-1 rounded"
        >
          {showFrames ? formatFrameCount(currentTime) : formatTime(currentTime)}
        </button>
        <Select
          value={playbackRate.toString()}
          onValueChange={(value) => onPlaybackRateChange(parseFloat(value))}
        >
          <SelectTrigger className="w-24 bg-white text-black border-0">
            <SelectValue placeholder="Speed" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            <SelectItem value="0.5">0.5x</SelectItem>
            <SelectItem value="1">1x</SelectItem>
            <SelectItem value="1.5">1.5x</SelectItem>
            <SelectItem value="2">2x</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.1}
          onValueChange={handleProgressChange}
        />
        <div className="flex justify-between text-xs text-white/60">
          <span>{showFrames ? formatFrameCount(currentTime) : formatTime(currentTime)}</span>
          <span>{showFrames ? formatFrameCount(duration) : formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
} 