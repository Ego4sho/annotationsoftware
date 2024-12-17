import { useVideoTimeSync } from '../../hooks/useVideoTimeSync';

export const TimelineCardContainer: React.FC = () => {
  const timeSync = useVideoTimeSync();

  const handleSliderChange = (newTime: number) => {
    timeSync.updateTime(newTime);
  };

  return (
    <TimelineCardUI
      currentTime={timeSync.currentTime}
      duration={timeSync.duration}
      isPlaying={timeSync.isPlaying}
      onTimeChange={handleSliderChange}
    />
  );
}; 