import React, { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  audioUrl?: string;
  currentTime: number;
  duration: number;
  height: number;
  color?: string;
  backgroundColor?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioUrl,
  currentTime,
  duration,
  height,
  color = '#604abd',
  backgroundColor = '#2A2A2A'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioUrl) return;

    const loadAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);
        setAudioBuffer(buffer);
        setError(null);
      } catch (err) {
        console.error('Error loading audio:', err);
        setError('Failed to load audio file');
      }
    };

    loadAudio();
  }, [audioUrl]);

  useEffect(() => {
    if (!canvasRef.current || !audioBuffer) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waveform
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / canvas.width);
    const amp = canvas.height / 2;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    for (let i = 0; i < canvas.width; i++) {
      let min = 1.0;
      let max = -1.0;
      
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      ctx.moveTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }

    ctx.stroke();

    // Draw playhead
    if (duration > 0) {
      const playheadX = (currentTime / duration) * canvas.width;
      ctx.beginPath();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, canvas.height);
      ctx.stroke();
    }
  }, [audioBuffer, currentTime, duration, height, color, backgroundColor]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  if (!audioUrl) {
    return (
      <div className="flex items-center justify-center h-full text-white/50">
        No audio file selected
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={height}
      className="w-full h-full"
    />
  );
}; 