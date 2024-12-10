import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw, RotateCw, 
  ZoomIn, ZoomOut, Maximize2, Search, X, ChevronLeftSquare, 
  ChevronRightSquare, ChevronUp, ChevronDown, Undo, Plus, ArrowLeft, 
  Pencil, Trash2 
} from 'lucide-react';
import { RatingState, Clip, Step } from '../types';
import { ClipCard } from './ClipCard';
import { StepCard } from './StepCard';
import { RatingCard } from './RatingCard';
import { TimelineCard } from './TimelineCard';
import { allChannels } from '../../data/mockData';

interface RatingUIProps extends RatingState {
  videoRef: React.RefObject<HTMLVideoElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  filteredClips: Clip[];
  filteredSteps: Step[];
  onPlayPause: () => void;
  onAddRating: () => void;
  onTimeDisplayModeChange: (mode: string) => void;
  onSearchChange: (term: string) => void;
  onStepSearchChange: (term: string) => void;
  onStepSelect: (step: Step) => void;
  onRatingChange: (ratingId: string, value: number) => void;
  onDeleteRating: (ratingId: string) => void;
  onSaveRatings: () => void;
  onUndoRating: () => void;
  onChannelViewToggle: () => void;
  onChannelToggle: (channel: string) => void;
  onClipSectionToggle: () => void;
  onRatingPanelViewChange: (view: 'steps' | 'ratings' | 'rate') => void;
  onEditModeToggle: () => void;
  onDeleteModeToggle: () => void;
  formatTimecode: (time: number) => string;
  onEditRating: (rating: Rating) => void;
  onSetEditingRating: (rating: EditingRating | null) => void;
  editingRating: EditingRating | null;
  newRating: {
    name: string;
    scaleStart: number;
    scaleEnd: number;
  };
  onSetNewRating: (rating: { name: string; scaleStart: number; scaleEnd: number; }) => void;
  handleAddRating: () => void;
  closeAddRatingDialog: () => void;
  toggleAddRatingDialog: () => void;
  onRowReorder: (fromIndex: number, toIndex: number) => void;
}

