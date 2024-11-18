'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, RotateCcw, RotateCw, ZoomIn, ZoomOut, Lock, Unlock, Plus, X, ArrowLeft, Search, Trash2, ChevronDown, ChevronUp, Flag } from 'lucide-react'

// Mock data
const mockSessions = [
  { id: '1', name: 'Session 1', date: '2023-06-20', duration: '00:30:00', fileTypes: ['MP4', 'MP3', 'BVH'] },
  { id: '2', name: 'Session 2', date: '2023-06-21', duration: '00:45:00', fileTypes: ['MP4', 'MP3', 'BVH'] },
  { id: '3', name: 'Session 3', date: '2023-06-22', duration: '01:00:00', fileTypes: ['MP4', 'MP3', 'BVH'] },
]

const mockStepCategories = [
  { id: '1', name: 'Jumps', steps: ['Single', 'Double', 'Triple', 'Quad'] },
  { id: '2', name: 'Spins', steps: ['Upright', 'Sit', 'Camel', 'Layback'] },
  { id: '3', name: 'Footwork', steps: ['Twizzles', 'Choctaws', 'Mohawks', 'Three-turns'] },
  { id: '4', name: 'Lifts', steps: ['Stationary', 'Straight Line', 'Curve', 'Rotational'] },
]

export default function LabelingInterface() {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(300) // Mock 5 minutes duration
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedSession, setSelectedSession] = useState(mockSessions[0])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [quickTags, setQuickTags] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isTimelineLocked, setIsTimelineLocked] = useState(false)
  const [isChannelViewExpanded, setIsChannelViewExpanded] = useState(false)
  const [allChannels, setAllChannels] = useState(Array.from({ length: 126 }, (_, i) => `Channel ${i + 1}`))
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [categories, setCategories] = useState(mockStepCategories)
  const [selectedQuickTag, setSelectedQuickTag] = useState<string | null>(null)
  const [isQuickLabelDeleteMode, setIsQuickLabelDeleteMode] = useState(false)
  const [isStepDeleteMode, setIsStepDeleteMode] = useState(false)
  const [isStepTypeCardCollapsed, setIsStepTypeCardCollapsed] = useState(false)
  const [newStepName, setNewStepName] = useState('')
  const [isAddingStep, setIsAddingStep] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [timeDisplayMode, setTimeDisplayMode] = useState<'time' | 'frame'>('time')
  const [isFlagSelected, setIsFlagSelected] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize 3D viewer
    if (canvasRef.current) {
      // Initialize WebGL context and set up 3D scene
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (isQuickLabelDeleteMode && !event.target.closest('.quick-label-container')) {
        setIsQuickLabelDeleteMode(false)
      }
      if (isStepDeleteMode && !event.target.closest('.step-list-container')) {
        setIsStepDeleteMode(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isQuickLabelDeleteMode, isStepDeleteMode])

  const formatTimecode = (time: number) => {
    if (timeDisplayMode === 'frame') {
      return Math.floor(time * 30).toString().padStart(5, '0')
    }
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)
    const frames = Math.floor((time % 1) * 30)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Implement actual video playback logic here
  }

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime)
    // Implement actual seeking logic here
  }

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => Math.max(0.5, Math.min(4, prev + (direction === 'in' ? 0.1 : -0.1))))
  }

  const handleAddQuickTag = (step: string) => {
    if (!quickTags.includes(step)) {
      setQuickTags(prev => [...prev.slice(0, 5), step])
    }
  }

  const handleDeleteStep = (categoryId: string, step: string) => {
    setCategories(prev => prev.map(category =>
      category.id === categoryId
        ? { ...category, steps: category.steps.filter(s => s !== step) }
        : category
    ))
    const updatedCategory = categories.find(c => c.id === categoryId)
    if (updatedCategory && updatedCategory.steps.length === 1) {
      setIsStepDeleteMode(false)
    }
  }

  const handleAddCategory = () => {
    if (newCategoryName && !categories.some(cat => cat.name === newCategoryName)) {
      const newId = (categories.length + 1).toString()
      setCategories(prev => [...prev, { id: newId, name: newCategoryName, steps: [] }])
      setNewCategoryName('')
      setIsAddingCategory(false)
    }
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => {
      const updatedCategories = prev.filter(category => category.id !== id)
      if (updatedCategories.length === 0) {
        setIsStepDeleteMode(false)
      }
      return updatedCategories
    })
  }

  const handleQuickTagSelect = (tag: string) => {
    setSelectedQuickTag(prev => prev === tag ? null : tag)
  }

  const handleDeleteQuickTag = (tag: string) => {
    setQuickTags(prev => prev.filter(t => t !== tag))
    if (selectedQuickTag === tag) {
      setSelectedQuickTag(null)
    }
  }

  const handleQuickLabelDeleteMode = () => {
    setIsQuickLabelDeleteMode(prev => !prev)
    setIsStepDeleteMode(false)
  }

  const handleStepDeleteMode = () => {
    setIsStepDeleteMode(prev => {
      const newMode = !prev
      if (newMode && selectedCategory) {
        const category = categories.find(c => c.id === selectedCategory)
        return category && category.steps.length > 0
      }
      return newMode
    })
    setIsQuickLabelDeleteMode(false)
  }

  const handleAddStep = () => {
    if (newStepName && selectedCategory) {
      setCategories(prev => prev.map(category =>
        category.id === selectedCategory
          ? { ...category, steps: [...category.steps, newStepName] }
          : category
      ))
      setNewStepName('')
      setIsAddingStep(false)
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <TooltipProvider>
      <div className="h-screen bg-[#1A1A1A] text-[#E5E7EB] flex flex-col overflow-hidden">
        {/* Top section */}
        <div className="flex flex-1 min-h-0">
          {/* Video Player */}
          <div className="w-1/2 h-full">
            <Card className="h-full bg-[#262626] border-r border-[#604abd]">
              <div className="h-full flex flex-col">
                <div className="flex-1 bg-black">
                  {/* Video player would go here */}
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
                      <Button size="sm" variant="ghost" onClick={handlePlayPause} className="text-[#E5E7EB] hover:text-[#604abd]">
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
                        onValueChange={(value) => setTimeDisplayMode(value as 'time' | 'frame')}
                      >
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
                <div className="p-2 border-b border-[#604abd]">
                  <Select value={selectedSession.id} onValueChange={(value) => setSelectedSession(mockSessions.find(s => s.id === value) || mockSessions[0])}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Session" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSessions.map(session => (
                        <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 text-xs">
                    <p className="text-white">Date: {selectedSession.date}</p>
                    <p className="text-white">Duration: {selectedSession.duration}</p>
                    <p className="text-white">File Types: {selectedSession.fileTypes.join(', ')}</p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 space-y-4 w-full">
                    <div className="relative w-full">
                      <Input
                        type="text"
                        placeholder="Search step types..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 focus:ring-[#604abd]"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E5E7EB]" size={18} />
                      {searchTerm && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setSearchTerm('')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex space-x-4 w-full">
                      {selectedCategory === null && (
                        <>
                          <AnimatePresence>
                            {isAddingCategory ? (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center space-x-2"
                              >
                                <Input
                                  type="text"
                                  placeholder="Enter category name"
                                  value={newCategoryName}
                                  onChange={(e) => setNewCategoryName(e.target.value)}
                                  className="flex-grow bg-gray-700 text-white placeholder-gray-400"
                                  autoFocus
                                />
                                <Button size="sm" onClick={handleAddCategory} className="bg-[#7059c4] text-white hover:bg-[#604abd]">Save</Button>
                                <Button size="sm" onClick={() => {
                                  setIsAddingCategory(false)
                                  setNewCategoryName('')
                                }} className="bg-[#7059c4] text-white hover:bg-[#604abd]">Cancel</Button>
                              </motion.div>
                            ) : (
                              <Button
                                onClick={() => setIsAddingCategory(true)}
                                className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white flex-1"
                              >
                                <Plus className="h-5 w-5 mr-2" /> Add Category
                              </Button>
                            )}
                          </AnimatePresence>
                          <Button
                            variant="destructive"
                            onClick={handleStepDeleteMode}
                            className="flex-1"
                          >
                            <Trash2 className="h-5 w-5 mr-2" /> {isStepDeleteMode ? 'Done' : 'Delete'}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="flex-1 p-2">
                    <AnimatePresence>
                      {selectedCategory === null ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="grid grid-cols-2 gap-4"
                        >
                          {filteredCategories.map(category => (
                            <motion.div
                              key={category.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.2 }}
                              layout
                            >
                              <Card
                                className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] p-4 cursor-pointer hover:opacity-90 transition-opacity relative"
                                onClick={() => !isStepDeleteMode && setSelectedCategory(category.id)}
                              >
                                {isStepDeleteMode && (
                                  <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF4444] rounded-full flex items-center justify-center"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteCategory(category.id)
                                      if (categories.length === 1) {
                                        setIsStepDeleteMode(false)
                                      }
                                    }}
                                  >
                                    <X className="h-4 w-4 text-white" />
                                  </motion.button>
                                )}
                                <h3 className="font-medium mb-2 text-white text-center">{category.name}</h3>
                                <ul className="text-sm list-disc list-inside">
                                  {category.steps.slice(0, 3).map(step => (
                                    <li key={step} className="text-white/90">{step}</li>
                                  ))}
                                  {category.steps.length > 3 && (
                                    <li className="text-white/70">...and {category.steps.length - 3} more</li>
                                  )}
                                </ul>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-2 step-list-container"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setSelectedCategory(null)
                                setIsStepDeleteMode(false)
                              }}
                              className="bg-gray-700 text-white hover:bg-gray-600"
                            >
                              <ArrowLeft className="h-4 w-4 mr-2" /> Back
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleStepDeleteMode}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> {isStepDeleteMode ? 'Done' : 'Delete'}
                            </Button>
                          </div>
                          {categories.find(c => c.id === selectedCategory)?.steps.map(step => (
                            <motion.div
                              key={step}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Button
                                className={`w-full justify-between relative ${
                                  isStepDeleteMode ? 'pointer-events-none' : ''
                                }`}
                                onClick={() => !isStepDeleteMode && handleAddQuickTag(step)}
                                draggable={!isStepDeleteMode}
                                onDragStart={(e) => !isStepDeleteMode && e.dataTransfer.setData('text/plain', step)}
                              >
                                {step}
                                {isStepDeleteMode && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteStep(selectedCategory!, step)
                                    }}
                                  >
                                    <X className="h-3 w-3 text-white" />
                                  </motion.div>
                                )}
                              </Button>
                            </motion.div>
                          ))}
                          {selectedCategory && (
                            <Button
                              className="w-full mt-2 bg-white text-gray-800 hover:bg-gray-200"
                              onClick={() => setIsAddingStep(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add Step
                            </Button>
                          )}
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
                  onClick={() => setIsTimelineLocked(!isTimelineLocked)}
                >
                  {isTimelineLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`text-white hover:bg-white/10 ${isFlagSelected ? 'border border-white' : ''}`}
                  onClick={() => setIsFlagSelected(!isFlagSelected)}
                >
                  <Flag className="h-4 w-4" />
                </Button>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 bg-gray-700 opacity-50 cursor-not-allowed"
                    disabled
                  />
                ))}
                <motion.div
                  className="w-full h-8 bg-gray-700 hover:bg-gray-600 flex items-center justify-center cursor-pointer transition-colors duration-300"
                  onClick={() => setIsStepTypeCardCollapsed(!isStepTypeCardCollapsed)}
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
                        onClick={() => handleQuickTagSelect(tag)}
                      >
                        {tag}
                        {isQuickLabelDeleteMode && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteQuickTag(tag)
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
                  onClick={handleQuickLabelDeleteMode}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Timeline content */}
              <Card className="flex-1 bg-[#262626] flex flex-col overflow-hidden border border-[#604abd]">
                {/* Timeline Ruler */}
                <div className="h-6 bg-[#1A1A1A] border-b border-[#604abd] flex items-center px-2 w-full">
                  {/* Timecode ruler */}
                  {Array.from({ length: Math.ceil(duration / 30) }).map((_, index) => (
                    <div key={index} className="flex-1 flex items-center">
                      <div className="w-px h-2 bg-[#E5E7EB]" />
                      <span className="text-xs ml-1">{formatTimecode(index * 30)}</span>
                    </div>
                  ))}
                </div>

                {/* Timeline Tracks */}
                <div className="flex-1 overflow-hidden" ref={timelineRef}>
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
                            onClick={() => setSelectedChannels(prev => prev.filter(ch => ch !== channel))}
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

                {/* Channel View Toggle */}
                <div className="border-t border-[#604abd]">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center py-1 text-[#E5E7EB] hover:text-[#604abd]"
                    onClick={() => setIsChannelViewExpanded(!isChannelViewExpanded)}
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
                        className="
bg-[#1A1A1A] p-2"
                      >
                        <ScrollArea className="h-40">
                          <div className="grid grid-cols-4 gap-2">
                            {allChannels.map((channel, index) => (
                              <div key={index} className="flex items-center">
                                <Checkbox
                                  id={`channel-${index}`}
                                  checked={selectedChannels.includes(channel)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedChannels(prev => [...prev, channel])
                                    } else {
                                      setSelectedChannels(prev => prev.filter(ch => ch !== channel))
                                    }
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
              </Card>
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
            <Dialog open={isAddingStep} onOpenChange={setIsAddingStep}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Step</DialogTitle>
                </DialogHeader>
                <Input
                  type="text"
                  placeholder="Enter step name"
                  value={newStepName}
                  onChange={(e) => setNewStepName(e.target.value)}
                  className="mt-4 w-full"
                />
                <DialogFooter>
                  <Button onClick={handleAddStep}>Add</Button>
                  <Button variant="ghost" onClick={() => setIsAddingStep(false)}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  )
}