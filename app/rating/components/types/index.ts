// Base Types
export interface Clip {
  id: number;
  title: string;
  thumbnail: string;
  rated: boolean;
  inProgress: boolean;
}

export interface Step {
  id: string;
  name: string;
  ratings: Rating[];
  totalClips: number;
  ratedClips: number;
}

export interface Rating {
  id: string;
  name: string;
  scaleStart: number;
  scaleEnd: number;
}

export interface NewRating {
  name: string;
  scaleStart: number;
  scaleEnd: number;
}

export interface EditingRating {
  id: string;
  name: string;
  scaleStart: number;
  scaleEnd: number;
}

export interface TimelineRow {
  id: string;
  label: string;
  type: 'video' | 'audio' | 'sensor';
}

// Component Props Types
export interface VideoPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  timeDisplayMode: string;
  onPlayPause: () => void;
  onTimeDisplayModeChange: (mode: string) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export interface ClipCardProps {
  clip: Clip;
  isActive?: boolean;
  isPending?: boolean;
  isCompleted?: boolean;
}

export interface StepCardProps {
  step: Step;
  onClick: () => void;
}

export interface RatingCardProps {
  rating: Rating;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  editingRating: EditingRating | null;
  setEditingRating: React.Dispatch<React.SetStateAction<EditingRating | null>>;
  handleEditRating: (rating: Rating) => void;
}

export interface RatingState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  timeDisplayMode: string;
  clips: Clip[];
  stepTypes: Step[];
  selectedStep: Step | null;
  selectedStepTitle: string;
  isAddingRating: boolean;
  newRating: NewRating;
  searchTerm: string;
  ratingPanelView: 'steps' | 'ratings' | 'rate';
  stepSearchTerm: string;
  selectedRatings: {[key: string]: number};
  isDeleteMode: boolean;
  isEditMode: boolean;
  editingRating: EditingRating | null;
  isClipSectionCollapsed: boolean;
  timelineRows: TimelineRow[];
  isChannelViewExpanded: boolean;
  selectedChannels: string[];
  ratingHistory: {[key: string]: number}[];
}

export interface RatingUIProps extends RatingState {
  videoRef: React.RefObject<HTMLVideoElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  filteredClips: Clip[];
  filteredSteps: Step[];
  onPlayPause: () => void;
  onAddRating: () => void;
  onTimeDisplayModeChange: (mode: string) => void;
  onSearchChange: (term: string) => void;
  onStepSearchChange: (term: string) => void;
  onStepSelect: (step: Step) => void;
  onRatingChange: (ratingId: string, value: number) => void;
  onDeleteRating: (ratingId: string) => void;
  onSaveRatings: () => void;
  onUndoRating: () => void;
  onChannelViewToggle: () => void;
  onChannelToggle: (channel: string) => void;
  onClipSectionToggle: () => void;
  onRatingPanelViewChange: (view: 'steps' | 'ratings' | 'rate') => void;
  onEditModeToggle: () => void;
  onDeleteModeToggle: () => void;
  formatTimecode: (time: number) => string;
  onEditRating: (rating: Rating) => void;
  onSetEditingRating: (rating: EditingRating | null) => void;
  editingRating: EditingRating | null;
} 