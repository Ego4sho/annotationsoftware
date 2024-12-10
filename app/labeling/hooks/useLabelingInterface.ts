import { useState, useMemo } from 'react';
import { initialTimelineRows } from '@/app/rating/data/mockData';  // Import the same initial rows

// Add mock sessions data with fixed dates
const mockSessions = [
  {
    id: '1',
    name: 'Session 1',
    date: '2024-01-01', // Use fixed date strings
    duration: '01:30:00',
    fileTypes: ['video', 'audio']
  },
  {
    id: '2',
    name: 'Session 2',
    date: '2024-01-02', // Use fixed date strings
    duration: '02:15:00',
    fileTypes: ['video', 'audio', 'sensor']
  }
];

// Add mock categories data
const mockCategories = [
  {
    id: '1',
    name: 'Jumps',
    steps: ['Single', 'Double', 'Triple', 'Quad']
  },
  {
    id: '2',
    name: 'Spins',
    steps: ['Upright', 'Sit', 'Camel', 'Layback']
  },
  {
    id: '3',
    name: 'Footwork',
    steps: ['Twizzles', 'Choctaws', 'Mohawks', 'Three-turns']
  }
];

// Add mock channels data
const allChannels = Array.from({ length: 126 }, (_, i) => `Channel ${i + 1}`);

