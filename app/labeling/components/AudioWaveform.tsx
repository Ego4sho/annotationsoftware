import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface AudioWaveformProps {
  audioUrl?: string;
  storagePath?: string;
  currentTime: number;
  duration: number;
  height: number;
  onSeek?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onReady?: () => void;
}

export interface AudioWaveformRef {
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
}

export const AudioWaveform = forwardRef<AudioWaveformRef, AudioWaveformProps>((props, forwardedRef) => {
  const {
    audioUrl,
    storagePath,
    currentTime,
    duration,
    height,
    onSeek,
    onPlay,
    onPause,
    onReady
  } = props;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const hasSetupVisualization = useRef(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const addDebugInfo = (info: string) => {
    console.log('AudioWaveform Debug:', info);
  };

  // Initialize audio and visualization
  useEffect(() => {
    if (!audioUrl) {
      addDebugInfo('No audio URL');
      return;
    }

    let cleanup = false;

    const setupAudio = async () => {
      try {
        if (!audioRef.current) {
          addDebugInfo('No audio ref');
          return;
        }

        // Process Firebase URL
        let processedUrl = audioUrl;
        if (audioUrl.includes('firebasestorage.googleapis.com')) {
          const url = new URL(audioUrl);
          // Ensure we have alt=media parameter
          if (!url.searchParams.has('alt')) {
            url.searchParams.append('alt', 'media');
          }
          processedUrl = url.toString();
          addDebugInfo('Processed Firebase URL: ' + processedUrl);
        }

        // Try to fetch the audio file
        addDebugInfo('Fetching audio file...');
        const response = await fetch(processedUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        addDebugInfo('Content type from server: ' + contentType);

        // Get the audio data as blob
        const blob = await response.blob();
        addDebugInfo(`Received blob: size=${blob.size}, type=${blob.type}`);

        // Create a blob URL
        const blobUrl = URL.createObjectURL(
          new Blob([blob], { type: 'audio/mpeg' })
        );
        addDebugInfo('Created blob URL: ' + blobUrl);

        // Configure audio element
        audioRef.current.src = blobUrl;
        
        // Wait for metadata to load
        await new Promise((resolve, reject) => {
          if (!audioRef.current) {
            reject(new Error('No audio ref'));
            return;
          }
          
          const handleMetadata = () => {
            addDebugInfo('Metadata loaded');
            audioRef.current?.removeEventListener('loadedmetadata', handleMetadata);
            resolve(true);
          };
          
          const handleError = (e: Event) => {
            const audio = e.target as HTMLAudioElement;
            const error = audio.error;
            audioRef.current?.removeEventListener('error', handleError);
            reject(new Error(`Audio load error: ${error?.message || 'Unknown error'}`));
          };
          
          audioRef.current.addEventListener('loadedmetadata', handleMetadata);
          audioRef.current.addEventListener('error', handleError);
          audioRef.current.load();
        });

        addDebugInfo('Audio element configured and loaded');

        // Create audio context and analyzer
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        await audioContext.resume();
        addDebugInfo('Audio context created');

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.8;
        addDebugInfo(`Analyzer created with buffer length: ${analyser.frequencyBinCount}`);

        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        addDebugInfo('Audio nodes connected');

        if (cleanup) {
          URL.revokeObjectURL(blobUrl);
          return;
        }

        // Store refs
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        // Start visualization
        drawWaveform();
        addDebugInfo('Visualization started');

        // Set ready state
        setIsReady(true);
        if (onReady) onReady();

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        addDebugInfo('Error setting up audio: ' + errorMsg);
        setLoadError('Error setting up audio: ' + errorMsg);
        
        // Log additional error details
        if (error instanceof Error) {
          addDebugInfo('Error stack: ' + error.stack);
        }
      }
    };

    setupAudio();

    return () => {
      cleanup = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
        analyserRef.current = null;
      }
      if (audioRef.current) {
        const currentSrc = audioRef.current.src;
        if (currentSrc.startsWith('blob:')) {
          URL.revokeObjectURL(currentSrc);
        }
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
    };
  }, [audioUrl]);

  // Draw waveform visualization
  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) {
      addDebugInfo('Missing refs for visualization');
      addDebugInfo(`Canvas ref: ${!!canvasRef.current}, Analyser ref: ${!!analyserRef.current}`);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      addDebugInfo('Could not get canvas context');
      return;
    }

    // Set canvas dimensions if needed
    if (canvas.width !== canvas.offsetWidth) {
      canvas.width = canvas.offsetWidth;
      canvas.height = 48;
      addDebugInfo(`Canvas size set to ${canvas.width}x${canvas.height}`);
    }

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1A1A1A');
    gradient.addColorStop(1, '#262626');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get frequency data
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Draw frequency bars
    const barWidth = 2;
    const barSpacing = 1;
    const bars = Math.floor(canvas.width / (barWidth + barSpacing));
    const samplesPerBar = Math.floor(bufferLength / bars);

    ctx.fillStyle = '#8B5CF6';

    for (let i = 0; i < bars; i++) {
      let sum = 0;
      for (let j = 0; j < samplesPerBar; j++) {
        const index = i * samplesPerBar + j;
        if (index < bufferLength) {
          sum += dataArray[index];
        }
      }
      const average = sum / samplesPerBar;
      const barHeight = (average / 255) * canvas.height * 0.8;
      const x = i * (barWidth + barSpacing);
      const y = (canvas.height - barHeight) / 2;
      ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Draw playhead
    if (audioRef.current) {
      const progress = audioRef.current.currentTime / audioRef.current.duration;
      const playheadX = canvas.width * progress;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, playheadX, canvas.height);

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, canvas.height);
      ctx.stroke();
    }

    // Request next frame if playing
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    }
  };

  // Handle audio element events
  const handleCanPlay = async (e: React.SyntheticEvent<HTMLAudioElement>) => {
    addDebugInfo('Audio can play');
    
    // Set up visualization after audio is ready
    try {
      // Create new audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await audioContext.resume();
      addDebugInfo('Audio context created');

      // Create analyzer node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Smaller FFT for better performance
      analyser.smoothingTimeConstant = 0.8;
      addDebugInfo(`Analyzer created with buffer length: ${analyser.frequencyBinCount}`);

      // Connect audio element to analyzer
      if (!audioRef.current) {
        throw new Error('Audio element not available');
      }
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      addDebugInfo('Audio nodes connected');

      // Store refs
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Start visualization
      drawWaveform();
      addDebugInfo('Visualization started');
      
      // Set ready state after everything is set up
      setIsReady(true);
      if (onReady) onReady();
    } catch (error) {
      addDebugInfo('Error setting up visualization:');
      addDebugInfo(error instanceof Error ? error.message : String(error));
      setLoadError(`Failed to setup visualization: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    const error = audio.error;
    let errorMessage = 'Unknown error';
    
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'Loading aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'Audio decode error';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Audio format not supported';
          break;
        default:
          errorMessage = error.message || 'Unknown error';
      }
    }
    
    addDebugInfo(`Audio error: ${errorMessage} (code: ${error?.code})`);
    setLoadError(`Failed to load audio: ${errorMessage}`);
    
    // Log additional debugging information
    if (audio.src) {
      addDebugInfo(`Audio src: ${audio.src}`);
    }
    if (error) {
      addDebugInfo(`Error details: ${error.message}`);
    }
  };

  const handlePlay = () => {
    addDebugInfo('Audio playing');
    setIsPlaying(true);
    if (onPlay) onPlay();
    
    // Start visualization if needed
    if (!animationFrameRef.current && analyserRef.current) {
      addDebugInfo('Starting visualization on play');
      drawWaveform();
    } else {
      addDebugInfo(`Animation frame: ${!!animationFrameRef.current}, Analyser: ${!!analyserRef.current}`);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (onPause) onPause();
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = height;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  // Handle play/pause functionality
  useImperativeHandle(forwardedRef, () => ({
    togglePlayPause: async () => {
      if (!audioRef.current || !isReady) {
        addDebugInfo('Cannot toggle - not ready');
        return;
      }

      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
      } catch (error) {
        addDebugInfo('Playback error: ' + error);
      }
    },
    play: async () => {
      if (!audioRef.current || !isReady) return;
      try {
        await audioRef.current.play();
      } catch (error) {
        addDebugInfo('Play error: ' + error);
      }
    },
    pause: () => {
      if (!audioRef.current || !isReady) return;
      audioRef.current.pause();
    },
    isPlaying
  }));

  // Format time helper
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update visualization on time change
  useEffect(() => {
    if (!isPlaying || !analyserRef.current) return;

    const updateVisual = () => {
      drawWaveform();
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(updateVisual);
      }
    };

    addDebugInfo('Starting visualization update loop');
    updateVisual();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [isPlaying]);

  // Load audio source after element is mounted
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    
    addDebugInfo('Setting audio source');
    audioRef.current.src = audioUrl;
    audioRef.current.load();
  }, [audioUrl]);

  return (
    <div className="w-full flex flex-col" style={{ minHeight: '96px' }}>
      {/* Audio controls */}
      <div className="bg-[#262626] p-2 flex items-center gap-2">
        <button
          onClick={async () => {
            if (!audioRef.current || !isReady) {
              addDebugInfo('Cannot play - not ready');
              return;
            }
            try {
              if (isPlaying) {
                audioRef.current.pause();
              } else {
                await audioRef.current.play();
              }
            } catch (error) {
              addDebugInfo('Play error: ' + error);
            }
          }}
          className="p-2 rounded hover:bg-[#404040] text-white"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className="text-white text-sm">
          {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'} / 
          {audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}
        </div>
        
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          style={{ display: 'none' }}
          preload="auto"
          crossOrigin="anonymous"
          onLoadedMetadata={() => {
            addDebugInfo('Audio metadata loaded');
          }}
          onCanPlayThrough={() => {
            addDebugInfo('Audio can play through');
            setIsReady(true);
            if (onReady) onReady();
          }}
          onPlay={() => {
            addDebugInfo('Audio playing');
            setIsPlaying(true);
            if (onPlay) onPlay();
            // Start visualization if needed
            if (!animationFrameRef.current && analyserRef.current) {
              drawWaveform();
            }
          }}
          onPause={() => {
            addDebugInfo('Audio paused');
            setIsPlaying(false);
            if (onPause) onPause();
          }}
          onTimeUpdate={(e) => {
            if (onSeek) {
              onSeek((e.target as HTMLAudioElement).currentTime);
            }
          }}
          onError={(e) => {
            const audio = e.currentTarget;
            const error = audio.error;
            const errorMsg = error ? `Error code ${error.code}: ${error.message}` : 'Unknown error';
            addDebugInfo(`Audio error: ${errorMsg}`);
            setLoadError(`Failed to load audio: ${errorMsg}`);
            
            // Additional debugging
            addDebugInfo(`Audio source: ${audio.src}`);
            if (error) {
              addDebugInfo(`Error code: ${error.code}`);
              addDebugInfo(`Error message: ${error.message}`);
              
              // Log detailed error code information
              switch (error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                  addDebugInfo('Error type: Media load aborted');
                  break;
                case MediaError.MEDIA_ERR_NETWORK:
                  addDebugInfo('Error type: Network error');
                  break;
                case MediaError.MEDIA_ERR_DECODE:
                  addDebugInfo('Error type: Media decode error');
                  break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                  addDebugInfo('Error type: Media format not supported');
                  break;
                default:
                  addDebugInfo('Error type: Unknown');
              }
            }
          }}
        />
      </div>

      {/* Waveform visualization */}
      <div className="bg-[#1A1A1A] p-2 flex-1" style={{ minHeight: '48px', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{ 
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            height: '48px',
            width: 'calc(100% - 16px)',
            backgroundColor: '#1A1A1A'
          }}
          onClick={(e) => {
            if (!audioRef.current || !canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const seekTime = (x / rect.width) * audioRef.current.duration;
            audioRef.current.currentTime = seekTime;
            if (onSeek) onSeek(seekTime);
          }}
        />
      </div>

      {/* Debug info */}
      <div className="bg-[#1A1A1A] p-2 text-white text-xs">
        <div>Ready: {isReady ? 'Yes' : 'No'}</div>
        <div>Playing: {isPlaying ? 'Yes' : 'No'}</div>
        <div>Audio Context: {audioContextRef.current ? 'Yes' : 'No'}</div>
        <div>Analyzer: {analyserRef.current ? 'Yes' : 'No'}</div>
        <div>Canvas: {canvasRef.current ? 'Yes' : 'No'}</div>
        {loadError && <div className="text-red-500">Error: {loadError}</div>}
      </div>
    </div>
  );
});
