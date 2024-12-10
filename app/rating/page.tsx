'use client'

import { useRating } from './hooks/useRating';
import { RatingUI } from './components/ui/RatingUI';

export default function RatingPage() {
  const {
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
    editingRating,
    setNewRating,
    newRating,
    closeAddRatingDialog,
    toggleAddRatingDialog,
    handleRowReorder,
  } = useRating();

  return (
    <RatingUI
      {...state}
      videoRef={videoRef}
      containerRef={containerRef}
      filteredClips={filteredClips}
      filteredSteps={filteredSteps}
      onPlayPause={handlePlayPause}
      onTimeDisplayModeChange={handleTimeDisplayModeChange}
      onSearchChange={handleSearchChange}
      onStepSearchChange={handleStepSearchChange}
      onStepSelect={handleStepSelect}
      onRatingChange={handleRatingChange}
      onDeleteRating={handleDeleteRating}
      onSaveRatings={handleSaveRatings}
      onUndoRating={handleUndoRating}
      onChannelViewToggle={handleChannelViewToggle}
      onChannelToggle={handleChannelToggle}
      onClipSectionToggle={handleClipSectionToggle}
      onRatingPanelViewChange={handleRatingPanelViewChange}
      onEditModeToggle={handleEditModeToggle}
      onDeleteModeToggle={handleDeleteModeToggle}
      formatTimecode={formatTimecode}
      handleAddRating={handleAddRating}
      onEditRating={handleEditRating}
      onSetEditingRating={setEditingRating}
      editingRating={editingRating}
      onSetNewRating={setNewRating}
      newRating={newRating}
      closeAddRatingDialog={closeAddRatingDialog}
      toggleAddRatingDialog={toggleAddRatingDialog}
      onAddRating={toggleAddRatingDialog}
      onRowReorder={handleRowReorder}
    />
  );
} 