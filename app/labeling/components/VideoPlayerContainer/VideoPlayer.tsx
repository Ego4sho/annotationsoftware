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
        
        // Validate URL
        try {
          new URL(videoUrl);
        } catch (e) {
          console.error('Invalid video URL:', e);
          setError('Invalid video URL format');
          setIsLoading(false);
          return;
        }
      }
    }, [videoUrl]);

    const handleError = (e: any) => {
      const videoElement = e.target as HTMLVideoElement;
      console.error('Video error details:', {
        error: e,
        networkState: videoElement.networkState,
        readyState: videoElement.readyState,
        currentSrc: videoElement.currentSrc,
        videoUrl: videoUrl
      });

      let errorMessage = 'Error loading video. Please try again.';
      
      switch (videoElement.networkState) {
        case HTMLMediaElement.NETWORK_EMPTY:
          errorMessage = 'Video source not initialized';
          break;
        case HTMLMediaElement.NETWORK_NO_SOURCE:
          errorMessage = 'Video source not found or not supported';
          break;
        case HTMLMediaElement.NETWORK_LOADING:
          errorMessage = 'Network error while loading video';
          break;
      }

      setError(errorMessage);
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      console.log('Video loaded successfully');
      setIsLoading(false);
      setError(null);
    };

    return (
      <div className="h-full w-full bg-[#1E1E1E] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {videoUrl ? (
            <>
              <video
                ref={ref}
                src={videoUrl}
                className="max-w-full max-h-full object-contain"
                controlsList="nodownload"
                playsInline
                onError={handleError}
                onLoadedData={handleLoadedData}
                style={{ width: '100%', height: '100%' }}
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