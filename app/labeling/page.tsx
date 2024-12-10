'use client'

import { LabelingInterfaceUI } from './components/LabelingInterfaceUI';
import { useLabelingInterface } from './hooks/useLabelingInterface';

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
    handleAddStep,
    handleBackToCategories,
    handleStepSelect,
    timelineRows,
    selectedChannels,
    isChannelViewExpanded,
    handleRowReorder,
    filteredCategories,
    onSearchChange,
    onSearchClear,
    onTimelineLockToggle,
    onFlagToggle,
  } = useLabelingInterface();

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
      onFlagToggle={onFlagToggle}
      formatTimecode={formatTimecode}
      onStepTypeCardCollapse={handleStepTypeCardCollapse}
      onTimelineLockToggle={onTimelineLockToggle}
      onSessionSelect={handleSessionSelect}
      onSearchClear={onSearchClear}
      onAddCategoryClick={handleAddCategoryClick}
      onAddCategoryCancel={handleAddCategoryCancel}
      onNewCategoryNameChange={handleNewCategoryNameChange}
      onStepDeleteModeToggle={handleStepDeleteModeToggle}
      onCategorySelect={handleCategorySelect}
      onAddStepClick={handleAddStepClick}
      onNewStepNameChange={handleNewStepNameChange}
      onAddStepCancel={handleAddStepCancel}
      onSearchChange={onSearchChange}
      onQuickLabelDeleteModeToggle={handleQuickLabelDeleteModeToggle}
      onDeleteCategory={handleDeleteCategory}
      onAddStep={handleAddStep}
      timelineRows={timelineRows}
      selectedChannels={selectedChannels}
      isChannelViewExpanded={isChannelViewExpanded}
      onRowReorder={handleRowReorder}
      handleCategorySelect={handleCategorySelect}
      handleBackToCategories={handleBackToCategories}
      handleStepSelect={handleStepSelect}
      handleDeleteCategory={handleDeleteCategory}
      handleDeleteStep={handleDeleteStep}
      handleDeleteQuickTag={handleDeleteQuickTag}
      filteredCategories={filteredCategories}
    />
  );
} 