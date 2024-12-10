import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { LabelingInterfaceProps } from '../types';
import { 
  Play, Pause, ChevronLeft, ChevronRight, Maximize2, RotateCcw, RotateCw, 
  ZoomIn, ZoomOut, Lock, Unlock, Plus, X, ArrowLeft, Search, Trash2, 
  ChevronDown, ChevronUp, Flag 
} from 'lucide-react';
import { TimelineCard } from '@/app/rating/components/ui/TimelineCard';

// Define allChannels constant
const channelArray = Array.from({ length: 126 }, (_, i) => `Channel ${i + 1}`);

export const LabelingInterfaceUI: React.FC<LabelingInterfaceProps> = ({
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
  onPlayPause,
  onSeek,
  onZoom,
  onAddQuickTag,
  onDeleteStep,
  onAddCategory,
  onDeleteQuickTag,
  onQuickTagSelect,
  onChannelSelect,
  onChannelViewToggle,
  onTimeDisplayModeToggle,
  onFlagToggle,
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
  onSearchChange,
  sessions,
  videoRef,
  canvasRef,
  timelineRef,
  onQuickLabelDeleteModeToggle,
  onDeleteCategory,
  onAddStep,
  timelineRows,
  onRowReorder,
  handleCategorySelect,
  handleAddQuickTag,
  handleBackToCategories,
  handleStepSelect,
  handleDeleteCategory,
  handleDeleteStep,
  handleDeleteQuickTag,
  handleSearchChange,
  handleSearchClear,
  filteredCategories,
  handleTimelineLockToggle,
  handleFlagToggle,
}) => {
  return (
    <div className="flex-1 bg-[#1A1A1A] text-white overflow-hidden flex flex-col h-screen">
      <div className="flex flex-col h-full gap-4 p-4">
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
                            onClick={onPlayPause}
                            className="text-[#E5E7EB] hover:text-[#604abd]"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-[#E5E7EB] hover:text-[#604abd]">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-white">{formatTimecode(currentTime)}</span>
                          <Select
                            value={timeDisplayMode}
                            onValueChange={onTimeDisplayModeToggle}
                          >
                            <SelectTrigger className="w-[90px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-gray-900">
                              <SelectItem
                                value="time"
                                className="hover:bg-gray-100"
                              >
                                Time
                              </SelectItem>
                              <SelectItem
                                value="frame"
                                className="hover:bg-gray-100"
                              >
                                Frame
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
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
                        {Array.from({ length: Math.ceil(duration / 5) }).map((_, index) => (
                          <div
                            key={index}
                            className="absolute top-0 w-px h-2 bg-[#604abd]/50"
                            style={{ left: `${(index * 5 / duration) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 3D Motion Capture Viewer */}
          <div className="w-1/2">
            <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col">
              <div className="flex-1 relative">
                <canvas ref={canvasRef} className="w-full h-full" />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button size="sm" variant="ghost" className="text-[#E5E7EB] hover:text-[#604abd]">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-[#E5E7EB] hover:text-[#604abd]">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onZoom('in')}
                    className="text-[#E5E7EB] hover:text-[#604abd]"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onZoom('out')}
                    className="text-[#E5E7EB] hover:text-[#604abd]"
                  >
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
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Step Card and Timeline */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left section container */}
            <div className="flex">
              {/* Collapsible card */}
              <motion.div
                className="flex-shrink-0"
                animate={{ 
                  width: isStepTypeCardCollapsed ? '14px' : 'calc(100% - 56px)',
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`h-full bg-[#262626] border-r border-[#604abd] flex flex-col transition-all duration-300 
                  ${isStepTypeCardCollapsed ? 'w-[14px] overflow-hidden' : 'w-full'}`}>
                  {!isStepTypeCardCollapsed && (
                    <>
                      {/* Session Selection */}
                      <div className="p-2 border-b border-[#604abd]">
                        <Select value={selectedSession.id} onValueChange={onSessionSelect}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Session" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-900">
                            {sessions.map(session => (
                              <SelectItem 
                                key={session.id} 
                                value={session.id}
                                className="hover:bg-gray-100"
                              >
                                {session.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="mt-2 text-xs">
                          <p className="text-white">Date: {selectedSession.date}</p>
                          <p className="text-white">Duration: {selectedSession.duration}</p>
                          <p className="text-white">File Types: {selectedSession.fileTypes.join(', ')}</p>
                        </div>
                      </div>

                      {/* Step Type Content */}
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <ScrollArea className="flex-1">
                          <div className="p-4 space-y-4">
                            {/* Search Bar */}
                            <div className="relative w-full">
                              <Input
                                type="text"
                                placeholder={selectedCategory ? "Search steps..." : "Search categories..."}
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-10 pr-10 focus:ring-[#604abd]"
                              />
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E5E7EB]" size={18} />
                              {searchTerm && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                  onClick={onSearchClear}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            {/* Category Actions - Only show when no category is selected */}
                            {!selectedCategory && (
                              <div className="flex space-x-4 w-full">
                                <Button
                                  onClick={onAddCategoryClick}
                                  className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white flex-1"
                                >
                                  <Plus className="h-5 w-5 mr-2" /> Add Category
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={onStepDeleteModeToggle}
                                  className="flex-1 bg-red-500 hover:bg-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> {isStepDeleteMode ? 'Done' : 'Delete'}
                                </Button>
                              </div>
                            )}

                            {/* Categories Grid */}
                            <div className="grid grid-cols-2 gap-2">
                              <AnimatePresence>
                                {selectedCategory ? (
                                  // Show steps view
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-2 step-list-container col-span-2"
                                  >
                                    <div className="flex justify-between items-center mb-4">
                                      <Button
                                        variant="ghost"
                                        onClick={handleBackToCategories}
                                        className="bg-gray-700 text-white hover:bg-gray-600"
                                      >
                                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={onStepDeleteModeToggle}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" /> {isStepDeleteMode ? 'Done' : 'Delete'}
                                      </Button>
                                    </div>
                                    {/* Steps List */}
                                    {filteredCategories[0]?.steps.map(step => (
                                      <motion.div
                                        key={step}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Button
                                          className="w-full justify-between relative bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white"
                                          onClick={() => handleStepSelect(step)}
                                        >
                                          {step}
                                          {isStepDeleteMode && (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              exit={{ scale: 0 }}
                                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteStep(step);
                                              }}
                                            >
                                              <X className="h-4 w-4 text-white" />
                                            </motion.div>
                                          )}
                                        </Button>
                                      </motion.div>
                                    ))}
                                    {/* Add Step Button at bottom */}
                                    <Button
                                      className="w-full mt-4 bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white"
                                      onClick={onAddStepClick}
                                    >
                                      <Plus className="h-4 w-4 mr-2" /> Add Step
                                    </Button>
                                  </motion.div>
                                ) : (
                                  // Show filtered categories grid
                                  filteredCategories.map((category) => (
                                    <motion.div
                                      key={category.id}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <Card
                                        className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] p-4 cursor-pointer relative"
                                        onClick={() => onCategorySelect(category.id)}
                                      >
                                        {isStepDeleteMode && (
                                          <motion.button
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer z-10"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteCategory(category.id);
                                            }}
                                          >
                                            <X className="h-4 w-4 text-white" />
                                          </motion.button>
                                        )}
                                        <h3 className="font-medium mb-2 text-white text-center">{category.name}</h3>
                                      </Card>
                                    </motion.div>
                                  ))
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </ScrollArea>
                      </div>
                    </>
                  )}
                </Card>
              </motion.div>

              {/* Vertical Control Column */}
              <div className="w-14 flex-shrink-0 bg-[#262626] border-x border-[#604abd] flex flex-col items-center py-2 space-y-2">
                {/* Lock Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className={`
                    text-white w-10 h-10 transition-all duration-200
                    ${isTimelineLocked 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'hover:bg-red-500/20'
                    }
                  `}
                  onClick={onTimelineLockToggle}
                >
                  {isTimelineLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                </Button>

                {/* Flag Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className={`
                    text-white w-10 h-10 transition-all duration-200
                    ${isFlagSelected 
                      ? 'border-2 border-white hover:bg-white/10' 
                      : 'hover:bg-white/10'
                    }
                  `}
                  onClick={onFlagToggle}
                >
                  <Flag className="h-5 w-5" />
                </Button>

                {/* Rest of the buttons */}
                {Array.from({ length: 8 }).map((_, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 bg-gray-700 opacity-50 cursor-not-allowed"
                    disabled
                  />
                ))}

                {/* Collapse button */}
                <motion.div
                  className="w-full h-10 bg-gray-700 hover:bg-gray-600 flex items-center justify-center cursor-pointer transition-colors duration-300"
                  onClick={onStepTypeCardCollapse}
                  animate={{ rotate: isStepTypeCardCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </motion.div>
              </div>
            </div>

            {/* Timeline section with dynamic width */}
            <div className={`flex-1 h-full flex flex-col transition-all duration-300
              ${isStepTypeCardCollapsed ? 'ml-0' : ''}`}>
              {/* Quick Label Button Row */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-t border-b border-[#604abd]">
                <div className="flex items-center space-x-2 overflow-x-auto flex-grow quick-label-container">
                  {quickTags.map((tag, index) => (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{
                        opacity: selectedQuickTag ? (selectedQuickTag === tag ? 1 : 0.3) : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        size="sm"
                        className={`
                          transition-all duration-200 px-4 py-2 rounded-md relative
                          ${selectedQuickTag === tag
                            ? 'bg-gradient-to-r from-[#7059c4] to-[#de65f7] text-white border-2 border-white'
                            : 'bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white hover:from-[#7059c4] hover:to-[#de65f7]'
                          }
                          ${selectedQuickTag && selectedQuickTag !== tag ? 'pointer-events-none' : ''}
                        `}
                        onClick={() => onQuickTagSelect(tag)}
                      >
                        {tag}
                        {isQuickLabelDeleteMode && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteQuickTag(tag);
                            }}
                          >
                            <X className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <Button
                  size="sm"
                  className={`
                    bg-red-500 text-white hover:bg-red-600 transition-colors duration-200
                    ${selectedQuickTag ? 'opacity-30 pointer-events-none' : ''}
                    ${isQuickLabelDeleteMode ? 'bg-red-600' : ''}
                  `}
                  onClick={onQuickLabelDeleteModeToggle}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* TimelineCard */}
              <div className="flex-1 min-h-0">
                <TimelineCard
                  timelineRows={timelineRows}
                  isChannelViewExpanded={isChannelViewExpanded}
                  selectedChannels={selectedChannels}
                  allChannels={channelArray}
                  onChannelViewToggle={onChannelViewToggle}
                  onChannelToggle={onChannelSelect}
                  onRowReorder={onRowReorder}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={isAddingStep} onOpenChange={onAddStepCancel}>
          <DialogContent className="bg-[#1A1A1A] border border-[#604abd]">
            <DialogHeader>
              <DialogTitle className="text-[#E5E7EB]">Add Step</DialogTitle>
            </DialogHeader>
            <Input
              value={newStepName}
              onChange={(e) => onNewStepNameChange(e.target.value)}
              placeholder="Enter step name"
              className="bg-gray-700 text-white border-gray-600"
              autoFocus
            />
            <DialogFooter>
              <Button 
                onClick={onAddStep}
                className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white"
              >
                Save
              </Button>
              <Button 
                variant="ghost" 
                onClick={onAddStepCancel}
                className="text-white hover:bg-[#604abd]/20"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddingCategory} onOpenChange={onAddCategoryCancel}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <Input
              value={newCategoryName}
              onChange={(e) => onNewCategoryNameChange(e.target.value)}
              placeholder="Enter category name"
            />
            <DialogFooter>
              <Button onClick={onAddCategory}>Add</Button>
              <Button variant="outline" onClick={onAddCategoryCancel}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}; 