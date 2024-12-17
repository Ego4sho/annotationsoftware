import { VideoPlayerContainer } from '../VideoPlayer/VideoPlayerContainer';
import { TimelineCardContainer } from '../TimelineCard/TimelineCardContainer';
import { useVideoTimeSync } from '../../hooks/useVideoTimeSync';

export const VideoViewContainer: React.FC = () => {
  const timeSync = useVideoTimeSync();

  return (
    <div>
      <VideoPlayerContainer />
      <TimelineCardContainer />
    </div>
  );
}; 