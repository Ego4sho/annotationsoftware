import { useState, useCallback, useRef, useEffect } from 'react';

export const useVideoTimeSync = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isScrubbing = useRef(false);
  const lastUpdateTime = useRef(Date.now());
  const lastScrubTime = useRef(0);
  const shouldIgnoreNextUpdate = useRef(false);
  const updateThrottleMs = 16; // ~60fps
  const ignoreUpdatesUntil = useRef(0);

  // Debug logging
  useEffect(() => {
    console.log('VideoTimeSync State:', {
      currentTime,
      duration,
      isPlaying,
      isScrubbing: isScrubbing.current,
      lastScrubTime: lastScrubTime.current,
      shouldIgnoreNextUpdate: shouldIgnoreNextUpdate.current
    });
  }, [currentTime, duration, isPlaying]);

  const updateTime = useCallback((time: number) => {
    try {
      const now = Date.now();
      
      // If we're within the ignore window, don't update
      if (now < ignoreUpdatesUntil.current) {
        console.log('Ignoring update - within ignore window');
        return;
      }

      // Only update if enough time has passed
      if (now - lastUpdateTime.current >= updateThrottleMs) {
        setCurrentTime(time);
        lastUpdateTime.current = now;
        console.log('Time updated:', time);
      }
    } catch (error) {
      console.error('Error in updateTime:', error);
    }
  }, []);

  const updateDuration = useCallback((newDuration: number) => {
    try {
      setDuration(newDuration);
      console.log('Duration updated:', newDuration);
    } catch (error) {
      console.error('Error in updateDuration:', error);
    }
  }, []);

  const togglePlay = useCallback((playing: boolean) => {
    try {
      setIsPlaying(playing);
      console.log('Play state toggled:', playing);
    } catch (error) {
      console.error('Error in togglePlay:', error);
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    try {
      console.log('Seek initiated:', time);
      
      // Set the time immediately
      setCurrentTime(time);
      lastScrubTime.current = time;
      
      // Set a time window to ignore updates
      ignoreUpdatesUntil.current = Date.now() + 100; // Ignore updates for 100ms
      
      console.log('Seek completed:', time);
    } catch (error) {
      console.error('Error in handleSeek:', error);
    }
  }, []);

  return {
    currentTime,
    duration,
    isPlaying,
    updateTime,
    updateDuration,
    togglePlay,
    handleSeek,
  };
}; 