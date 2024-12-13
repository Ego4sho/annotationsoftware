import { forwardRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoUrl?: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ videoUrl }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      console.log('VideoPlayer received URL:', videoUrl);
      if (videoUrl) {
        setIsLoading(true);
        setError(null);
      }
    }, [videoUrl]);

    const handleError = (e: any) => {
      console.error('Video error:', e);
      setError('Error loading video. Please try again.');
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      console.log('Video loaded successfully');
      setIsLoading(false);
      setError(null);
      
      // Ensure video is visible and ready for frame display
      const video = ref as React.MutableRefObject<HTMLVideoElement>;
      if (video.current) {
        video.current.style.opacity = '1';
      }
    };

    return (
      <div className="h-full w-full bg-[#1E1E1E] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {videoUrl ? (
            <>
              <video
                ref={ref}
                src={videoUrl}
                className="max-w-[90%] max-h-[90%] object-contain"
                controlsList="nodownload"
                playsInline
                onError={handleError}
                onLoadedData={handleLoadedData}
                onSeeking={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.style.opacity = '1';
                }}
                onSeeked={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.style.opacity = '1';
                }}
                onPause={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.style.opacity = '1';
                }}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  opacity: 1,
                  willChange: 'opacity'
                }}
                preload="auto"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white">Loading video...</div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-red-500">{error}</div>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-400">
              No video selected
            </div>
          )}
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer'; 