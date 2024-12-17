import { forwardRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl?: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ videoUrl }, ref) => {
    useEffect(() => {
      console.log('VideoPlayer received URL:', videoUrl);
    }, [videoUrl]);

    return (
      <div className="relative flex-1 bg-black">
        <video
          ref={ref}
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-contain"
          playsInline
          preload="auto"
          onLoadedData={() => console.log('Video loaded successfully')}
          onError={(e) => console.error('Video error:', e)}
          style={{ visibility: 'visible' }}
        />
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer'; 