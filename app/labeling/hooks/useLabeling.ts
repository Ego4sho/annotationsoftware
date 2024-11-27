import { useState, useRef } from 'react';
import { Session } from '../types';

const mockSessions: Session[] = [
  {
    id: '1',
    name: 'Session 1',
    date: '2024-01-01',
    duration: '1:30:00',
    fileTypes: ['Video', 'Audio', 'Sensor']
  },
  {
    id: '2',
    name: 'Session 2',
    date: '2024-01-02',
    duration: '2:00:00',
    fileTypes: ['Video', 'Sensor']
  }
];

export const useLabeling = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState({
    currentTime: 0,
    duration: 100,
    isPlaying: false,
    zoomLevel: 1,
    selectedSession: mockSessions[0],
    selectedCategory: null as string | null,
    quickTags: ['Initial Position', 'Movement Start', 'Movement End', 'Final Position'],
    selectedChannels: ['Channel 1', 'Channel 2', 'Channel 3'],
    searchTerm: '',
    isAddCategoryModalOpen: false,
    newCategoryName: '',
    isTimelineLocked: false,
    isChannelViewExpanded: false,
    allChannels: Array.from({ length: 126 }, (_, i) => `Channel ${i + 1}`),
    isDeleteMode: false,
    categories: [
      {
        id: '1',
        name: 'Movement Phases',
        steps: ['Initial Position', 'Movement Start', 'Peak', 'Movement End']
      },
      {
        id: '2',
        name: 'Technical Elements',
        steps: ['Grip', 'Stance', 'Balance', 'Coordination']
      }
    ],
    selectedQuickTag: null as string | null,
    isQuickLabelDeleteMode: false,
    isStepDeleteMode: false,
    isStepTypeCardCollapsed: false,
    newStepName: '',
    isAddingStep: false,
    isAddingCategory: false,
    timeDisplayMode: 'time',
    isFlagSelected: false,
    sessions: mockSessions
  });

  // All handlers
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (state.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  };

  const handleSeek = () => {};
  const handleZoom = (direction: 'in' | 'out') => {
    setState(prev => ({
      ...prev,
      zoomLevel: direction === 'in' ? prev.zoomLevel * 1.2 : prev.zoomLevel / 1.2
    }));
  };

  const handleAddQuickTag = (tag: string) => {
    setState(prev => ({
      ...prev,
      quickTags: [...prev.quickTags, tag]
    }));
  };

  const handleDeleteStep = (categoryId: string, stepName: string) => {};
  const handleAddCategory = () => {};
  const handleDeleteQuickTag = (tagToDelete: string) => {
    setState(prev => ({
      ...prev,
      quickTags: prev.quickTags.filter(tag => tag !== tagToDelete)
    }));
  };

  const handleQuickTagSelect = (tag: string) => {
    setState(prev => ({
      ...prev,
      selectedQuickTag: tag
    }));
  };

  const handleChannelSelect = (checked: boolean, channel: string) => {
    setState(prev => ({
      ...prev,
      selectedChannels: checked 
        ? [...prev.selectedChannels, channel]
        : prev.selectedChannels.filter(ch => ch !== channel)
    }));
  };

  const handleChannelViewToggle = () => {
    setState(prev => ({
      ...prev,
      isChannelViewExpanded: !prev.isChannelViewExpanded
    }));
  };

  const handleTimeDisplayModeToggle = (mode: string) => {};
  const handleFlagToggle = () => {};
  const handleStepTypeCardCollapse = () => {};
  const handleTimelineLockToggle = () => {};
  const handleSessionSelect = (sessionId: string) => {};
  const handleSearchClear = () => {};
  const handleAddCategoryClick = () => {};
  const handleAddCategoryCancel = () => {};
  const handleNewCategoryNameChange = (name: string) => {};
  const handleStepDeleteModeToggle = () => {};
  const handleCategorySelect = (categoryId: string | null) => {};
  const handleAddStepClick = () => {};
  const handleNewStepNameChange = (name: string) => {};
  const handleAddStepCancel = () => {};
  const handleSearchChange = (term: string) => {};
  const handleQuickLabelDeleteModeToggle = () => {};
  const handleDeleteCategory = (categoryId: string) => {};
  const handleAddStep = () => {};

  const formatTimecode = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * 30);
    return state.timeDisplayMode === 'time'
      ? `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  return {
    state,
    videoRef,
    canvasRef,
    timelineRef,
    handlePlayPause,
    handleSeek,
    handleZoom,
    handleAddQuickTag,
    handleDeleteStep,
    handleAddCategory,
    handleDeleteQuickTag,
    handleQuickTagSelect,
    handleChannelSelect,
    handleChannelViewToggle,
    handleTimeDisplayModeToggle,
    handleFlagToggle,
    formatTimecode,
    handleStepTypeCardCollapse,
    handleTimelineLockToggle,
    handleSessionSelect,
    handleSearchClear,
    handleAddCategoryClick,
    handleAddCategoryCancel,
    handleNewCategoryNameChange,
    handleStepDeleteModeToggle,
    handleCategorySelect,
    handleAddStepClick,
    handleNewStepNameChange,
    handleAddStepCancel,
    handleSearchChange,
    handleQuickLabelDeleteModeToggle,
    handleDeleteCategory,
    handleAddStep
  };
}; 