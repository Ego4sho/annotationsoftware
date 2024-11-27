// Core data types
export interface Session {
  id: string;
  name: string;
  date: string;
  duration: string;
  fileTypes: string[];
}

export interface Category {
  id: string;
  name: string;
  steps: string[];
}

// State interface for the logic hook
export interface LabelingInterfaceState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  zoomLevel: number;
  selectedSession: Session;
  selectedCategory: string | null;
  quickTags: string[];
  selectedChannels: string[];
  searchTerm: string;
  isAddCategoryModalOpen: boolean;
  newCategoryName: string;
  isTimelineLocked: boolean;
  isChannelViewExpanded: boolean;
  allChannels: string[];
  isDeleteMode: boolean;
  categories: Category[];
  selectedQuickTag: string | null;
  isQuickLabelDeleteMode: boolean;
  isStepDeleteMode: boolean;
  isStepTypeCardCollapsed: boolean;
  newStepName: string;
  isAddingStep: boolean;
  isAddingCategory: boolean;
  timeDisplayMode: 'time' | 'frame';
  isFlagSelected: boolean;
}

// Props interface for the UI component
export interface LabelingInterfaceProps extends LabelingInterfaceState {
  onPlayPause: () => void;
  onSeek: (newTime: number) => void;
  onZoom: (direction: 'in' | 'out') => void;
  onAddQuickTag: (step: string) => void;
  onDeleteStep: (categoryId: string, step: string) => void;
  onAddCategory: () => void;
  onDeleteQuickTag: (tag: string) => void;
  onQuickTagSelect: (tag: string) => void;
  onChannelSelect: (checked: boolean, channel: string) => void;
  onChannelViewToggle: () => void;
  onTimeDisplayModeToggle: (value: 'time' | 'frame') => void;
  onFlagToggle: () => void;
  onSearchChange: (value: string) => void;
  formatTimecode: (time: number) => string;
  onStepTypeCardCollapse: () => void;
  onTimelineLockToggle: () => void;
  onSessionSelect: (sessionId: string) => void;
  onSearchClear: () => void;
  onAddCategoryClick: () => void;
  onAddCategoryCancel: () => void;
  onNewCategoryNameChange: (value: string) => void;
  onStepDeleteModeToggle: () => void;
  onCategorySelect: (id: string | null) => void;
  onAddStepClick: () => void;
  onNewStepNameChange: (value: string) => void;
  onAddStepCancel: () => void;
  sessions: Session[];
  onAddStep: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  timelineRef: React.RefObject<HTMLDivElement>;
  setIsQuickLabelDeleteMode: (value: boolean) => void;
  onQuickLabelDeleteModeToggle: () => void;
  onDeleteCategory: (categoryId: string) => void;
} 