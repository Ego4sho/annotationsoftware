'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { VideoControls } from './VideoControls';

interface VideoPlayerContainerProps {
  videoUrl?: string;
}

export function VideoPlayerContainer({ videoUrl }: VideoPlayerContainerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(video.currentTime);
      }
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => {
      setIsPlaying(false);
    };
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleRateChange = () => setPlaybackRate(video.playbackRate);
    const handleSeeking = () => setIsSeeking(true);
    const handleSeeked = () => {
      setIsSeeking(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('ratechange', handleRateChange);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('seeked', handleSeeked);

    // Set initial state
    video.playbackRate = playbackRate;

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('ratechange', handleRateChange);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [isSeeking]);

  useEffect(() => {
    console.log('VideoPlayerContainer - Video URL changed:', videoUrl);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [videoUrl]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
    } else {
      // Store current time before pausing
      const currentTime = video.currentTime;
      video.pause();
      // Force the video to maintain the current frame
      requestAnimationFrame(() => {
        if (video && video.paused) {
          video.currentTime = currentTime;
        }
      });
    }
  }, []);

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    setIsSeeking(true);
    video.currentTime = time;
  };

  const handleVolumeChange = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-indigo-500/20 bg-[#1E1E1E] overflow-hidden">
      <VideoPlayer
        ref={videoRef}
        videoUrl={videoUrl}
      />
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