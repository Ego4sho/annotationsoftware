import { forwardRef } from 'react';

interface VideoPlayerProps {
  videoUrl?: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ videoUrl }, ref) => {
    return (
      <div className="flex-1 bg-[#1E1E1E] relative">
        {videoUrl ? (
          <video
            ref={ref}
            src={videoUrl}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No video selected
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer'; 