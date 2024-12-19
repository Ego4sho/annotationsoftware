import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface AudioWaveformProps {
  audioUrl?: string;
  currentTime: number;
  duration: number;
  height: number;
  onSeek?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export interface AudioWaveformRef {
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
}

export const AudioWaveform = forwardRef<AudioWaveformRef, AudioWaveformProps>(({
  audioUrl,
  currentTime,
  duration,
  height,
  onSeek,
  onPlay,
  onPause
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startTimeRef = useRef(0);

  // Define event handlers at component level
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!wavesurferRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startTimeRef.current = wavesurferRef.current.getCurrentTime();
    containerRef.current?.classList.add('cursor-grabbing');
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !wavesurferRef.current) return;
    
    const deltaX = e.clientX - startXRef.current;
    const duration = wavesurferRef.current.getDuration();
    const containerWidth = containerRef.current?.clientWidth || 1;
    const timeShift = (deltaX / containerWidth) * duration * -1;
    
    const newTime = Math.max(0, Math.min(duration, startTimeRef.current + timeShift));
    wavesurferRef.current.seekTo(newTime / duration);
    if (onSeek) onSeek(newTime);
  }, [onSeek]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    containerRef.current?.classList.remove('cursor-grabbing');
  }, []);

  // Create and set up WaveSurfer instance
  useEffect(() => {
    let wavesurfer: WaveSurfer | null = null;
    let isDestroyed = false;

    const initializeWaveSurfer = async () => {
      if (!containerRef.current || !audioUrl) {
        console.log('Cannot initialize WaveSurfer:', {
          containerExists: !!containerRef.current,
          audioUrl: audioUrl,
          containerDimensions: containerRef.current?.getBoundingClientRect()
        });
        return;
      }

      // If we already have a wavesurfer instance, clean it up
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }

      try {
        console.log('Creating WaveSurfer instance with URL:', audioUrl);
        console.log('Container dimensions:', containerRef.current.getBoundingClientRect());
        
        // Reset states
        setIsReady(false);
        setLoadError(null);
        setIsPlaying(false);

        // Create AudioContext
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          console.log('Created new AudioContext:', audioContextRef.current.state);
        }

        // Create new instance
        wavesurfer = WaveSurfer.create({
          container: containerRef.current,
          waveColor: '#4a9eff',
          progressColor: '#1e88e5',
          cursorColor: '#1e88e5',
          barWidth: 2,
          barRadius: 3,
          cursorWidth: 2,
          height: height,
          normalize: true,
          fillParent: true,
          interact: true,
          backend: 'WebAudio',
          autoplay: false,
          minPxPerSec: 50,
          hideScrollbar: true,
          dragToSeek: true,
        });

        wavesurferRef.current = wavesurfer;

        // Set up event handlers before loading
        wavesurfer.on('ready', () => {
          if (!isDestroyed) {
            console.log('WaveSurfer is ready', {
              duration: wavesurfer?.getDuration(),
              containerDimensions: containerRef.current?.getBoundingClientRect()
            });
            setIsReady(true);
            wavesurfer?.setVolume(1.0);

            // Seek to current time if it's not at the start
            if (currentTime > 0) {
              const progress = currentTime / duration;
              wavesurfer.seekTo(progress);
            }
          }
        });

        // Add timeupdate event for more frequent time updates
        wavesurfer.on('timeupdate', () => {
          if (!isDestroyed && wavesurfer && onSeek) {
            const time = wavesurfer.getCurrentTime();
            if (!isNaN(time)) {
              onSeek(time);
            }
          }
        });

        // Add audioprocess event for continuous updates during playback
        wavesurfer.on('audioprocess', () => {
          if (!isDestroyed && wavesurfer && onSeek) {
            const time = wavesurfer.getCurrentTime();
            if (!isNaN(time)) {
              onSeek(time);
            }
          }
        });

        // Add a periodic time update during playback
        if (timeUpdateIntervalRef.current) {
          clearInterval(timeUpdateIntervalRef.current);
        }
        
        timeUpdateIntervalRef.current = setInterval(() => {
          if (!isDestroyed && wavesurfer && onSeek && isPlaying) {
            const time = wavesurfer.getCurrentTime();
            if (!isNaN(time)) {
              onSeek(time);
            }
          }
        }, 50); // Update every 50ms for smooth display

        wavesurfer.on('play', () => {
          if (!isDestroyed) {
            console.log('WaveSurfer play event triggered');
            setIsPlaying(true);
            if (onPlay) onPlay();
          }
        });

        wavesurfer.on('pause', () => {
          if (!isDestroyed) {
            console.log('WaveSurfer pause event triggered');
            setIsPlaying(false);
            if (onPause) onPause();
          }
        });

        wavesurfer.on('seeking', () => {
          if (!isDestroyed && wavesurfer && onSeek) {
            const time = wavesurfer.getCurrentTime();
            if (!isNaN(time)) {
              console.log('Seeking to:', time);
              onSeek(time);
            }
          }
        });

        wavesurfer.on('interaction', () => {
          if (!isDestroyed && wavesurfer && onSeek) {
            const time = wavesurfer.getCurrentTime();
            if (!isNaN(time)) {
              console.log('Interaction - seeking to:', time);
              onSeek(time);
            }
          }
        });

        wavesurfer.on('error', (error) => {
          if (!isDestroyed) {
            console.error('WaveSurfer error:', error);
            setLoadError(error.message || 'Error loading audio');
          }
        });

        // Load the audio file
        try {
          console.log('Loading audio file:', audioUrl);
          await wavesurfer.load(audioUrl);
          console.log('Audio file loading started');
        } catch (error) {
          console.error('Error loading audio file:', error);
          setLoadError('Error loading audio file');
        }

      } catch (error) {
        if (!isDestroyed) {
          console.error('Error initializing WaveSurfer:', error);
          setLoadError(error instanceof Error ? error.message : 'Error initializing audio');
        }
      }
    };

    initializeWaveSurfer();

    // Cleanup function
    return () => {
      isDestroyed = true;
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
      if (wavesurferRef.current) {
        console.log('Cleaning up WaveSurfer instance');
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [audioUrl, height]);

  // Handle play/pause functionality
  useImperativeHandle(ref, () => ({
    togglePlayPause: async () => {
      if (!wavesurferRef.current || !isReady) {
        console.log('AudioWaveform: Cannot toggle - wavesurfer not ready');
        return;
      }

      try {
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        if (isPlaying) {
          wavesurferRef.current.pause();
        } else {
          await wavesurferRef.current.play();
        }
      } catch (error) {
        console.error('AudioWaveform: Error during playback:', error);
      }
    },
    play: async () => {
      if (!wavesurferRef.current || !isReady) {
        console.log('AudioWaveform: Cannot play - wavesurfer not ready');
        return;
      }

      try {
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        await wavesurferRef.current.play();
      } catch (error) {
        console.error('AudioWaveform: Error during playback:', error);
      }
    },
    pause: () => {
      if (!wavesurferRef.current || !isReady) {
        console.log('AudioWaveform: Cannot pause - wavesurfer not ready');
        return;
      }

      try {
        wavesurferRef.current.pause();
      } catch (error) {
        console.error('AudioWaveform: Error during pause:', error);
      }
    },
    isPlaying
  }));

  // Update current time when it changes externally
  useEffect(() => {
    if (wavesurferRef.current && isReady && !isPlaying && duration > 0) {
      try {
        const currentProgress = Math.min(Math.max(currentTime / duration, 0), 1);
        if (!isNaN(currentProgress)) {
          console.log('AudioWaveform: Seeking to progress:', currentProgress);
          wavesurferRef.current.seekTo(currentProgress);
        }
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  }, [currentTime, duration, isPlaying, isReady]);

  return (
    <div className="w-full h-full relative" style={{ minHeight: height + 'px' }}>
      <div 
        ref={containerRef} 
        className="absolute inset-0" 
        style={{ visibility: 'visible', zIndex: 1 }} 
      />
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white" style={{ zIndex: 2 }}>
          Error: {loadError}
        </div>
      )}
    </div>
  );
}); 