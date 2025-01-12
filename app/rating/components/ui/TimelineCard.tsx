import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { TimelineRow } from '../types';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/ui/strict-mode-droppable';
import { Slider } from "@/components/ui/slider";
import { formatTime } from '@/app/labeling/components/utils/formatTime';

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
  onSeek?: (time: number) => void;
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
  onSeek
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localTime, setLocalTime] = useState(currentTime);

  // Update localTime when currentTime changes and we're not dragging
  useEffect(() => {
    if (!isDragging) {
      setLocalTime(currentTime);
    }
  }, [currentTime, isDragging]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onRowReorder(result.source.index, result.destination.index);
  };

  const handleProgressChange = (value: number[]) => {
    if (value.length > 0) {
      setIsDragging(true);
      setLocalTime(value[0]);
      if (onSeek) {
        onSeek(value[0]);
      }
    }
  };

  const handleProgressCommit = () => {
    setIsDragging(false);
    if (onSeek) {
      onSeek(localTime);
    }
  };

  // Fixed rows (V and A) - not draggable
  const fixedRows = [
    { id: 'fixed-video-row', label: 'V', type: 'video' as const },
    { id: 'fixed-audio-row', label: 'A', type: 'audio' as const }
  ];

  return (
    <Card className="h-full bg-[#262626] border border-[#604abd] flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 bg-purple-500 text-white text-xs px-1 rounded z-50">
        Timeline Test Label
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Fixed rows without drag handles */}
          {fixedRows.map((row) => (
            <div
              key={row.id}
              className="flex items-center h-16 border-b border-[#404040]"
            >
              <div className="w-8 h-full flex items-center justify-center bg-[#1A1A1A] text-white">
                {row.label}
              </div>
              <div className="flex-1 h-full bg-[#2A2A2A] relative">
                {row.type === 'video' && (
                  <>
                    {/* Progress bar */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#604abd] opacity-30"
                      style={{ width: `${(localTime / (duration || 100)) * 100}%` }}
                    />
                    {/* Scrubbing slider */}
                    <div className="absolute inset-0 px-2 flex items-center">
                      <Slider
                        value={[localTime]}
                        min={0}
                        max={duration || 100}
                        step={0.01}
                        onValueChange={handleProgressChange}
                        onValueCommit={handleProgressCommit}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

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
                          <div className="flex-1 h-full bg-[#2A2A2A]" />
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