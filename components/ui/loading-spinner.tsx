import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
    </div>
  );
} 