export const useLabelingInterface = () => {
  const [state, setState] = useState({
    timelineRows: initialTimelineRows,
    selectedChannels: [],
    isChannelViewExpanded: false,
    timeDisplayMode: 'time',
    selectedSession: {
      id: '1',
      name: 'Default Session',
      date: '2024-01-01', // Use fixed date string
      duration: '00:00:00',
      fileTypes: ['video', 'audio']
    },
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    sessions: mockSessions,
    categories: mockCategories,  // Add categories
    selectedCategory: null,
    isAddingCategory: false,
    newCategoryName: '',
    isStepDeleteMode: false,
    isQuickLabelDeleteMode: false,
    searchTerm: '',
    isAddCategoryModalOpen: false,
    isTimelineLocked: false,
    quickTags: [],
    selectedQuickTag: null,
    isStepTypeCardCollapsed: false,
    newStepName: '',
    isAddingStep: false,
    isFlagSelected: false,
  });

  // Add formatTimecode function
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

  // Add the row reorder handler
  const handleRowReorder = (fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newSelectedChannels = [...prev.selectedChannels];
      const [movedChannel] = newSelectedChannels.splice(fromIndex, 1);
      newSelectedChannels.splice(toIndex, 0, movedChannel);
      
      return {
        ...prev,
        selectedChannels: newSelectedChannels
      };
    });
  };

  // Add or update the channel toggle handler
  const handleChannelSelect = (channel: string) => {
    setState(prev => {
      const isSelected = prev.selectedChannels.includes(channel);
      return {
        ...prev,
        selectedChannels: isSelected
          ? prev.selectedChannels.filter(c => c !== channel)
          : [...prev.selectedChannels, channel]
      };
    });
  };

  // Add or update the channel view toggle handler
  const handleChannelViewToggle = () => {
    setState(prev => ({
      ...prev,
      isChannelViewExpanded: !prev.isChannelViewExpanded
    }));
  };

  // Add handleCategorySelect function
  const handleCategorySelect = (categoryId: string) => {
    setState(prev => ({
      ...prev,
      selectedCategory: prev.categories.find(cat => cat.id === categoryId) || null,
      isStepDeleteMode: false
    }));
  };

  // Add handleAddQuickTag function
  const handleAddQuickTag = (step: string) => {
    setState(prev => {
      if (!prev.quickTags.includes(step)) {
        return {
          ...prev,
          quickTags: [...prev.quickTags, step]
        };
      }
      return prev;
    });
  };

  // Add handleBackToCategories function
  const handleBackToCategories = () => {
    setState(prev => ({
      ...prev,
      selectedCategory: null,
      isStepDeleteMode: false,
      searchTerm: ''
    }));
  };

  // Add handleStepSelect function
  const handleStepSelect = (step: string) => {
    handleAddQuickTag(step);
  };

  // Add these handlers
  const handleAddStepClick = () => {
    setState(prev => ({
      ...prev,
      isAddingStep: true,
      newStepName: ''
    }));
  };

  const handleAddStep = () => {
    setState(prev => {
      if (!prev.selectedCategory || !prev.newStepName) return prev;

      const updatedCategories = prev.categories.map(category => {
        if (category.id === prev.selectedCategory?.id) {
          return {
            ...category,
            steps: [...category.steps, prev.newStepName]
          };
        }
        return category;
      });

      return {
        ...prev,
        categories: updatedCategories,
        selectedCategory: updatedCategories.find(c => c.id === prev.selectedCategory?.id) || null,
        isAddingStep: false,
        newStepName: ''
      };
    });
  };

  const handleAddStepCancel = () => {
    setState(prev => ({
      ...prev,
      isAddingStep: false,
      newStepName: ''
    }));
  };

  const handleNewStepNameChange = (name: string) => {
    setState(prev => ({
      ...prev,
      newStepName: name
    }));
  };

  // Toggle delete modes
  const handleStepDeleteModeToggle = () => {
    setState(prev => ({
      ...prev,
      isStepDeleteMode: !prev.isStepDeleteMode,
      isQuickLabelDeleteMode: false
    }));
  };

  const handleQuickLabelDeleteModeToggle = () => {
    setState(prev => ({
      ...prev,
      isQuickLabelDeleteMode: !prev.isQuickLabelDeleteMode,
      isStepDeleteMode: false
    }));
  };

  // Delete handlers
  const handleDeleteCategory = (categoryId: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId),
      selectedCategory: null,
      isStepDeleteMode: false
    }));
  };

  const handleDeleteStep = (step: string) => {
    setState(prev => {
      if (!prev.selectedCategory) return prev;

      const updatedCategories = prev.categories.map(category => {
        if (category.id === prev.selectedCategory?.id) {
          return {
            ...category,
            steps: category.steps.filter(s => s !== step)
          };
        }
        return category;
      });

      return {
        ...prev,
        categories: updatedCategories,
        selectedCategory: updatedCategories.find(c => c.id === prev.selectedCategory?.id) || null
      };
    });
  };

  const handleDeleteQuickTag = (tag: string) => {
    setState(prev => ({
      ...prev,
      quickTags: prev.quickTags.filter(t => t !== tag),
      selectedQuickTag: prev.selectedQuickTag === tag ? null : prev.selectedQuickTag
    }));
  };

  // Update the handleQuickTagSelect function
  const handleQuickTagSelect = (tag: string) => {
    setState(prev => ({
      ...prev,
      selectedQuickTag: prev.selectedQuickTag === tag ? null : tag,
      isQuickLabelDeleteMode: false // Disable delete mode when selecting a tag
    }));
  };

  // Update handleSearchChange
  const handleSearchChange = (value: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: value
    }));
  };

  // Update handleSearchClear
  const handleSearchClear = () => {
    setState(prev => ({
      ...prev,
      searchTerm: ''
    }));
  };

  // Update filteredCategories using useMemo
  const filteredCategories = useMemo(() => {
    if (!state.selectedCategory) {
      // Filter categories when no category is selected
      return state.categories.filter(category =>
        category.name.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    } else {
      // Filter steps within the selected category
      const filteredSteps = state.selectedCategory.steps.filter(step =>
        step.toLowerCase().includes(state.searchTerm.toLowerCase())
      );

      // Return the selected category with filtered steps
      return [{
        ...state.selectedCategory,
        steps: filteredSteps
      }];
    }
  }, [state.categories, state.selectedCategory, state.searchTerm]);

  // Update the timeline lock toggle handler
  const handleTimelineLockToggle = () => {
    setState(prev => ({
      ...prev,
      isTimelineLocked: !prev.isTimelineLocked
    }));
  };

  // Update the flag toggle handler
  const handleFlagToggle = () => {
    setState(prev => ({
      ...prev,
      isFlagSelected: !prev.isFlagSelected
    }));
  };

  // Add or update the step type card collapse handler
  const handleStepTypeCardCollapse = () => {
    setState(prev => ({
      ...prev,
      isStepTypeCardCollapsed: !prev.isStepTypeCardCollapsed
    }));
  };

  return {
    state,
    timelineRows: state.timelineRows,
    selectedChannels: state.selectedChannels,
    isChannelViewExpanded: state.isChannelViewExpanded,
    handleRowReorder,
    handleChannelSelect,
    handleChannelViewToggle,
    formatTimecode,
    sessions: state.sessions,
    categories: state.categories,
    allChannels,
    handleCategorySelect,  // Add this to the return object
    handleAddQuickTag,
    handleBackToCategories,
    handleStepSelect,
    handleAddStepClick,
    handleAddStep,
    handleAddStepCancel,
    handleNewStepNameChange,
    handleStepDeleteModeToggle,
    handleQuickLabelDeleteModeToggle,
    handleDeleteCategory,
    handleDeleteStep,
    handleDeleteQuickTag,
    handleQuickTagSelect,
    onSearchChange: handleSearchChange,
    onSearchClear: handleSearchClear,
    filteredCategories,
    onTimelineLockToggle: handleTimelineLockToggle,
    onFlagToggle: handleFlagToggle,
    handleStepTypeCardCollapse,  // Return the handler directly
  };
}; 