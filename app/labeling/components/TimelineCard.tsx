import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/ui/strict-mode-droppable';
import { AudioWaveform } from './AudioWaveform';

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
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  timelineRows,
  isChannelViewExpanded,
  selectedChannels,
  allChannels,
  onChannelViewToggle,
  onChannelToggle,
  onRowReorder,
  currentTime,
  duration,
  onSeek,
  videoUrl,
  audioUrl
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onRowReorder(result.source.index, result.destination.index);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  // Format timestamp as MM:SS
  const formatTimestamp = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Timeline ruler */}
          <div className="h-6 bg-[#1A1A1A] border-b border-[#404040] relative mb-2">
            <div className="absolute top-1 left-2 text-xs text-white/60">
              {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
            </div>
          </div>

          {/* Audio waveform row */}
          <div className="flex items-center h-16 border-b border-[#404040]">
            <div className="w-8 h-full flex items-center justify-center bg-[#1A1A1A] text-white">
              A
            </div>
            <div 
              className="flex-1 h-full bg-[#2A2A2A] relative cursor-pointer"
              onClick={handleWaveformClick}
            >
              <AudioWaveform
                audioUrl={audioUrl}
                currentTime={currentTime}
                duration={duration}
                height={64}
              />
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