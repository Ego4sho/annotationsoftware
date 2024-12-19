import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformVisualizerProps {
  audioUrl: string;
  onReady?: () => void;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ audioUrl, onReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Handle seeking
  const handleSeek = useCallback((time: number) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.seekTo(time);
      setCurrentTime(time);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4a9eff',
      progressColor: '#1e88e5',
      cursorColor: '#1e88e5',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 100,
      normalize: true,
      responsive: true,
      fillParent: true,
      interact: true, // Enable interaction
      hideScrollbar: false,
      minPxPerSec: 50, // Minimum pixels per second of audio
    });

    // Load audio file
    wavesurfer.load(audioUrl);

    // Event handlers
    wavesurfer.on('ready', () => {
      console.log('WaveSurfer is ready');
      if (onReady) onReady();
    });

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    wavesurfer.on('finish', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    // Handle seeking
    wavesurfer.on('seek', (progress) => {
      const duration = wavesurfer.getDuration();
      const newTime = progress * duration;
      setCurrentTime(newTime);
    });

    // Handle audioprocess for updating current time
    wavesurfer.on('audioprocess', (currentTime) => {
      setCurrentTime(currentTime);
    });

    wavesurferRef.current = wavesurfer;

    // Cleanup
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioUrl, onReady]);

  const handlePlayPause = useCallback(() => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  }, [isPlaying]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Controls above waveform */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '15px'
      }}>
        <button 
          onClick={handlePlayPause}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: isPlaying ? '#ff4a4a' : '#4a9eff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      {/* Waveform */}
      <div ref={containerRef} style={{ 
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px'
      }} />

      {/* Time display */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 10px',
        fontSize: '14px',
        color: '#666'
      }}>
        <div style={{ minWidth: '60px' }}>
          {formatTime(currentTime)}
        </div>
        {wavesurferRef.current && (
          <div style={{ minWidth: '60px', textAlign: 'right' }}>
            {formatTime(wavesurferRef.current.getDuration() || 0)}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaveformVisualizer; 