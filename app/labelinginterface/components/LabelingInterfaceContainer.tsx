'use client';

import { LabelingInterfaceUI } from './LabelingInterfaceUI';
import { useLabelingInterface } from '../hooks/useLabelingInterface';

export const LabelingInterfaceContainer: React.FC = () => {
  const {
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
    sessions,

    // Event handlers
    onPlayPause,
    onSeek,
    onZoom,
    onTimeDisplayModeToggle,
    onChannelViewToggle,
    onChannelSelect,
    onQuickLabelDeleteModeToggle,
    onAddQuickTag,
    onDeleteStep,
    onAddCategory,
    onDeleteQuickTag,
    onQuickTagSelect,
    onFlagToggle,
    onSearchChange,
    formatTimecode,
    onStepTypeCardCollapse,
    onTimelineLockToggle,
    onSessionSelect,
    onSearchClear,
    onAddCategoryClick,
    onAddCategoryCancel,
    onNewCategoryNameChange,
    onStepDeleteModeToggle,
    onCategorySelect,
    onAddStepClick,
    onNewStepNameChange,
    onAddStepCancel,
    onAddStep,
    setIsQuickLabelDeleteMode,
    onDeleteCategory,

    // Refs
    videoRef,
    canvasRef,
    timelineRef,
  } = useLabelingInterface();

  return (
    <LabelingInterfaceUI
      // State
      currentTime={currentTime}
      duration={duration}
      isPlaying={isPlaying}
      zoomLevel={zoomLevel}
      selectedSession={selectedSession}
      selectedCategory={selectedCategory}
      quickTags={quickTags}
      selectedChannels={selectedChannels}
      searchTerm={searchTerm}
      isAddCategoryModalOpen={isAddCategoryModalOpen}
      newCategoryName={newCategoryName}
      isTimelineLocked={isTimelineLocked}
      isChannelViewExpanded={isChannelViewExpanded}
      allChannels={allChannels}
      isDeleteMode={isDeleteMode}
      categories={categories}
      selectedQuickTag={selectedQuickTag}
      isQuickLabelDeleteMode={isQuickLabelDeleteMode}
      isStepDeleteMode={isStepDeleteMode}
      isStepTypeCardCollapsed={isStepTypeCardCollapsed}
      newStepName={newStepName}
      isAddingStep={isAddingStep}
      isAddingCategory={isAddingCategory}
      timeDisplayMode={timeDisplayMode}
      isFlagSelected={isFlagSelected}
      sessions={sessions}
      
      // Event handlers
      onPlayPause={onPlayPause}
      onSeek={onSeek}
      onZoom={onZoom}
      onTimeDisplayModeToggle={onTimeDisplayModeToggle}
      onChannelViewToggle={onChannelViewToggle}
      onChannelSelect={onChannelSelect}
      onQuickLabelDeleteModeToggle={onQuickLabelDeleteModeToggle}
      onAddQuickTag={onAddQuickTag}
      onDeleteStep={onDeleteStep}
      onAddCategory={onAddCategory}
      onDeleteQuickTag={onDeleteQuickTag}
      onQuickTagSelect={onQuickTagSelect}
      onFlagToggle={onFlagToggle}
      onSearchChange={onSearchChange}
      formatTimecode={formatTimecode}
      onStepTypeCardCollapse={onStepTypeCardCollapse}
      onTimelineLockToggle={onTimelineLockToggle}
      onSessionSelect={onSessionSelect}
      onSearchClear={onSearchClear}
      onAddCategoryClick={onAddCategoryClick}
      onAddCategoryCancel={onAddCategoryCancel}
      onNewCategoryNameChange={onNewCategoryNameChange}
      onStepDeleteModeToggle={onStepDeleteModeToggle}
      onCategorySelect={onCategorySelect}
      onAddStepClick={onAddStepClick}
      onNewStepNameChange={onNewStepNameChange}
      onAddStepCancel={onAddStepCancel}
      onAddStep={onAddStep}
      setIsQuickLabelDeleteMode={setIsQuickLabelDeleteMode}
      onDeleteCategory={onDeleteCategory}
      
      // Refs
      videoRef={videoRef}
      canvasRef={canvasRef}
      timelineRef={timelineRef}
    />
  );
};

export default LabelingInterfaceContainer; 