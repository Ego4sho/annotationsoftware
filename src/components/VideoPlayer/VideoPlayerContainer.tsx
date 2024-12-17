import { useVideoTimeSync } from '../../hooks/useVideoTimeSync';

export const VideoPlayerContainer: React.FC = () => {
  const timeSync = useVideoTimeSync();
  
  const handleTimeUpdate = (time: number) => {
    timeSync.updateTime(time);
  };

  const handleDurationChange = (duration: number) => {
    timeSync.updateDuration(duration);
  };

  const handlePlayStateChange = (isPlaying: boolean) => {
    timeSync.togglePlay(isPlaying);
  };

  return (
    <VideoPlayerUI 
      currentTime={timeSync.currentTime}
      duration={timeSync.duration}
      isPlaying={timeSync.isPlaying}
      onTimeUpdate={handleTimeUpdate}
      onDurationChange={handleDurationChange}
      onPlayStateChange={handlePlayStateChange}
    />
  );
}; 