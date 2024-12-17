'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { VideoControls } from './VideoControls';
import { Slider } from "@/components/ui/slider";

interface VideoPlayerContainerProps {
  videoUrl?: string;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onSeek?: (time: number) => void;
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  onPlayPause?: (playing: boolean) => void;
}

export function VideoPlayerContainer({ 
  videoUrl,
  onTimeUpdate,
  onDurationChange,
  onSeek,
  currentTime: externalCurrentTime,
  duration: externalDuration,
  isPlaying: externalIsPlaying,
  onPlayPause
}: VideoPlayerContainerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const lastFrameRef = useRef<number | null>(null);
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTime = useRef(Date.now());
  const updateThrottleMs = 16; // ~60fps
  const ignoreNextTimeUpdate = useRef(false);
  const isUserSeeking = useRef(false);
  const lastSeekTime = useRef<number>(0);

  // Sync with external time when not seeking
  useEffect(() => {
    if (typeof externalCurrentTime === 'number' && videoRef.current && !isSeeking && !isUserSeeking.current) {
      const timeDiff = Math.abs(videoRef.current.currentTime - externalCurrentTime);
      // Only sync if the difference is significant and we're not at the user's last seek position
      if (timeDiff > 0.1 && lastSeekTime.current !== videoRef.current.currentTime) {
        console.log('VideoPlayer time sync:', {
          current: videoRef.current.currentTime,
          external: externalCurrentTime,
          diff: timeDiff,
          lastSeekTime: lastSeekTime.current
        });
        
        ignoreNextTimeUpdate.current = true;
        videoRef.current.currentTime = externalCurrentTime;
        lastFrameRef.current = externalCurrentTime;
        setCurrentTime(externalCurrentTime);
      }
    }
  }, [externalCurrentTime, isSeeking]);

  // Sync with external duration
  useEffect(() => {
    if (typeof externalDuration === 'number') {
      setDuration(externalDuration);
    }
  }, [externalDuration]);

  // Sync with external play state
  useEffect(() => {
    if (typeof externalIsPlaying === 'boolean' && videoRef.current) {
      if (externalIsPlaying && videoRef.current.paused) {
        videoRef.current.play().catch(console.error);
      } else if (!externalIsPlaying && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      setIsPlaying(externalIsPlaying);
    }
  }, [externalIsPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (ignoreNextTimeUpdate.current) {
        ignoreNextTimeUpdate.current = false;
        return;
      }

      if (!isSeeking && !isUserSeeking.current) {
        const now = Date.now();
        const newTime = video.currentTime;
        
        // Only update if enough time has passed and there's a significant change
        if (now - lastUpdateTime.current >= updateThrottleMs && 
            Math.abs(newTime - (lastFrameRef.current || 0)) > 0.01) {
          setCurrentTime(newTime);
          lastFrameRef.current = newTime;
          lastUpdateTime.current = now;
          if (onTimeUpdate) onTimeUpdate(newTime);
        }
      }
    };

    const handleDurationChange = () => {
      const newDuration = video.duration;
      setDuration(newDuration);
      if (onDurationChange) onDurationChange(newDuration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (onPlayPause) onPlayPause(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (onPlayPause) onPlayPause(false);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleRateChange = () => setPlaybackRate(video.playbackRate);
    
    const handleSeeking = () => {
      setIsSeeking(true);
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
    
    const handleSeeked = () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
      const currentVideoTime = video.currentTime;
      lastFrameRef.current = currentVideoTime;
      lastSeekTime.current = currentVideoTime;
      
      // Use RAF to ensure smooth updates
      requestAnimationFrame(() => {
        setCurrentTime(currentVideoTime);
        if (onTimeUpdate) onTimeUpdate(currentVideoTime);
        
        // Small delay before resetting seeking state
        seekTimeoutRef.current = setTimeout(() => {
          setIsSeeking(false);
          isUserSeeking.current = false;
        }, 50);
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('ratechange', handleRateChange);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('ratechange', handleRateChange);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [onTimeUpdate, onDurationChange, onPlayPause, currentTime, isSeeking]);

  // Reset state when video URL changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      lastFrameRef.current = null;
      if (onTimeUpdate) onTimeUpdate(0);
      if (onDurationChange) onDurationChange(0);
      if (onPlayPause) onPlayPause(false);
    }
  }, [videoUrl, onTimeUpdate, onDurationChange, onPlayPause]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    console.log('VideoPlayer seeking to:', time);
    setIsSeeking(true);
    lastFrameRef.current = time;
    lastSeekTime.current = time;
    
    // Ignore the next timeupdate event since we're manually setting the time
    ignoreNextTimeUpdate.current = true;
    
    // Update video time
    video.currentTime = time;
    setCurrentTime(time);
    
    // Notify about the time update
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  }, [onTimeUpdate]);

  const handleVolumeChange = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
  }, []);

  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
  }, []);

  const handleProgressChange = useCallback((value: number[]) => {
    if (!value.length) return;
    const newTime = value[0];
    isUserSeeking.current = true;
    lastSeekTime.current = newTime;
    handleSeek(newTime);
  }, [handleSeek]);

  const handleProgressCommit = useCallback(() => {
    if (isUserSeeking.current) {
      // Ensure we maintain the last seek position
      const finalTime = lastSeekTime.current;
      handleSeek(finalTime);
      
      // Notify about the final time update
      if (onTimeUpdate) {
        onTimeUpdate(finalTime);
      }
      
      // Reset seeking state after a short delay
      setTimeout(() => {
        isUserSeeking.current = false;
      }, 50);
    }
  }, [handleSeek, onTimeUpdate]);

  return (
    <div className="flex flex-col h-full rounded-lg border border-indigo-500/20 bg-[#1E1E1E] overflow-hidden">
      <VideoPlayer
        ref={videoRef}
        videoUrl={videoUrl}
      />
      <div className="px-4 py-2">
        {/* Progress bar */}
        <div className="relative h-1.5 w-full bg-[#333333] rounded-full">
          {/* Progress indicator */}
          <div 
            className="absolute top-0 left-0 h-full bg-[#604abd] rounded-full"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
          {/* Scrubbing slider */}
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.01}
            onValueChange={handleProgressChange}
            onValueCommit={handleProgressCommit}
            className="absolute inset-0"
          />
        </div>
      </div>
      <VideoControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        playbackRate={playbackRate}
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
        onPlaybackRateChange={handlePlaybackRateChange}
      />
    </div>
  );
} 