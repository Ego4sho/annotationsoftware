export interface Session {
  id: string;
  name: string;
  date: string;
  duration: string;
  fileTypes: string[];
}

export interface LabelingInterfaceProps {
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
  categories: any[];
  selectedQuickTag: string | null;
  isQuickLabelDeleteMode: boolean;
  isStepDeleteMode: boolean;
  isStepTypeCardCollapsed: boolean;
  newStepName: string;
  isAddingStep: boolean;
  isAddingCategory: boolean;
  timeDisplayMode: string;
  isFlagSelected: boolean;
  videoRef: React.RefObject<HTMLVideoElement> | null;
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  timelineRef: React.RefObject<HTMLDivElement> | null;
  onPlayPause: () => void;
  onSeek: () => void;
  onZoom: (direction: 'in' | 'out') => void;
  onAddQuickTag: (tag: string) => void;
  onDeleteStep: (categoryId: string, stepName: string) => void;
  onAddCategory: () => void;
  onDeleteQuickTag: (tag: string) => void;
  onQuickTagSelect: (tag: string) => void;
  onChannelSelect: (checked: boolean, channel: string) => void;
  onChannelViewToggle: () => void;
  onTimeDisplayModeToggle: (mode: string) => void;
  onFlagToggle: () => void;
  formatTimecode: (time: number) => string;
  onStepTypeCardCollapse: () => void;
  onTimelineLockToggle: () => void;
  onSessionSelect: (sessionId: string) => void;
  onSearchClear: () => void;
  onAddCategoryClick: () => void;
  onAddCategoryCancel: () => void;
  onNewCategoryNameChange: (name: string) => void;
  onStepDeleteModeToggle: () => void;
  onCategorySelect: (categoryId: string | null) => void;
  onAddStepClick: () => void;
  onNewStepNameChange: (name: string) => void;
  onAddStepCancel: () => void;
  onSearchChange: (term: string) => void;
  onQuickLabelDeleteModeToggle: () => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddStep: () => void;
  sessions: Session[];
} 