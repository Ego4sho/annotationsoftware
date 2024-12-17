import React, { useState, useEffect } from 'react';
import { LabelingInterfaceUI } from './LabelingInterfaceUI';
import { useVideoTimeSync } from '../hooks/useVideoTimeSync';

export const LabelingInterfaceContainer: React.FC = () => {
  const timeSync = useVideoTimeSync();
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>();

  // Debug logging for container state
  useEffect(() => {
    console.log('LabelingInterfaceContainer State:', {
      selectedVideoUrl,
      timeSync: {
        currentTime: timeSync.currentTime,
        duration: timeSync.duration,
        isPlaying: timeSync.isPlaying
      }
    });
  }, [selectedVideoUrl, timeSync.currentTime, timeSync.duration, timeSync.isPlaying]);

  const handleFileSelect = async (fileType: string, fileId: string) => {
    try {
      console.log('File selected:', { fileType, fileId });
      setSelectedVideoUrl(undefined); // Reset URL when new file is selected
      
      // TODO: Implement actual file selection logic
      // For testing, set a dummy video URL after a delay
      setTimeout(() => {
        const testUrl = 'path/to/test/video.mp4';
        setSelectedVideoUrl(testUrl);
        console.log('Test video URL set:', testUrl);
      }, 1000);
    } catch (error) {
      console.error('Error in file selection:', error);
    }
  };

  const handleSeek = (time: number) => {
    try {
      console.log('Seek requested:', time);
      if (timeSync.handleSeek) {
        timeSync.handleSeek(time);
      }
    } catch (error) {
      console.error('Error in seek handler:', error);
    }
  };

  const handleTimeUpdate = (time: number) => {
    try {
      console.log('Time update:', time);
      timeSync.updateTime(time);
    } catch (error) {
      console.error('Error in time update handler:', error);
    }
  };

  const handleDurationChange = (duration: number) => {
    try {
      console.log('Duration change:', duration);
      timeSync.updateDuration(duration);
    } catch (error) {
      console.error('Error in duration change handler:', error);
    }
  };

  const handlePlayPause = (playing: boolean) => {
    try {
      console.log('Play/Pause toggled:', playing);
      timeSync.togglePlay(playing);
    } catch (error) {
      console.error('Error in play/pause handler:', error);
    }
  };

  return (
    <LabelingInterfaceUI
      currentTime={timeSync.currentTime}
      duration={timeSync.duration}
      isPlaying={timeSync.isPlaying}
      onTimeUpdate={handleTimeUpdate}
      onDurationChange={handleDurationChange}
      onSeek={handleSeek}
      onPlayPause={handlePlayPause}
      selectedVideoUrl={selectedVideoUrl}
      onFileSelect={handleFileSelect}
      // ... other props
    />
  );
}; 