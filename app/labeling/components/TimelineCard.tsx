import React, { useRef, useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/ui/strict-mode-droppable';
import { AudioWaveform, AudioWaveformRef } from './AudioWaveform';

interface TimelineRow {
  id: string;
  type: string;
}

interface TimelineCardProps {
  timelineRows: TimelineRow[];
  isChannelViewExpanded: boolean;
  selectedChannels: string[];
  allChannels: string[];
  onChannelViewToggle: () => void;
  onChannelToggle: (channel: string) => void;
  onRowReorder: (fromIndex: number, toIndex: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  videoUrl?: string;
  audioUrl?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  timelineRows,
  isChannelViewExpanded,
  selectedChannels,
  allChannels,
  onChannelViewToggle,
  onChannelToggle,
  onRowReorder,
  currentTime: externalCurrentTime,
  duration,
  onSeek,
  videoUrl,
  audioUrl,
  isPlaying,
  onPlayPause
}) => {
  const audioWaveformRef = useRef<AudioWaveformRef>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(externalCurrentTime);

  // Update internal time when external time changes
  useEffect(() => {
    setCurrentTime(externalCurrentTime);
  }, [externalCurrentTime]);

  // Handle audio play/pause separately from video
  const handleAudioPlayPause = async () => {
    console.log('TimelineCard: handleAudioPlayPause called');
    if (audioWaveformRef.current) {
      try {
        if (isAudioPlaying) {
          await audioWaveformRef.current.pause();
        } else {
          await audioWaveformRef.current.play();
        }
      } catch (error) {
        console.error('Error toggling audio playback:', error);
      }
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onRowReorder(result.source.index, result.destination.index);
  };

  const handleSeek = (time: number) => {
    console.log('TimelineCard: handleSeek called with time:', time);
    setCurrentTime(time);
    if (onSeek) {
      onSeek(time);
    }
  };

  const handlePlay = () => {
    console.log('TimelineCard: handlePlay called');
    setIsAudioPlaying(true);
  };

  const handlePause = () => {
    console.log('TimelineCard: handlePause called');
    setIsAudioPlaying(false);
  };

  // Update audio state when component unmounts
  useEffect(() => {
    return () => {
      if (audioWaveformRef.current && isAudioPlaying) {
        audioWaveformRef.current.pause();
      }
    };
  }, [isAudioPlaying]);

  // Format timestamp as MM:SS.ms with proper rounding
  const formatTimestamp = (time: number) => {
    if (typeof time !== 'number' || isNaN(time)) return '00:00.00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Timeline ruler */}
          <div className="h-6 bg-[#1A1A1A] border-b border-[#404040] relative mb-2">
            <div className="absolute top-1 left-2 text-xs text-white/60 font-mono tracking-wider">
              {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
            </div>
          </div>

          {/* Audio waveform row */}
          <div className="flex items-center h-16 border-b border-[#404040] overflow-visible">
            <div 
              className="w-8 h-full flex items-center justify-center bg-[#1A1A1A] text-white flex-shrink-0 cursor-pointer hover:bg-[#2A2A2A]"
              onClick={handleAudioPlayPause}
            >
              {isAudioPlaying ? '⏸' : '▶'}
            </div>
            <div className="flex-1 h-full bg-[#2A2A2A] relative select-none" style={{ minHeight: '64px' }}>
              <div className="absolute inset-0" style={{ minHeight: '64px' }}>
                <AudioWaveform
                  ref={audioWaveformRef}
                  audioUrl={audioUrl}
                  currentTime={currentTime}
                  duration={duration || 0}
                  height={64}
                  onSeek={handleSeek}
                  onPlay={handlePlay}
                  onPause={handlePause}
                />
              </div>
            </div>
          </div>

          {/* Draggable channel rows */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="timeline-rows">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {selectedChannels.map((channel, index) => (
                    <Draggable 
                      key={`draggable-channel-${channel}`}
                      draggableId={`draggable-channel-${channel}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center h-16 border-b border-[#404040]"
                        >
                          <div 
                            className="w-8 h-full flex items-center justify-center bg-[#1A1A1A] text-white cursor-move"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <div className="flex-1 h-full bg-[#2A2A2A]">
                            {/* Current time indicator */}
                            <div 
                              className="absolute top-0 w-0.5 h-full bg-white"
                              style={{ 
                                left: `${(currentTime / duration) * 100}%`,
                                transform: 'translateX(-50%)',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-[#604abd]">
        <Button
          onClick={onChannelViewToggle}
          className="w-full flex items-center justify-center text-white border-white hover:bg-[#604abd]/20"
          variant="outline"
        >
          {isChannelViewExpanded ? (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Hide Channel View
            </>
          ) : (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Show Channel View
            </>
          )}
        </Button>
      </div>

      {isChannelViewExpanded && (
        <div className="p-4 border-t border-[#604abd] bg-[#1A1A1A]">
          <ScrollArea className="h-48">
            <div className="grid grid-cols-4 gap-4">
              {allChannels.map(channel => (
                <div 
                  key={channel} 
                  className="flex items-center h-12 bg-gray-800 rounded-lg p-2 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => onChannelToggle(channel)}
                >
                  <Checkbox
                    id={channel}
                    checked={selectedChannels.includes(channel)}
                    onCheckedChange={() => onChannelToggle(channel)}
                    className="border-white text-white data-[state=checked]:bg-[#604abd] data-[state=checked]:text-white"
                  />
                  <label 
                    htmlFor={channel} 
                    className="ml-2 text-sm text-white cursor-pointer flex-1 select-none"
                  >
                    {channel}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </Card>
  );
}; 