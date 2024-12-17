import { useState, useCallback } from 'react';

export interface VideoTimeSyncState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

export const useVideoTimeSync = () => {
  const [timeState, setTimeState] = useState<VideoTimeSyncState>({
    currentTime: 0,
    duration: 0,
    isPlaying: false
  });

  const updateTime = useCallback((time: number) => {
    setTimeState(prev => ({
      ...prev,
      currentTime: time
    }));
  }, []);

  const updateDuration = useCallback((duration: number) => {
    setTimeState(prev => ({
      ...prev,
      duration
    }));
  }, []);

  const togglePlay = useCallback((isPlaying: boolean) => {
    setTimeState(prev => ({
      ...prev,
      isPlaying
    }));
  }, []);

  return {
    ...timeState,
    updateTime,
    updateDuration,
    togglePlay
  };
}; 