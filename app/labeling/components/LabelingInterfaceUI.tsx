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
  return (
    <div className="flex-1 bg-[#1A1A1A] text-white overflow-hidden flex flex-col h-screen">
      <div className="flex flex-col h-full gap-4 p-4">
        {/* Top Section */}
        <div className="h-[50%] flex gap-4">
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
                          <Select value={timeDisplayMode} onValueChange={onTimeDisplayModeToggle}>
                            <SelectTrigger className="w-[90px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="time">Time</SelectItem>
                              <SelectItem value="frame">Frame</SelectItem>
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
        <div className="h-[45%] flex gap-4">
          {/* Step Type Card */}
          <div className={`${isStepTypeCardCollapsed ? 'w-12' : 'w-1/4'} transition-all duration-300 h-full`}>
            <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col">
              {/* Session Selection */}
              <div className="p-2 border-b border-[#604abd]">
                <Select 
                  value={selectedSession.id} 
                  onValueChange={onSessionSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map(session => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 text-xs">
                  <p>Date: {selectedSession.date}</p>
                  <p>Duration: {selectedSession.duration}</p>
                  <p>File Types: {selectedSession.fileTypes.join(', ')}</p>
                </div>
              </div>

              {/* Category Management */}
              <div className="flex-1 flex flex-col overflow-hidden h-full">
                <ScrollArea className="flex-1">
                  <div className="p-4">
                    {/* Search and Add/Delete buttons */}
                    <div className="relative w-full mb-4">
                      <Input
                        type="text"
                        placeholder="Search step types..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-10"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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

                    <div className="flex space-x-2 mb-4">
                      <Button
                        onClick={onAddCategoryClick}
                        className="flex-1 bg-gradient-to-r from-[#604abd] to-[#d84bf7]"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Category
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={onStepDeleteModeToggle}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> {isStepDeleteMode ? 'Done' : 'Delete'}
                      </Button>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <Card
                          key={category.id}
                          className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] p-4 cursor-pointer"
                          onClick={() => onCategorySelect(category.id)}
                        >
                          <h3 className="font-medium mb-2 text-center">{category.name}</h3>
                        </Card>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </Card>
          </div>

          {/* Timeline */}
          <div className="flex-1 h-full">
            <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col">
              {/* Quick Label Button Row */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#604abd]">
                <div className="flex items-center space-x-2 overflow-x-auto flex-grow">
                  {quickTags.map((tag, index) => (
                    <Button
                      key={index}
                      size="sm"
                      className={`
                        px-4 py-2 rounded-md relative
                        ${selectedQuickTag === tag
                          ? 'bg-gradient-to-r from-[#7059c4] to-[#de65f7] text-white'
                          : 'bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white'
                        }
                      `}
                      onClick={() => onQuickTagSelect(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onQuickLabelDeleteModeToggle}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Timeline Content */}
              <div className="flex-1 overflow-hidden h-full">
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-2">
                    {/* Timeline tracks */}
                    {selectedChannels.map((channel) => (
                      <div key={channel} className="h-12 bg-[#1A1A1A] relative flex items-center">
                        <span className="w-8 bg-gray-700 text-white text-xs p-1 rounded-sm">{channel}</span>
                        <div className="flex-1 h-full bg-[#262626] ml-1" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Channel View Toggle and Grid */}
              <div className="relative border-t border-[#604abd]">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center py-1"
                  onClick={onChannelViewToggle}
                >
                  {isChannelViewExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  <span className="ml-2">{isChannelViewExpanded ? "Hide" : "Show"} Channel View</span>
                </Button>

                <AnimatePresence>
                  {isChannelViewExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="absolute bottom-full left-0 right-0 bg-[#1A1A1A] border-t border-[#604abd]"
                    >
                      <ScrollArea className="h-64">
                        <div className="p-4 grid grid-cols-6 gap-2">
                          {allChannels.map((channel) => (
                            <div key={channel} className="flex items-center">
                              <Checkbox
                                id={channel}
                                checked={selectedChannels.includes(channel)}
                                onCheckedChange={(checked) => onChannelSelect(checked as boolean, channel)}
                                className="border-white text-white"
                              />
                              <label htmlFor={channel} className="ml-2 text-sm text-white">
                                {channel}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={isAddingStep} onOpenChange={onAddStepCancel}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Step</DialogTitle>
            </DialogHeader>
            <Input
              value={newStepName}
              onChange={(e) => onNewStepNameChange(e.target.value)}
              placeholder="Enter step name"
            />
            <DialogFooter>
              <Button onClick={onAddStep}>Add</Button>
              <Button variant="outline" onClick={onAddStepCancel}>Cancel</Button>
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