'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Trash2, ArrowLeft, Plus, Search, X, Pencil, Check, ChevronLeftSquare, ChevronRightSquare, ChevronUp, ChevronDown, Undo } from 'lucide-react'

interface Clip {
  id: number;
  title: string;
  thumbnail: string;
  rated: boolean;
  inProgress: boolean;
}

interface Step {
  id: string;
  name: string;
  ratings: Rating[];
  totalClips: number;
  ratedClips: number;
}

interface Rating {
  id: string;
  name: string;
  scaleStart: number;
  scaleEnd: number;
}

interface NewRating {
  name: string;
  scaleStart: number;
  scaleEnd: number;
}

interface EditingRating {
  id: string;
  name: string;
  scaleStart: number;
  scaleEnd: number;
}

interface ClipCardProps {
  clip: Clip;
  isActive?: boolean;
  isPending?: boolean;
  isCompleted?: boolean;
}

interface StepCardProps {
  step: Step;
  onClick: () => void;
}

interface RatingCardProps {
  rating: Rating;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  editingRating: EditingRating | null;
  setEditingRating: React.Dispatch<React.SetStateAction<EditingRating | null>>;
  handleEditRating: (rating: Rating) => void;
}

interface TimelineRow {
  id: string;
  label: string;
  type: 'video' | 'audio' | 'sensor';
}

const mockClips: Clip[] = [
  { id: 1, title: 'Clip 1', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: false },
  { id: 2, title: 'Clip 2', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: true },
  { id: 3, title: 'Clip 3', thumbnail: '/placeholder.svg?height=80&width=80', rated: true, inProgress: false },
  { id: 4, title: 'Clip 4', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: false },
  { id: 5, title: 'Clip 5', thumbnail: '/placeholder.svg?height=80&width=80', rated: true, inProgress: false },
  { id: 6, title: 'Clip 6', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: true },
  { id: 7, title: 'Clip 7', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: false },
  { id: 8, title: 'Clip 8', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: false },
  { id: 9, title: 'Clip 9', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: false },
  { id: 10, title: 'Clip 10', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: false },
]

const mockStepTypes: Step[] = [
  {
    id: '1',
    name: 'Initial Position',
    ratings: [
      { id: '1', name: 'Posture', scaleStart: 1, scaleEnd: 5 },
      { id: '2', name: 'Balance', scaleStart: 1, scaleEnd: 10 },
    ],
    totalClips: 15,
    ratedClips: 7,
  },
  {
    id: '2',
    name: 'Movement Execution',
    ratings: [
      { id: '3', name: 'Speed', scaleStart: 1, scaleEnd: 5 },
      { id: '4', name: 'Precision', scaleStart: 1, scaleEnd: 10 },
    ],
    totalClips: 20,
    ratedClips: 20,
  },
]

const initialTimelineRows: TimelineRow[] = [
  { id: 'video', label: 'V', type: 'video' },
  { id: 'audio', label: 'A', type: 'audio' },
  { id: 'sensor1', label: '1', type: 'sensor' },
]

const allChannels: string[] = Array.from({ length: 126 }, (_, i) => `Channel ${i + 1}`)

