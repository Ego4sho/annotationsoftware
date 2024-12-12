import { Collection } from "@/types/upload";
import { ProgressCategory } from "../types";

interface ProjectProgressBarProps {
  collections: Collection[];
  category: ProgressCategory;
}

export function ProjectProgressBar({ collections, category }: ProjectProgressBarProps) {
  const total = collections.length;
  if (total === 0) return null;

  const notStarted = collections.filter(c => c.progress[category] === 'not-started').length;
  const inProgress = collections.filter(c => c.progress[category] === 'in-progress').length;
  const completed = collections.filter(c => c.progress[category] === 'completed').length;

  const notStartedWidth = (notStarted / total) * 100;
  const inProgressWidth = (inProgress / total) * 100;
  const completedWidth = (completed / total) * 100;

  const statuses = [];
  if (notStarted > 0) statuses.push({ type: 'not-started', count: notStarted });
  if (inProgress > 0) statuses.push({ type: 'in-progress', count: inProgress });
  if (completed > 0) statuses.push({ type: 'completed', count: completed });

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-400">
        <div className="flex gap-2">
          {statuses.map((status, index) => (
            <div key={status.type} className="flex gap-2">
              <span className={
                status.type === 'completed' ? 'text-green-500' :
                status.type === 'in-progress' ? 'text-yellow-500' :
                'text-red-500'
              }>
                {status.count} {status.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
              {index < statuses.length - 1 && <span>•</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden flex">
        {notStarted > 0 && (
          <div
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${notStartedWidth}%` }}
          />
        )}
        {inProgress > 0 && (
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${inProgressWidth}%` }}
          />
        )}
        {completed > 0 && (
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${completedWidth}%` }}
          />
        )}
      </div>
    </div>
  );
} 