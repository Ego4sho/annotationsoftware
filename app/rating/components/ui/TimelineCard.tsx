import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TimelineRow } from '../types';

interface TimelineCardProps {
  timelineRows: TimelineRow[];
  isChannelViewExpanded: boolean;
  selectedChannels: string[];
  allChannels: string[];
  onChannelViewToggle: () => void;
  onChannelToggle: (channel: string) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  timelineRows,
  isChannelViewExpanded,
  selectedChannels,
  allChannels,
  onChannelViewToggle,
  onChannelToggle
}) => {
  return (
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
          onClick={onChannelViewToggle}
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
                    onCheckedChange={() => onChannelToggle(channel)}
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
  );
}; 