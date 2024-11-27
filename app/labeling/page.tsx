'use client'

import { LabelingInterfaceUI } from './components/LabelingInterfaceUI';
import { useLabeling } from './hooks/useLabeling';

export default function LabelingPage() {
  const {
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
  } = useLabeling();

  return (
    <LabelingInterfaceUI
      {...state}
      videoRef={videoRef}
      canvasRef={canvasRef}
      timelineRef={timelineRef}
      onPlayPause={handlePlayPause}
      onSeek={handleSeek}
      onZoom={handleZoom}
      onAddQuickTag={handleAddQuickTag}
      onDeleteStep={handleDeleteStep}
      onAddCategory={handleAddCategory}
      onDeleteQuickTag={handleDeleteQuickTag}
      onQuickTagSelect={handleQuickTagSelect}
      onChannelSelect={handleChannelSelect}
      onChannelViewToggle={handleChannelViewToggle}
      onTimeDisplayModeToggle={handleTimeDisplayModeToggle}
      onFlagToggle={handleFlagToggle}
      formatTimecode={formatTimecode}
      onStepTypeCardCollapse={handleStepTypeCardCollapse}
      onTimelineLockToggle={handleTimelineLockToggle}
      onSessionSelect={handleSessionSelect}
      onSearchClear={handleSearchClear}
      onAddCategoryClick={handleAddCategoryClick}
      onAddCategoryCancel={handleAddCategoryCancel}
      onNewCategoryNameChange={handleNewCategoryNameChange}
      onStepDeleteModeToggle={handleStepDeleteModeToggle}
      onCategorySelect={handleCategorySelect}
      onAddStepClick={handleAddStepClick}
      onNewStepNameChange={handleNewStepNameChange}
      onAddStepCancel={handleAddStepCancel}
      onSearchChange={handleSearchChange}
      onQuickLabelDeleteModeToggle={handleQuickLabelDeleteModeToggle}
      onDeleteCategory={handleDeleteCategory}
      onAddStep={handleAddStep}
    />
  );
} 