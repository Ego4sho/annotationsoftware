import { LabelingInterfaceProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, RotateCcw, RotateCw, ZoomIn, ZoomOut, Lock, Unlock, Plus, X, ArrowLeft, Search, Trash2, ChevronDown, ChevronUp, Flag } from 'lucide-react';
import { Navigation } from '@/components/shared/Navigation';

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
}) => {
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#1A1A1A] text-white overflow-hidden">
      <Navigation />
      
      {/* Main Content - Wrap existing content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top section */}
        <div className="flex flex-1 min-h-0">
          {/* Video Player */}
          <div className="w-1/2 h-full">
            <Card className="h-full bg-[#262626] border-r border-[#604abd]">
              <div className="h-full flex flex-col">
                <div className="flex-1 bg-black">
                  <video 
                    ref={videoRef}
                    className="w-full h-full"
                    style={{ display: 'none' }} // Hide until we have actual video
                  />
                  <div className="w-full h-full flex items-center justify-center text-[#E5E7EB]">
                    Video Player
                  </div>
                </div>
                <div className="p-2 bg-[#262626]">
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
                  <div className="relative h-6 bg-[#1A1A1A] rounded flex items-center border border-[#404040] shadow-md shadow-black/25">
                    <span className="absolute left-0 top-0 bottom-0 flex items-center px-1 text-white">V</span>
                    <div
                      className="absolute top-0 left-6 h-full bg-[#604abd] opacity-50"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <div
                      className="absolute top-0 left-6 w-px h-full bg-[#604abd]"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                    {/* Frame markers */}
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
            </Card>
          </div>

          {/* 3D Motion Capture Viewer */}
          <Card className="w-1/2 h-full bg-[#262626] border-l border-[#604abd]">
            <div className="h-full flex flex-col">
              <div className="flex-1 relative">
                <div className="absolute top-0 left-0 p-2 text-sm text-white">
                  FPS: 60 | Verts: 10000 | Faces: 5000
                </div>
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
            </div>
          </Card>
        </div>

        {/* Bottom section */}
        <div className="flex h-1/2 min-h-0">
          {/* Step Card and Timeline */}
          <div className="flex flex-1 overflow-hidden">
            {/* Step Card */}
            <motion.div
              className="flex"
              animate={{ width: isStepTypeCardCollapsed ? '56px' : '35%' }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`bg-[#262626] border-r border-[#604abd] flex flex-col transition-all duration-300 ${isStepTypeCardCollapsed ? 'w-0 overflow-hidden' : 'flex-grow'}`}>
                {/* Session Selection */}
                <div className="p-2 border-b border-[#604abd]">
                  <Select 
                    value={selectedSession.id} 
                    onValueChange={onSessionSelect}
                  >
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

                {/* Category Management */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1">
                    <AnimatePresence mode="wait">
                      {selectedCategory === null ? (
                        // Category Grid View
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4 space-y-4"
                        >
                          {/* Search and Add/Delete buttons */}
                          <div className="relative w-full">
                            <Input
                              type="text"
                              placeholder="Search step types..."
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
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Trash2 className="h-5 w-5 mr-2 text-white" /> {isStepDeleteMode ? 'Done' : 'Delete'}
                            </Button>
                          </div>

                          {/* Category Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            {filteredCategories.map((category, index) => (
                              <motion.div
                                key={`category-${category.id}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                layout
                              >
                                <Card
                                  className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] p-4 cursor-pointer hover:opacity-90 transition-opacity relative"
                                  onClick={() => !isStepDeleteMode && onCategorySelect(category.id)}
                                >
                                  {isStepDeleteMode && (
                                    <div
                                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center cursor-pointer z-10"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onDeleteCategory(category.id);
                                      }}
                                    >
                                      <X className="h-4 w-4 text-white" />
                                    </div>
                                  )}
                                  <h3 className="font-medium mb-2 text-white text-center">{category.name}</h3>
                                  <ul className="text-sm list-disc list-inside">
                                    {category.steps.slice(0, 3).map((step: string, stepIndex) => (
                                      <li key={`${category.id}-step-${stepIndex}`} className="text-white/90">{step}</li>
                                    ))}
                                    {category.steps.length > 3 && (
                                      <li className="text-white/70">...and {category.steps.length - 3} more</li>
                                    )}
                                  </ul>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        // Step List View
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full flex flex-col"
                        >
                          {/* Header */}
                          <div className="p-4 space-y-4 border-b border-[#604abd]">
                            <div className="flex justify-between items-center">
                              <Button
                                variant="ghost"
                                onClick={() => onCategorySelect(null)}
                                className="bg-[#1A1A1A] text-white hover:bg-[#262626]"
                              >
                                <ArrowLeft className="h-4 w-4 mr-2" /> Back
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={onStepDeleteModeToggle}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Trash2 className="h-4 w-4 mr-2 text-white" /> {isStepDeleteMode ? 'Done' : 'Delete'}
                              </Button>
                            </div>
                            <h2 className="text-xl font-semibold text-white text-center">
                              {categories.find(c => c.id === selectedCategory)?.name}
                            </h2>
                          </div>

                          {/* Steps List - Only show if the category has steps */}
                          <ScrollArea className="flex-1 p-4">
                            <div className="space-y-2">
                              {categories.find(c => c.id === selectedCategory)?.steps.map(step => (
                                <motion.div
                                  key={step}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Button
                                    className={`w-[95%] flex justify-between items-center relative bg-[#1A1A1A] text-white hover:bg-[#262626] ${
                                      isStepDeleteMode ? 'pointer-events-none' : ''
                                    }`}
                                    onClick={() => !isStepDeleteMode && onAddQuickTag(step)}
                                    draggable={!isStepDeleteMode}
                                    onDragStart={(e) => !isStepDeleteMode && e.dataTransfer.setData('text/plain', step)}
                                  >
                                    <span>{step}</span>
                                    {!isStepDeleteMode && (
                                      <Plus className="h-4 w-4 text-white ml-2" />
                                    )}
                                    {isStepDeleteMode && (
                                      <div 
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center cursor-pointer z-10"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          onDeleteStep(selectedCategory!, step);
                                        }}
                                        style={{ pointerEvents: 'auto' }}
                                      >
                                        <X className="h-3 w-3 text-white" />
                                      </div>
                                    )}
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          </ScrollArea>

                          {/* Add Step Button - Always show at the bottom */}
                          <div className="p-4 border-t border-[#604abd]">
                            <Button
                              className="w-full bg-white hover:bg-gray-100 text-gray-800"
                              onClick={onAddStepClick}
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add Step
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ScrollArea>
                </div>
              </Card>

              {/* Vertical Control Column */}
              <div className="w-14 bg-[#262626] border-x border-[#604abd] flex flex-col items-center py-2 space-y-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`text-white hover:bg-red-400 ${isTimelineLocked ? 'bg-red-500' : ''}`}
                  onClick={onTimelineLockToggle}
                >
                  {isTimelineLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`text-white hover:bg-white/10 ${isFlagSelected ? 'border border-white' : ''}`}
                  onClick={onFlagToggle}
                >
                  <Flag className="h-4 w-4" />
                </Button>
                {/* Placeholder buttons */}
                {Array.from({ length: 8 }).map((_, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 bg-gray-700 opacity-50 cursor-not-allowed"
                    disabled
                  />
                ))}
                {/* Collapse toggle button */}
                <motion.div
                  className="w-full h-8 bg-gray-700 hover:bg-gray-600 flex items-center justify-center cursor-pointer transition-colors duration-300"
                  onClick={onStepTypeCardCollapse}
                  animate={{ rotate: isStepTypeCardCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Timeline */}
            <div className="flex-1 flex flex-col overflow-hidden" style={{ width: isStepTypeCardCollapsed ? 'calc(100% - 56px)' : '65%' }}>
              {/* Quick Label Button Row */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-t border-b border-[#604abd]">
                <div className="flex items-center space-x-2 overflow-x-auto flex-grow quick-label-container">
                  {quickTags.map((tag, index) => (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{
                        opacity: selectedQuickTag && selectedQuickTag !== tag ? 0.5 : 1,
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
                  className={`bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 ${isQuickLabelDeleteMode ? 'bg-red-600' : ''}`}
                  onClick={onQuickLabelDeleteModeToggle}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Timeline Content */}
              <Card className="flex-1 bg-[#262626] flex flex-col overflow-hidden border border-[#604abd]">
                {/* Timeline Ruler */}
                <div className="h-6 bg-[#1A1A1A] border-b border-[#604abd] flex items-center px-2 w-full">
                  {/* Timecode ruler */}
                  {Array.from({ length: Math.ceil(duration / 30) }).map((_, index) => (
                    <div key={index} className="flex-1 flex items-center">
                      <div className="w-px h-2 bg-[#E5E7EB]" />
                      <span className="text-xs ml-1">{formatTimecode(index * 30)}</span>
                      {/* Frame markers */}
                      {Array.from({ length: 5 }).map((_, frameIndex) => (
                        <div
                          key={frameIndex}
                          className="absolute top-0 w-px h-2 bg-[#604abd]/50"
                          style={{ left: `${((index * 30 + frameIndex * 6) / duration) * 100}%` }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Timeline Tracks */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full w-full">
                    <div className="space-y-1 w-full p-2">
                      {/* Video track */}
                      <div className="h-12 bg-[#1A1A1A] relative flex items-center">
                        <span className="w-8 bg-gray-700 text-white text-xs p-1 rounded-sm flex-shrink-0">V</span>
                        <div className="flex-1 h-full bg-[#262626] ml-1">
                          {/* Video thumbnails would go here */}
                        </div>
                      </div>
                      {/* Audio track */}
                      <div className="h-12 bg-[#1A1A1A] relative flex items-center">
                        <span className="w-8 bg-gray-700 text-white text-xs p-1 rounded-sm flex-shrink-0">A</span>
                        <div className="flex-1 h-full bg-[#262626] ml-1">
                          {/* Audio waveform would go here */}
                          <div className="absolute inset-0 bg-[#4A90E2] opacity-20" />
                        </div>
                      </div>
                      {/* Sensor data tracks */}
                      {selectedChannels.map((channel, index) => (
                        <motion.div
                          key={channel}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 48 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-[#1A1A1A] relative flex items-center"
                        >
                          <span className="w-8 bg-gray-700 text-white text-xs p-1 rounded-sm flex-shrink-0">{channel}</span>
                          <div className="flex-1 h-full bg-[#262626] ml-1">
                            {/* Sensor data visualization would go here */}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute right-2 opacity-0 hover:opacity-100 transition-opacity"
                            onClick={() => onChannelSelect(false, channel)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                      {/* Empty row for new channels */}
                      {selectedChannels.length < allChannels.length && (
                        <div className="h-12 bg-[#1A1A1A] relative flex items-center">
                          <span className="w-8 bg-gray-700 text-white text-xs p-1 rounded-sm flex-shrink-0">{selectedChannels.length + 1}</span>
                          <div className="flex-1 h-full bg-[#262626] ml-1" />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </Card>

              {/* Channel View Toggle */}
              <div className="border-t border-[#604abd]">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center py-1 text-[#E5E7EB] hover:text-[#604abd]"
                  onClick={onChannelViewToggle}
                >
                  {isChannelViewExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span className="ml-2">{isChannelViewExpanded ? "Hide" : "Show"} 126 Channel View</span>
                </Button>
                <AnimatePresence>
                  {isChannelViewExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#1A1A1A] p-2"
                    >
                      <ScrollArea className="h-40">
                        <div className="grid grid-cols-4 gap-2">
                          {allChannels.map((channel, index) => (
                            <div key={index} className="flex items-center">
                              <Checkbox
                                id={`channel-${index}`}
                                checked={selectedChannels.includes(channel)}
                                onCheckedChange={(checked) => {
                                  onChannelSelect(checked as boolean, channel);
                                }}
                                className="bg-gray-700 border-gray-600 text-[#604abd] rounded-sm focus:ring-[#604abd] focus:ring-offset-0"
                              />
                              <label htmlFor={`channel-${index}`} className="ml-2 text-sm text-white">{channel}</label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isAddingStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Dialog open={isAddingStep} onOpenChange={onAddStepCancel}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Step</DialogTitle>
                </DialogHeader>
                <Input
                  type="text"
                  placeholder="Enter step name"
                  value={newStepName}
                  onChange={(e) => onNewStepNameChange(e.target.value)}
                  className="mt-4 w-full"
                />
                <DialogFooter>
                  <Button onClick={onAddStep}>Add</Button>
                  <Button variant="ghost" onClick={onAddStepCancel}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAddingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Dialog open={isAddingCategory} onOpenChange={onAddCategoryCancel}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <Input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => onNewCategoryNameChange(e.target.value)}
                  className="mt-4 w-full"
                />
                <DialogFooter>
                  <Button onClick={onAddCategory}>Add</Button>
                  <Button variant="ghost" onClick={onAddCategoryCancel}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 