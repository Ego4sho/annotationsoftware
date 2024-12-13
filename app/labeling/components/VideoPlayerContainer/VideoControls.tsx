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

  const handleFrameStep = (forward: boolean) => {
    const frameTime = 1 / FPS;
    onSeek(currentTime + (forward ? frameTime : -frameTime));
  };

  const handlePlayPauseClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add a small delay to ensure the video state is updated properly
    setTimeout(() => {
      onPlayPause();
    }, 0);
  }, [onPlayPause]);

  return (
    <div className="p-2 space-y-1 bg-[#1E1E1E]">
      {/* Timeline scrubber */}
      <div className="relative h-8 bg-[#2A2A2A] rounded-sm group">
        {/* Progress bar */}
        <div 
          className="absolute top-0 left-0 h-full bg-[#604abd] opacity-30"
          style={{ width: `${(currentTime / (duration || 100)) * 100}%` }}
        />
        {/* Playhead line */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-[#604abd] z-10"
          style={{ left: `${(currentTime / (duration || 100)) * 100}%` }}
        />
        {/* Interactive slider */}
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={1/FPS} // Frame-by-frame precision
          onValueChange={handleProgressChange}
          className="absolute inset-0 opacity-0"
        />
        {/* Time tooltip */}
        <div className="absolute left-0 right-0 -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-xs text-white/80 py-1 px-2 rounded pointer-events-none">
          {showFrames ? formatFrameCount(currentTime) : formatTime(currentTime)}
        </div>
      </div>

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