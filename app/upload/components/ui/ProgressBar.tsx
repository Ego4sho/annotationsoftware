import { cn } from "@/lib/utils"

type Status = 'not-started' | 'in-progress' | 'completed';

interface ProgressBarProps {
  status: Status;
}

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
      return 'bg-yellow-500';
    case 'not-started':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusWidth = (status: Status) => {
  switch (status) {
    case 'completed':
      return 'w-full';
    case 'in-progress':
      return 'w-1/2';
    case 'not-started':
      return 'w-0';
    default:
      return 'w-0';
  }
};

export function ProgressBar({ status }: ProgressBarProps) {
  return (
    <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          getStatusColor(status)
        )}
        style={{
          width: getStatusWidth(status)
        }}
      />
    </div>
  );
} 