const ClipCard: React.FC<ClipCardProps> = ({ 
  clip, 
  isActive = false,
  isPending = false,
  isCompleted = false 
}) => {
  return (
    <div className="relative flex flex-col bg-gradient-to-r from-[#604abd] to-[#d84bf7] rounded-lg overflow-hidden">
      <div className="aspect-video w-full">
        <img 
          src={clip.thumbnail} 
          alt={clip.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-1">
        <p className="text-xs text-white truncate">{clip.title}</p>
      </div>

      <div 
        className={`
          absolute bottom-0 left-0 right-0 h-1
          ${isCompleted 
            ? 'bg-green-500'
            : isActive
              ? 'bg-gray-400'
              : 'bg-red-500'
          }
        `}
      />
    </div>
  );
};

const StepCard: React.FC<StepCardProps> = ({ step, onClick }) => {
  return (
    <div 
      className="relative flex flex-col bg-gradient-to-r from-[#604abd] to-[#d84bf7] rounded-lg overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video w-full flex items-center justify-center">
        <span className="text-white font-semibold text-center">{step.name}</span>
      </div>

      <div className="p-1">
        <p className="text-xs text-white truncate text-center">{step.ratedClips}/{step.totalClips} Rated</p>
      </div>
    </div>
  );
};

const RatingCard: React.FC<RatingCardProps> = ({ 
  rating, 
  isEditing, 
  onEdit, 
  onDelete, 
  editingRating, 
  setEditingRating, 
  handleEditRating 
}) => {
  return (
    <div className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] p-4 rounded-lg flex flex-col items-center justify-center relative group">
      {editingRating?.id === rating.id ? (
        <>
          <Input
            value={editingRating.name}
            onChange={(e) => setEditingRating(prev => prev ? {...prev, name: e.target.value} : null)}
            className="bg-gray-700 text-white border-gray-600 w-full mb-2 text-center"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={editingRating.scaleStart}
              onChange={(e) => setEditingRating(prev => prev ? {...prev, scaleStart: parseInt(e.target.value)} : null)}
              className="w-16 bg-gray-700 text-white border-gray-600 text-center"
              min={1}
            />
            <span className="text-white">-</span>
            <Input
              type="number"
              value={editingRating.scaleEnd}
              onChange={(e) => setEditingRating(prev => prev ? {...prev, scaleEnd: parseInt(e.target.value)} : null)}
              className="w-16 bg-gray-700 text-white border-gray-600 text-center"
              min={2}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-green-500 hover:text-green-700 p-0 mt-2"
            onClick={() => handleEditRating(rating)}
          >
            <Check className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <span className="text-white text-center font-semibold">{rating.name}</span>
          <span className="text-gray-200 text-center">{rating.scaleStart}-{rating.scaleEnd}</span>
          {isEditing && (
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-700 p-0"
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 p-0"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default function Component() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [timeDisplayMode, setTimeDisplayMode] = useState('time')
  const [clips, setClips] = useState<Clip[]>(mockClips)
  const [stepTypes, setStepTypes] = useState<Step[]>(mockStepTypes)
  const [selectedStep, setSelectedStep] = useState<Step | null>(null)
  const [selectedStepTitle, setSelectedStepTitle] = useState<string>('')
  const [isAddingRating, setIsAddingRating] = useState(false)
  const [newRating, setNewRating] = useState<NewRating>({
    name: '',
    scaleStart: 1,
    scaleEnd: 10
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingPanelView, setRatingPanelView] = useState<'steps' | 'ratings' | 'rate'>('steps')
  const [stepSearchTerm, setStepSearchTerm] = useState('')
  const [selectedRatings, setSelectedRatings] = useState<{[key: string]: number}>({})
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingRating, setEditingRating] = useState<EditingRating | null>(null)
  const [isClipSectionCollapsed, setIsClipSectionCollapsed] = useState(false)
  const [timelineRows, setTimelineRows] = useState<TimelineRow[]>(initialTimelineRows)
  const [isChannelViewExpanded, setIsChannelViewExpanded] = useState(false)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [ratingHistory, setRatingHistory] = useState<{[key: string]: number}[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0)
    }
  }, [])

  useEffect(() => {
    const sensorRows = selectedChannels.map(channel => ({
      id: channel,
      label: channel.split(' ')[1],
      type: 'sensor' as const
    }))
    setTimelineRows([...initialTimelineRows, ...sensorRows])
  }, [selectedChannels])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTimecode = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    const frames = Math.floor((time % 1) * 30) // Assuming 30 fps
    return timeDisplayMode === 'time'
      ? `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`
  }

  const handleDeleteRating = (ratingId: string) => {
    if (selectedStep) {
      const updatedRatings = selectedStep.ratings.filter(rating => rating.id !== ratingId)
      const updatedStep = { ...selectedStep, ratings: updatedRatings }
      setStepTypes(prevSteps => prevSteps.map(step => 
        step.id === selectedStep.id ? updatedStep : step
      ))
      setSelectedStep(updatedStep)
    }
  }

  const handleAddRating = () => {
    if (selectedStep && newRating.name) {
      const updatedStep = {
        ...selectedStep,
        ratings: [
          ...selectedStep.ratings,
          { id: Date.now().toString(), ...newRating }
        ]
      }
      setStepTypes(prevSteps => prevSteps.map(step => 
        step.id === selectedStep.id ? updatedStep : step
      ))
      setSelectedStep(updatedStep)
      setIsAddingRating(false)
      setNewRating({ name: '', scaleStart: 1, scaleEnd: 10 })
    }
  }

  const handleSaveRatings = () => {
    if (selectedStep) {
      const updatedStep = {
        ...selectedStep,
        ratedClips: selectedStep.ratedClips + 1
      }
      setStepTypes(prevSteps => prevSteps.map(step => 
        step.id === selectedStep.id ? updatedStep : step
      ))
      setSelectedStep(updatedStep)
      setRatingHistory([...ratingHistory, selectedRatings])
      setSelectedRatings({})
    }
  }

  const handleUndoRating = () => {
    if (ratingHistory.length > 0) {
      const lastRating = ratingHistory[ratingHistory.length - 1]
      setSelectedRatings(lastRating)
      setRatingHistory(ratingHistory.slice(0, -1))
      if (selectedStep) {
        const updatedStep = {
          ...selectedStep,
          ratedClips: Math.max(0, selectedStep.ratedClips - 1)
        }
        setStepTypes(prevSteps => prevSteps.map(step => 
          step.id === selectedStep.id ? updatedStep : step
        ))
        setSelectedStep(updatedStep)
      }
    }
  }

  const handleEditRating = (rating: Rating) => {
    if (selectedStep) {
      const updatedRatings = selectedStep.ratings.map(r => 
        r.id === rating.id ? {
          ...r,
          name: editingRating?.name ?? r.name,
          scaleStart: editingRating?.scaleStart ?? r.scaleStart,
          scaleEnd: editingRating?.scaleEnd ?? r.scaleEnd
        } : r
      )
      const updatedStep = { ...selectedStep, ratings: updatedRatings }
      setStepTypes(prevSteps => prevSteps.map(step =>
        step.id === selectedStep.id ? updatedStep : step
      ))
      setSelectedStep(updatedStep)
      setEditingRating(null)
    }
  }

  const toggleChannelView = () => {
    setIsChannelViewExpanded(!isChannelViewExpanded)
  }

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(ch => ch !== channel)
        : [...prev, channel]
    )
  }

  const filteredClips = useMemo(() => 
    clips.filter(clip => 
      clip.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  , [clips, searchTerm]);

  const filteredSteps = useMemo(() =>
    stepTypes.filter(step =>
      step.name.toLowerCase().includes(stepSearchTerm.toLowerCase())
    )
  , [stepTypes, stepSearchTerm]);

  const activeClips = filteredClips.filter(clip => !clip.rated)
  const completedClips = filteredClips.filter(clip => clip.rated)

  const activeSteps = filteredSteps.filter(step => step.ratedClips < step.totalClips)
  const completedSteps = filteredSteps.filter(step => step.ratedClips === step.totalClips)

  const totalRatings = useMemo(() => {
    return stepTypes.reduce((acc, step) => ({
      rated: acc.rated + step.ratedClips,
      total: acc.total + step.totalClips
    }), { rated: 0, total: 0 })
  }, [stepTypes])

  const RatingPanel = () => {
    switch (ratingPanelView) {
      case 'steps':
        return (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-[#604abd]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search steps..."
                  value={stepSearchTerm}
                  onChange={(e) => setStepSearchTerm(e.target.value)}
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
                      onClick={() => {
                        setSelectedStep(step)
                        setSelectedStepTitle(step.name)
                        setRatingPanelView('ratings')
                        setIsDeleteMode(false)
                        setIsEditMode(false)
                        setEditingRating(null)
                      }}
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
                          onClick={() => {
                            setSelectedStep(step)
                            setSelectedStepTitle(step.name)
                            setRatingPanelView('ratings')
                            setIsDeleteMode(false)
                            setIsEditMode(false)
                            setEditingRating(null)
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-[#604abd]">
              <p className="text-center text-white">
                Total Steps Rated: {totalRatings.rated}/{totalRatings.total}
              </p>
            </div>
          </div>
        )
      case 'ratings':
        return (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-[#604abd]">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setRatingPanelView('steps')
                  setIsDeleteMode(false)
                  setIsEditMode(false)
                  setEditingRating(null)
                }}
                className="hover:bg-[#604abd]/10"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </Button>
              <span className="text-lg font-medium text-white">{selectedStep?.name}</span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsEditMode(!isEditMode)
                    setIsDeleteMode(false)
                    setEditingRating(null)
                  }}
                  className={`hover:bg-[#604abd]/10 ${isEditMode ? 'text-blue-500' : 'text-white'}`}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsDeleteMode(!isDeleteMode)
                    setIsEditMode(false)
                    setEditingRating(null)
                  }}
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
                    onEdit={() => setEditingRating(rating)}
                    onDelete={() => handleDeleteRating(rating.id)}
                    editingRating={editingRating}
                    setEditingRating={setEditingRating}
                    handleEditRating={handleEditRating}
                  />
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 space-y-2 border-t border-[#604abd]">
              <Button 
                className="w-full bg-gradient-to-r from-[#604abd] to-[#d84bf7]"
                onClick={() => setIsAddingRating(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Rating
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setRatingPanelView('rate')
                  setIsDeleteMode(false)
                  setIsEditMode(false)
                  setEditingRating(null)
                }}
              >
                Start Rating
              </Button>
            </div>
          </div>
        )
      case 'rate':
        return (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-[#604abd]">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setRatingPanelView('ratings')
                  setSelectedRatings({})
                }}
                className="hover:bg-[#604abd]/10"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </Button>
              <span className="text-lg font-medium text-white">{selectedStep?.name}</span>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setRatingPanelView('steps')
                  setSelectedRatings({})
                }}
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
                      onChange={(e) => setSelectedRatings(prev => ({ ...prev, [rating.id]: parseInt(e.target.value) }))}
                      className="w-20 text-center bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-[#604abd]">
              <div className="flex justify-between items-center">
                <Button 
                  className="flex-grow bg-green-600 hover:bg-green-700"
                  onClick={handleSaveRatings}
                >
                  Save and Next
                </Button>
                <Button 
                  className="ml-2 bg-blue-600 hover:bg-blue-700 w-1/4"
                  onClick={handleUndoRating}
                  disabled={ratingHistory.length === 0}
                >
                  <Undo className="h-4 w-4 mr-2" />
                  Undo
                </Button>
              </div>
            </div>
          </div>
        )
    }
  }

  const TimelineCard = () => (
    <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-2">
          {timelineRows.map(row => (
            <div key={row.id} className="flex items-center h-16 border-b border-[#404040]">
              <div className="w-8 h-full flex items-center justify-center bg-[#1A1A1A] text-white">
                {row.label}
              </div>
              <div className="flex-1 h-full bg-[#2A2A2A]">
                {/* Timeline content would go here */}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-2 border-t border-[#604abd]">
        <Button
          onClick={toggleChannelView}
          className="w-full flex items-center justify-center"
          variant="outline"
        >
          {isChannelViewExpanded ? (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Hide 126 Channel View
            </>
          ) : (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Show 126 Channel View
            </>
          )}
        </Button>
      </div>
      {isChannelViewExpanded && (
        <div className="p-4 border-t border-[#604abd] bg-[#1A1A1A]">
          <ScrollArea className="h-48">
            <div className="grid grid-cols-4 gap-4">
              {allChannels.map(channel => (
                <div key={channel} className="flex items-center h-12">
                  <Checkbox
                    id={channel}
                    checked={selectedChannels.includes(channel)}
                    onCheckedChange={() => handleChannelToggle(channel)}
                    className="border-white text-white"
                  />
                  <label htmlFor={channel} className="ml-2 text-sm text-white">
                    {channel}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </Card>
  )

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
                    onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
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
                            onClick={handlePlayPause}
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
                            onValueChange={(value) => setTimeDisplayMode(value)}
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
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                      onClick={() => setIsClipSectionCollapsed(!isClipSectionCollapsed)}
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
                  onClick={() => setIsClipSectionCollapsed(false)}
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
              <RatingPanel />
            </Card>
          </div>

          {/* Channel View Section */}
          <div className={`${isClipSectionCollapsed ? 'w-[calc(50%-3rem)]' : 'w-[calc(5/12*100%)]'} transition-all duration-300 ease-in-out`}>
            <TimelineCard />
          </div>
        </div>
      </div>

      {/* Add Rating Dialog */}
      <Dialog open={isAddingRating} onOpenChange={setIsAddingRating}>
        <DialogContent className="bg-[#1A1A1A] border border-[#604abd]">
          <DialogHeader>
            <DialogTitle className="text-[#E5E7EB]">Add Rating</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Rating Name */}
            <div className="space-y-2">
              <Label className="text-[#E5E7EB]">Rating Name</Label>
              <Input 
                value={newRating.name}
                onChange={(e) => setNewRating(prevRating => ({...prevRating, name: e.target.value}))}
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>

            {/* Scale Range */}
            <div className="space-y-2">
              <Label className="text-[#E5E7EB]">Scale Range</Label>
              <div className="flex items-center space-x-2 scale-inputs">
                <Input 
                  type="number"
                  value={newRating.scaleStart}
                  onChange={(e) => setNewRating(prevRating => ({...prevRating, scaleStart: parseInt(e.target.value)}))}
                  className="w-20 bg-gray-700 text-white border-gray-600 scale-input"
                  min={1}
                />
                <span className="text-white">to</span>
                <Input 
                  type="number"
                  value={newRating.scaleEnd}
                  onChange={(e) => setNewRating(prevRating => ({...prevRating, scaleEnd: parseInt(e.target.value)}))}
                  className="w-20 bg-gray-700 text-white border-gray-600 scale-input"
                  min={2}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="secondary"
              onClick={() => setIsAddingRating(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#604abd] to-[#d84bf7]"
              onClick={handleAddRating}
            >
              Add Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}