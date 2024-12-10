import { useState, useRef, useEffect, useMemo } from 'react';
import { RatingState, Clip, Step, Rating, NewRating, TimelineRow } from '../components/types';
import { mockClips, mockStepTypes, initialTimelineRows } from '../data/mockData';

export const useRating = () => {
  const [state, setState] = useState<RatingState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    timeDisplayMode: 'time',
    clips: mockClips,
    stepTypes: mockStepTypes,
    selectedStep: null,
    selectedStepTitle: '',
    isAddingRating: false,
    newRating: {
      name: '',
      scaleStart: 1,
      scaleEnd: 10
    },
    searchTerm: '',
    ratingPanelView: 'steps',
    stepSearchTerm: '',
    selectedRatings: {},
    isDeleteMode: false,
    isEditMode: false,
    editingRating: null,
    isClipSectionCollapsed: false,
    timelineRows: initialTimelineRows,
    isChannelViewExpanded: false,
    selectedChannels: [],
    ratingHistory: []
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoized derived state
  const filteredClips = useMemo(() => 
    state.clips.filter(clip => 
      clip.title.toLowerCase().includes(state.searchTerm.toLowerCase())
    )
  , [state.clips, state.searchTerm]);

  const filteredSteps = useMemo(() =>
    state.stepTypes.filter(step =>
      step.name.toLowerCase().includes(state.stepSearchTerm.toLowerCase())
    )
  , [state.stepTypes, state.stepSearchTerm]);

  // Event Handlers
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

  const handleTimeDisplayModeChange = (mode: string) => {
    setState(prev => ({ ...prev, timeDisplayMode: mode }));
  };

  const handleSearchChange = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  };

  const handleStepSearchChange = (term: string) => {
    setState(prev => ({ ...prev, stepSearchTerm: term }));
  };

  const handleStepSelect = (step: Step) => {
    setState(prev => ({
      ...prev,
      selectedStep: step,
      selectedStepTitle: step.name,
      ratingPanelView: 'ratings',
      isDeleteMode: false,
      isEditMode: false,
      editingRating: null
    }));
  };

  const handleRatingChange = (ratingId: string, value: number) => {
    setState(prev => ({
      ...prev,
      selectedRatings: { ...prev.selectedRatings, [ratingId]: value }
    }));
  };

  const handleDeleteRating = (ratingId: string) => {
    if (state.selectedStep) {
      const updatedRatings = state.selectedStep.ratings.filter(r => r.id !== ratingId);
      const updatedStep = { ...state.selectedStep, ratings: updatedRatings };
      setState(prev => ({
        ...prev,
        stepTypes: prev.stepTypes.map(s => s.id === updatedStep.id ? updatedStep : s),
        selectedStep: updatedStep
      }));
    }
  };

  const handleSaveRatings = () => {
    if (state.selectedStep) {
      const updatedStep: Step = {
        ...state.selectedStep,
        ratedClips: state.selectedStep.ratedClips + 1,
        id: state.selectedStep.id,
        name: state.selectedStep.name,
        ratings: state.selectedStep.ratings,
        totalClips: state.selectedStep.totalClips
      };

      setState(prev => ({
        ...prev,
        ratingHistory: [...prev.ratingHistory, prev.selectedRatings],
        selectedRatings: {},
        selectedStep: updatedStep,
        stepTypes: prev.stepTypes.map(step => 
          step.id === updatedStep.id ? updatedStep : step
        )
      }));
    }
  };

  const handleUndoRating = () => {
    if (state.ratingHistory.length > 0) {
      const lastRating = state.ratingHistory[state.ratingHistory.length - 1];
      setState(prev => ({
        ...prev,
        selectedRatings: lastRating,
        ratingHistory: prev.ratingHistory.slice(0, -1),
        selectedStep: prev.selectedStep ? {
          ...prev.selectedStep,
          ratedClips: Math.max(0, prev.selectedStep.ratedClips - 1)
        } : null
      }));
    }
  };

  const handleChannelViewToggle = () => {
    setState(prev => ({ ...prev, isChannelViewExpanded: !prev.isChannelViewExpanded }));
  };

  const handleChannelToggle = (channel: string) => {
    setState(prev => ({
      ...prev,
      selectedChannels: prev.selectedChannels.includes(channel)
        ? prev.selectedChannels.filter(ch => ch !== channel)
        : [...prev.selectedChannels, channel]
    }));
  };

  const handleClipSectionToggle = () => {
    setState(prev => ({ ...prev, isClipSectionCollapsed: !prev.isClipSectionCollapsed }));
  };

  const handleRatingPanelViewChange = (view: 'steps' | 'ratings' | 'rate') => {
    setState(prev => ({ ...prev, ratingPanelView: view }));
  };

  const handleEditModeToggle = () => {
    setState(prev => ({ ...prev, isEditMode: !prev.isEditMode, isDeleteMode: false }));
  };

  const handleDeleteModeToggle = () => {
    setState(prev => ({ ...prev, isDeleteMode: !prev.isDeleteMode, isEditMode: false }));
  };

  const formatTimecode = (time: number) => {
    if (state.timeDisplayMode === 'frame') {
      return Math.floor(time * 30).toString().padStart(5, '0');
    }
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * 30);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const handleAddRating = () => {
    // Only proceed if we have a selected step and a rating name
    if (state.selectedStep && state.newRating.name) {
      // Create the new rating
      const newRating: Rating = {
        id: Date.now().toString(),
        name: state.newRating.name,
        scaleStart: state.newRating.scaleStart,
        scaleEnd: state.newRating.scaleEnd
      };

      // Create updated step with new rating
      const updatedStep = {
        ...state.selectedStep,
        ratings: [...state.selectedStep.ratings, newRating]
      };

      // Update state
      setState(prev => ({
        ...prev,
        stepTypes: prev.stepTypes.map(step => 
          step.id === state.selectedStep?.id ? updatedStep : step
        ),
        selectedStep: updatedStep,
        isAddingRating: false,  // Close the dialog
        newRating: { name: '', scaleStart: 1, scaleEnd: 10 }  // Reset the form
      }));

      // Log for debugging
      console.log('Rating added:', newRating);
      console.log('Updated step:', updatedStep);
    } else {
      console.log('Cannot add rating: No step selected or missing rating name');
      console.log('Selected step:', state.selectedStep);
      console.log('New rating:', state.newRating);
    }
  };

  const handleEditRating = (rating: Rating) => {
    if (state.selectedStep && state.editingRating) {
      const updatedRatings = state.selectedStep.ratings.map(r => 
        r.id === rating.id ? {
          ...r,
          name: state.editingRating?.name ?? r.name,
          scaleStart: state.editingRating?.scaleStart ?? r.scaleStart,
          scaleEnd: state.editingRating?.scaleEnd ?? r.scaleEnd
        } : r
      );

      const updatedStep = { ...state.selectedStep, ratings: updatedRatings };
      setState(prev => ({
        ...prev,
        stepTypes: prev.stepTypes.map(step => 
          step.id === updatedStep.id ? updatedStep : step
        ),
        selectedStep: updatedStep,
        editingRating: null
      }));
    }
  };

  const setEditingRating = (rating: EditingRating | null) => {
    setState(prev => ({ ...prev, editingRating: rating }));
  };

  const setNewRating = (rating: { name: string; scaleStart: number; scaleEnd: number; }) => {
    setState(prev => ({
      ...prev,
      newRating: rating
    }));
  };

  const closeAddRatingDialog = () => {
    setState(prev => ({
      ...prev,
      isAddingRating: false,
      newRating: { name: '', scaleStart: 1, scaleEnd: 10 } // Reset form
    }));
  };

  const toggleAddRatingDialog = () => {
    setState(prev => ({
      ...prev,
      isAddingRating: !prev.isAddingRating
    }));
  };

  const handleRowReorder = (fromIndex: number, toIndex: number) => {
    setState(prev => {
      // Create a copy of the selected channels array
      const newSelectedChannels = [...prev.selectedChannels];
      
      // Remove the channel from the old position and insert it at the new position
      const [movedChannel] = newSelectedChannels.splice(fromIndex, 1);
      newSelectedChannels.splice(toIndex, 0, movedChannel);
      
      // Return new state with reordered channels
      return {
        ...prev,
        selectedChannels: newSelectedChannels
      };
    });
  };

  // Add this new function to handle select/deselect all
  const handleSelectAllChannels = () => {
    setState(prev => {
      // If all channels are selected, deselect all
      if (prev.selectedChannels.length === allChannels.length) {
        return {
          ...prev,
          selectedChannels: [] // Clear all selections
        };
      }
      // Otherwise, select all channels
      return {
        ...prev,
        selectedChannels: [...allChannels]
      };
    });
  };

  return {
    state,
    videoRef,
    containerRef,
    filteredClips,
    filteredSteps,
    handlePlayPause,
    handleTimeDisplayModeChange,
    handleSearchChange,
    handleStepSearchChange,
    handleStepSelect,
    handleRatingChange,
    handleDeleteRating,
    handleSaveRatings,
    handleUndoRating,
    handleChannelViewToggle,
    handleChannelToggle,
    handleClipSectionToggle,
    handleRatingPanelViewChange,
    handleEditModeToggle,
    handleDeleteModeToggle,
    formatTimecode,
    handleAddRating,
    handleEditRating,
    setEditingRating,
    editingRating: state.editingRating,
    setNewRating,
    newRating: state.newRating,
    closeAddRatingDialog,
    toggleAddRatingDialog,
    handleRowReorder,
    handleSelectAllChannels,
  };
}; 