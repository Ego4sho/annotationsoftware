import { useState, useRef, useEffect } from 'react';
import { LabelingInterfaceState, Session, Category } from '../types';

// Mock data
const mockSessions: Session[] = [
  { id: '1', name: 'Session 1', date: '2023-06-20', duration: '00:30:00', fileTypes: ['MP4', 'MP3', 'BVH'] },
  { id: '2', name: 'Session 2', date: '2023-06-21', duration: '00:45:00', fileTypes: ['MP4', 'MP3', 'BVH'] },
  { id: '3', name: 'Session 3', date: '2023-06-22', duration: '01:00:00', fileTypes: ['MP4', 'MP3', 'BVH'] },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Jumps', steps: ['Single', 'Double', 'Triple', 'Quad'] },
  { id: '2', name: 'Spins', steps: ['Upright', 'Sit', 'Camel', 'Layback'] },
  { id: '3', name: 'Footwork', steps: ['Twizzles', 'Choctaws', 'Mohawks', 'Three-turns'] },
  { id: '4', name: 'Lifts', steps: ['Stationary', 'Straight Line', 'Curve', 'Rotational'] },
];

export const useLabelingInterface = () => {
  // State management
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedSession, setSelectedSession] = useState<Session>(mockSessions[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quickTags, setQuickTags] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isTimelineLocked, setIsTimelineLocked] = useState(false);
  const [isChannelViewExpanded, setIsChannelViewExpanded] = useState(false);
  const [allChannels] = useState(Array.from({ length: 126 }, (_, i) => `Channel ${i + 1}`));
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedQuickTag, setSelectedQuickTag] = useState<string | null>(null);
  const [isQuickLabelDeleteMode, setIsQuickLabelDeleteMode] = useState(false);
  const [isStepDeleteMode, setIsStepDeleteMode] = useState(false);
  const [isStepTypeCardCollapsed, setIsStepTypeCardCollapsed] = useState(false);
  const [newStepName, setNewStepName] = useState('');
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [timeDisplayMode, setTimeDisplayMode] = useState<'time' | 'frame'>('time');
  const [isFlagSelected, setIsFlagSelected] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Format timecode helper function
  const formatTimecode = (time: number) => {
    if (timeDisplayMode === 'frame') {
      return Math.floor(time * 30).toString().padStart(5, '0');
    }
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * 30);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  // Event handlers
  const handlePlayPause = () => setIsPlaying(prev => !prev);
  const handleSeek = (newTime: number) => setCurrentTime(newTime);
  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => Math.max(0.5, Math.min(4, prev + (direction === 'in' ? 0.1 : -0.1))));
  };
  const handleTimeDisplayModeToggle = (value: 'time' | 'frame') => {
    setTimeDisplayMode(value);
  };
  const handleChannelViewToggle = () => {
    setIsChannelViewExpanded(prev => !prev);
  };
  const handleChannelSelect = (checked: boolean, channel: string) => {
    setSelectedChannels(prev => 
      checked ? [...prev, channel] : prev.filter(ch => ch !== channel)
    );
  };
  const handleQuickLabelDeleteModeToggle = () => {
    setIsQuickLabelDeleteMode(prev => !prev);
  };
  const handleAddQuickTag = (step: string) => {
    setQuickTags(prev => [...prev, step]);
  };
  const handleDeleteStep = (categoryId: string, step: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, steps: category.steps.filter(s => s !== step) }
        : category
    ));
  };
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newId = (categories.length + 1).toString();
      setCategories(prev => [...prev, { 
        id: newId, 
        name: newCategoryName.trim(), 
        steps: [] 
      }]);
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };
  const handleDeleteQuickTag = (tag: string) => {
    setQuickTags(prev => prev.filter(t => t !== tag));
  };
  const handleQuickTagSelect = (tag: string) => {
    setSelectedQuickTag(tag);
  };
  const handleFlagToggle = () => {
    setIsFlagSelected(prev => !prev);
  };
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  const handleStepTypeCardCollapse = () => {
    setIsStepTypeCardCollapsed(prev => !prev);
  };
  const handleTimelineLockToggle = () => {
    setIsTimelineLocked(prev => !prev);
  };
  const handleSessionSelect = (sessionId: string) => {
    const session = mockSessions.find(s => s.id === sessionId);
    if (session) setSelectedSession(session);
  };
  const handleSearchClear = () => {
    setSearchTerm('');
  };
  const handleAddCategoryClick = () => {
    setIsAddingCategory(true);
  };
  const handleAddCategoryCancel = () => {
    setIsAddingCategory(false);
  };
  const handleNewCategoryNameChange = (value: string) => {
    setNewCategoryName(value);
  };
  const handleStepDeleteModeToggle = () => {
    setIsStepDeleteMode(prev => !prev);
  };
  const handleCategorySelect = (id: string | null) => {
    setSelectedCategory(id);
  };
  const handleAddStepClick = () => {
    setIsAddingStep(true);
  };
  const handleNewStepNameChange = (value: string) => {
    setNewStepName(value);
  };
  const handleAddStepCancel = () => {
    setIsAddingStep(false);
  };
  const handleAddStep = () => {
    if (newStepName && selectedCategory) {
      setCategories(prev => prev.map(category => 
        category.id === selectedCategory
          ? { ...category, steps: [...category.steps, newStepName.trim()] }
          : category
      ));
      setNewStepName(''); // Clear the input
      setIsAddingStep(false); // Close the dialog
    }
  };
  const handleDeleteCategory = (categoryId: string) => {
    // First, clear selected category if it's the one being deleted
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
    
    // Then filter out the category
    setCategories(prev => {
      const updatedCategories = prev.filter(category => category.id !== categoryId);
      // If no categories left, ensure we're not in delete mode
      if (updatedCategories.length === 0) {
        setIsStepDeleteMode(false);
      }
      return updatedCategories;
    });
    
    // Exit delete mode after deletion
    setIsStepDeleteMode(false);
  };

  return {
    // State
    currentTime,
    duration,
    isPlaying,
    zoomLevel,
    selectedSession,
    selectedCategory,
    quickTags,
    selectedChannels,
    searchTerm,
    isAddCategoryModalOpen,
    newCategoryName,
    isTimelineLocked,
    isChannelViewExpanded,
    allChannels,
    isDeleteMode,
    categories,
    selectedQuickTag,
    isQuickLabelDeleteMode,
    isStepDeleteMode,
    isStepTypeCardCollapsed,
    newStepName,
    isAddingStep,
    isAddingCategory,
    timeDisplayMode,
    isFlagSelected,
    sessions: mockSessions,

    // Event handlers
    onPlayPause: handlePlayPause,
    onSeek: handleSeek,
    onZoom: handleZoom,
    onTimeDisplayModeToggle: handleTimeDisplayModeToggle,
    onChannelViewToggle: handleChannelViewToggle,
    onChannelSelect: handleChannelSelect,
    onQuickLabelDeleteModeToggle: handleQuickLabelDeleteModeToggle,
    onAddQuickTag: handleAddQuickTag,
    onDeleteStep: handleDeleteStep,
    onAddCategory: handleAddCategory,
    onDeleteQuickTag: handleDeleteQuickTag,
    onQuickTagSelect: handleQuickTagSelect,
    onFlagToggle: handleFlagToggle,
    onSearchChange: handleSearchChange,
    formatTimecode,
    onStepTypeCardCollapse: handleStepTypeCardCollapse,
    onTimelineLockToggle: handleTimelineLockToggle,
    onSessionSelect: handleSessionSelect,
    onSearchClear: handleSearchClear,
    onAddCategoryClick: handleAddCategoryClick,
    onAddCategoryCancel: handleAddCategoryCancel,
    onNewCategoryNameChange: handleNewCategoryNameChange,
    onStepDeleteModeToggle: handleStepDeleteModeToggle,
    onCategorySelect: handleCategorySelect,
    onAddStepClick: handleAddStepClick,
    onNewStepNameChange: handleNewStepNameChange,
    onAddStepCancel: handleAddStepCancel,
    onAddStep: handleAddStep,
    setIsQuickLabelDeleteMode,
    onDeleteCategory: handleDeleteCategory,

    // Refs
    videoRef,
    canvasRef,
    timelineRef,
  };
}; 