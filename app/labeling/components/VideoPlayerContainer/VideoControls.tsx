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
import { useState, useEffect, useRef } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
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

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onSeek(Math.max(0, Math.min(duration, newTime)));
  };

  const handleTimelineDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onSeek(Math.max(0, Math.min(duration, newTime)));
  };

  const handleFrameStep = (forward: boolean) => {
    const frameTime = 1 / FPS;
    const newTime = currentTime + (forward ? frameTime : -frameTime);
    onSeek(Math.max(0, Math.min(duration, newTime)));
  };

  return (
    <div className="p-2 space-y-2 bg-[#1E1E1E]">
      <div className="flex items-center justify-between h-6">
        <div className="flex items-center gap-1">
          <button
            onClick={onPlayPause}
            className="p-0.5 hover:bg-black/20 rounded text-white/80"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button 
            className="p-0.5 hover:bg-black/20 rounded text-white/80"
            onClick={() => handleFrameStep(false)}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            className="p-0.5 hover:bg-black/20 rounded text-white/80"
            onClick={() => handleFrameStep(true)}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-0.5 hover:bg-black/20 rounded text-white/80">
            <ChevronsRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={onMuteToggle}
              className="p-0.5 hover:bg-black/20 rounded text-white/80"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <div className="w-16">
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="h-1"
              />
            </div>
          </div>
        </div>
        <button
          onClick={toggleTimeDisplay}
          className="text-white/80 text-xs font-mono hover:text-white transition-colors duration-200 cursor-pointer bg-black/20 px-1.5 py-0.5 rounded"
        >
          {showFrames ? formatFrameCount(currentTime) : formatTime(currentTime)}
        </button>
        <Select
          value={playbackRate.toString()}
          onValueChange={(value) => onPlaybackRateChange(parseFloat(value))}
        >
          <SelectTrigger className="w-16 h-6 bg-white text-black border-0 text-xs">
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
        {/* Timeline */}
        <div 
          ref={timelineRef}
          className="relative h-8 bg-[#2A2A2A] rounded cursor-pointer select-none"
          onClick={handleTimelineClick}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleTimelineDrag}
        >
          {/* Time markers */}
          <div className="absolute top-0 left-0 right-0 h-3 flex">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="flex-1 border-l border-gray-600 h-1.5">
                <div className="text-[8px] text-gray-400 mt-1.5 -ml-[8px]">
                  {formatTime(duration * (i / 10))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Playhead */}
          <div 
            className="absolute bottom-0 w-0.5 h-full bg-[#604abd] pointer-events-none"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-[#604abd] rounded-full" />
          </div>
          
          {/* Progress bar */}
          <div 
            className="absolute bottom-0 left-0 h-5 bg-[#604abd] opacity-20"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-[10px] text-white/60">
          <span>{showFrames ? formatFrameCount(currentTime) : formatTime(currentTime)}</span>
          <span>{showFrames ? formatFrameCount(duration) : formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
} 