export const RatingUI: React.FC<RatingUIProps> = ({
  isPlaying,
  currentTime,
  duration,
  timeDisplayMode,
  videoRef,
  containerRef,
  filteredClips,
  filteredSteps,
  selectedStep,
  selectedStepTitle,
  isAddingRating,
  searchTerm,
  stepSearchTerm,
  ratingPanelView,
  isDeleteMode,
  isEditMode,
  isClipSectionCollapsed,
  timelineRows,
  isChannelViewExpanded,
  selectedChannels,
  selectedRatings,
  ratingHistory,
  onPlayPause,
  onAddRating,
  onTimeDisplayModeChange,
  onSearchChange,
  onStepSearchChange,
  onStepSelect,
  onRatingChange,
  onDeleteRating,
  onSaveRatings,
  onUndoRating,
  onChannelViewToggle,
  onChannelToggle,
  onClipSectionToggle,
  onRatingPanelViewChange,
  onEditModeToggle,
  onDeleteModeToggle,
  formatTimecode,
  onEditRating,
  onSetEditingRating,
  editingRating,
  newRating,
  onSetNewRating,
  handleAddRating,
  closeAddRatingDialog,
  toggleAddRatingDialog,
  onRowReorder
}) => {
  const activeClips = filteredClips.filter(clip => !clip.rated);
  const completedClips = filteredClips.filter(clip => clip.rated);

  const activeSteps = filteredSteps.filter(step => step.ratedClips < step.totalClips);
  const completedSteps = filteredSteps.filter(step => step.ratedClips === step.totalClips);

  return (
    <div ref={containerRef} className="h-screen bg-[#1A1A1A] text-[#E5E7EB] flex flex-col overflow-hidden p-4">
      <div className="flex flex-col h-full gap-4">
        {/* Top Section */}
        <div className="h-[45%] flex gap-4">
          {/* Video Player */}
          <div className="w-1/2">
            <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col">
              <div className="flex-1 flex flex-col">
                {/* Video Container */}
                <div className="relative flex-1">
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-contain"
                  />

                  {/* Video Controls */}
                  <div className="absolute bottom-8 left-0 right-0">
                    <div className="p-2">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="text-[#E5E7EB] hover:text-[#604abd]">
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-[#E5E7EB] hover:text-[#604abd]"
                            onClick={onPlayPause}
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-[#E5E7EB] hover:text-[#604abd]">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-white whitespace-nowrap">
                            {formatTimecode(currentTime)}
                          </span>
                          <Select 
                            value={timeDisplayMode}
                            onValueChange={onTimeDisplayModeChange}
                          >
                            <SelectTrigger className="w-[90px] h-8 bg-white text-black border-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-black">
                              <SelectItem value="time">Time</SelectItem>
                              <SelectItem value="frame">Frame</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="relative h-6 rounded-lg border border-[#404040] shadow-md shadow-black/25">
                        <span className="absolute left-0 top-0 bottom-0 flex items-center px-1 text-white">V</span>
                        <div
                          className="absolute top-0 left-6 h-full bg-[#604abd] opacity-50"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                        <div
                          className="absolute top-0 left-6 w-px h-full bg-[#604abd]"
                          style={{ left: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 3D Visualizer */}
          <div className="w-1/2">
            <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col overflow-hidden">
              <div className="flex-1 relative">
                <div className="absolute top-0 left-0 p-2 text-sm text-white">
                  FPS: 60 | Verts: 10000 | Faces: 5000
                </div>
                <canvas className="w-full h-full" />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button size="sm" variant="ghost" className="text-[#E5E7EB] hover:text-[#604abd]">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-[#E5E7EB] hover:text-[#604abd]">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-[#E5E7EB] hover:text-[#604abd]">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-[#E5E7EB] hover:text-[#604abd]">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-[#E5E7EB] hover:text-[#604abd]">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="h-[55%] flex gap-4">
          {/* Clip Queue Section */}
          <div className={`${isClipSectionCollapsed ? 'w-12' : 'w-1/4'} transition-all duration-300 ease-in-out relative`}>
            <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col overflow-hidden">
              {!isClipSectionCollapsed && (
                <div className="flex flex-col h-full">
                  {/* Search Bar */}
                  <div className="p-4 border-b border-[#604abd]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search clips..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 bg-gray-700 text-white border-gray-600 w-full"
                      />
                    </div>
                  </div>

                  {/* Step Title and Collapse Button */}
                  <div className="p-4 border-b border-[#604abd] flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">{selectedStepTitle || 'Select a Step'}</h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onClipSectionToggle}
                      className="text-white hover:bg-[#604abd]/20"
                      aria-label={isClipSectionCollapsed ? "Expand clip section" : "Collapse clip section"}
                    >
                      <ChevronLeftSquare className="h-5 w-5" />
                    </Button>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      {/* Active Clips */}
                      <div className="grid grid-cols-5 gap-1">
                        {activeClips.map((clip, index) => (
                          <ClipCard 
                            key={clip.id} 
                            clip={clip}
                            isActive={index === 0}
                            isPending={index > 0}
                          />
                        ))}
                      </div>

                      {/* Completed Section */}
                      {completedClips.length > 0 && (
                        <>
                          <div className="my-4 flex items-center">
                            <div className="flex-1 h-px bg-gray-600" />
                            <span className="px-2 text-sm text-gray-400">Completed</span>
                            <div className="flex-1 h-px bg-gray-600" />
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {completedClips.map((clip) => (
                              <ClipCard 
                                key={clip.id} 
                                clip={clip} 
                                isCompleted={true}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
              {/* Collapse/Expand Button for collapsed state */}
              {isClipSectionCollapsed && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClipSectionToggle}
                  className="absolute top-4 right-0 text-white hover:bg-[#604abd]/20"
                  aria-label="Expand clip section"
                >
                  <ChevronRightSquare className="h-5 w-5" />
                </Button>
              )}
            </Card>
          </div>

          {/* Step Card Section */}
          <div className={`${isClipSectionCollapsed ? 'w-[calc(50%-3rem)]' : 'w-1/3'} transition-all duration-300 ease-in-out`}>
            <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col">
              {ratingPanelView === 'steps' && (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-[#604abd]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search steps..."
                        value={stepSearchTerm}
                        onChange={(e) => onStepSearchChange(e.target.value)}
                        className="pl-10 bg-gray-700 text-white border-gray-600 w-full"
                      />
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      <div className="grid grid-cols-5 gap-1">
                        {activeSteps.map((step) => (
                          <StepCard
                            key={step.id}
                            step={step}
                            onClick={() => onStepSelect(step)}
                          />
                        ))}
                      </div>
                      {completedSteps.length > 0 && (
                        <>
                          <div className="my-4 flex items-center">
                            <div className="flex-1 h-px bg-gray-600" />
                            <span className="px-2 text-sm text-gray-400">Completed</span>
                            <div className="flex-1 h-px bg-gray-600" />
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {completedSteps.map((step) => (
                              <StepCard
                                key={step.id}
                                step={step}
                                onClick={() => onStepSelect(step)}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
              {/* Step Card Section - Ratings View */}
              {ratingPanelView === 'ratings' && (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center p-4 border-b border-[#604abd]">
                    <Button 
                      variant="ghost" 
                      onClick={() => onRatingPanelViewChange('steps')}
                      className="hover:bg-[#604abd]/10"
                    >
                      <ArrowLeft className="h-5 w-5 text-white" />
                    </Button>
                    <span className="text-lg font-medium text-white">{selectedStep?.name}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={onEditModeToggle}
                        className={`hover:bg-[#604abd]/10 ${isEditMode ? 'text-blue-500' : 'text-white'}`}
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={onDeleteModeToggle}
                        className={`hover:bg-[#604abd]/10 ${isDeleteMode ? 'text-red-500' : 'text-white'}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4 grid grid-cols-5 gap-2">
                      {selectedStep?.ratings.map((rating) => (
                        <RatingCard
                          key={rating.id}
                          rating={rating}
                          isEditing={isEditMode || isDeleteMode}
                          onEdit={() => onSetEditingRating(rating)}
                          onDelete={() => onDeleteRating(rating.id)}
                          editingRating={editingRating}
                          setEditingRating={onSetEditingRating}
                          handleEditRating={onEditRating}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 space-y-2 border-t border-[#604abd]">
                    <Button 
                      className="w-full bg-gradient-to-r from-[#604abd] to-[#d84bf7]"
                      onClick={toggleAddRatingDialog}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Rating
                    </Button>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => onRatingPanelViewChange('rate')}
                    >
                      Start Rating
                    </Button>
                  </div>
                </div>
              )}
              {/* Step Card Section - Rate View */}
              {ratingPanelView === 'rate' && (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center p-4 border-b border-[#604abd]">
                    <Button 
                      variant="ghost" 
                      onClick={() => onRatingPanelViewChange('ratings')}
                      className="hover:bg-[#604abd]/10"
                    >
                      <ArrowLeft className="h-5 w-5 text-white" />
                    </Button>
                    <span className="text-lg font-medium text-white">{selectedStep?.name}</span>
                    <Button 
                      variant="ghost" 
                      onClick={() => onRatingPanelViewChange('steps')}
                      className="hover:bg-[#604abd]/10"
                    >
                      <X className="h-5 w-5 text-white" />
                    </Button>
                  </div>
                  <div className="p-4 border-b border-[#604abd]">
                    <p className="text-center text-white">
                      Rated: {selectedStep?.ratedClips}/{selectedStep?.totalClips}
                    </p>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4 grid grid-cols-5 gap-2">
                      {selectedStep?.ratings.map((rating) => (
                        <div key={rating.id} className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] p-4 rounded-lg flex flex-col items-center justify-center">
                          <h3 className="font-semibold mb-2 text-white text-center">{rating.name}</h3>
                          <Input
                            type="number"
                            min={rating.scaleStart}
                            max={rating.scaleEnd}
                            value={selectedRatings[rating.id] || ''}
                            onChange={(e) => onRatingChange(rating.id, parseInt(e.target.value))}
                            className="w-20 text-center bg-gray-700 text-white border-gray-600"
                          />
                          <span className="text-xs text-gray-300 mt-1">
                            {rating.scaleStart}-{rating.scaleEnd}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-[#604abd]">
                    <div className="flex justify-between items-center">
                      <Button 
                        className="flex-grow bg-green-600 hover:bg-green-700"
                        onClick={onSaveRatings}
                      >
                        Save and Next
                      </Button>
                      <Button 
                        className="ml-2 bg-blue-600 hover:bg-blue-700 w-1/4"
                        onClick={onUndoRating}
                        disabled={ratingHistory.length === 0}
                      >
                        <Undo className="h-4 w-4 mr-2" />
                        Undo
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Channel View Section */}
          <div className={`${isClipSectionCollapsed ? 'w-[calc(50%-3rem)]' : 'w-[calc(5/12*100%)]'} transition-all duration-300 ease-in-out`}>
            <TimelineCard
              timelineRows={timelineRows}
              isChannelViewExpanded={isChannelViewExpanded}
              selectedChannels={selectedChannels}
              allChannels={allChannels}
              onChannelViewToggle={onChannelViewToggle}
              onChannelToggle={onChannelToggle}
              onRowReorder={onRowReorder}
            />
          </div>
        </div>
      </div>
      <Dialog 
        open={isAddingRating} 
        onOpenChange={(open) => {
          if (!open) {
            closeAddRatingDialog();
          }
        }}
      >
        <DialogContent className="bg-[#1A1A1A] border border-[#604abd]">
          <DialogHeader>
            <DialogTitle className="text-[#E5E7EB]">Add Rating</DialogTitle>
            <Button
              variant="ghost"
              className="absolute right-4 top-4 text-white hover:bg-[#604abd]/20"
              onClick={closeAddRatingDialog}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[#E5E7EB]">Rating Name</Label>
              <Input
                id="name"
                value={newRating.name}
                onChange={(e) => onSetNewRating({ ...newRating, name: e.target.value })}
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="scale" className="text-[#E5E7EB]">Scale Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="scaleStart"
                  type="number"
                  value={newRating.scaleStart}
                  onChange={(e) => onSetNewRating({ ...newRating, scaleStart: parseInt(e.target.value) })}
                  className="w-20 bg-gray-700 text-white border-gray-600"
                  min={1}
                />
                <span className="text-[#E5E7EB]">to</span>
                <Input
                  id="scaleEnd"
                  type="number"
                  value={newRating.scaleEnd}
                  onChange={(e) => onSetNewRating({ ...newRating, scaleEnd: parseInt(e.target.value) })}
                  className="w-20 bg-gray-700 text-white border-gray-600"
                  min={2}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={closeAddRatingDialog}
              className="text-white hover:bg-[#604abd]/20"
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white"
              onClick={handleAddRating}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 