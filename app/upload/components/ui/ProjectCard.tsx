import { Project } from "@/types/upload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { ProgressBar } from "./ProgressBar";
import { ProgressCategory } from "../../types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  deleteMode?: boolean;
}

const getProgressCounts = (project: Project, category: ProgressCategory) => {
  const collections = project.collections || [];
  const total = collections.length;
  
  return {
    total,
    notStarted: collections.filter(c => c.progress?.[category] === 'not-started').length,
    inProgress: collections.filter(c => c.progress?.[category] === 'in-progress').length,
    completed: collections.filter(c => c.progress?.[category] === 'completed').length
  };
};

export const ProjectCard = ({ project, onEdit, onDelete, deleteMode = false }: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(project.id);
    }
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onEdit?.(project);
  };

  const categories: ProgressCategory[] = ['labeling', 'rating', 'validated'];

  return (
    <Card
      className={cn(
        "bg-[#262626] border-[#604abd] p-3 cursor-pointer hover:bg-[#303030] relative flex flex-col transition-all duration-300",
        isExpanded ? "h-[300px]" : "h-[200px]"
      )}
      onClick={handleClick}
    >
      <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1 rounded">Upload Page Project Card</div>
      {deleteMode && (
        <Button
          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 z-10"
          onClick={handleDelete}
          type="button"
        >
          <Trash2 className="h-4 w-4 text-white" />
        </Button>
      )}

      <div className="flex flex-col h-full">
        <div className="flex-grow mt-4">
          <h3 className="text-[#E5E7EB] font-medium text-base truncate">{project.name}</h3>
          <p className="text-gray-400 text-xs line-clamp-2 mt-0.5">{project.description}</p>
          <p className="text-gray-400 text-xs mt-1">
            {format(project.createdAt.toDate(), 'MMM d, yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 text-center mt-2">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-300">Collections</p>
            <p className="text-sm font-bold text-white">{project.collections?.length || 0}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-300">Status</p>
            <p className="text-sm font-bold text-white capitalize">{project.status}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-300">Files</p>
            <p className="text-sm font-bold text-white">
              {(project.collections || []).reduce((total, collection) => {
                return total + (
                  (collection.files?.video?.length || 0) +
                  (collection.files?.audio?.length || 0) +
                  (collection.files?.motion?.length || 0)
                );
              }, 0)}
            </p>
          </div>
        </div>

        <div className={`space-y-3 mt-4 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          {categories.map(category => {
            const counts = getProgressCounts(project, category);
            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span className="capitalize">{category}</span>
                  <div className="flex gap-2">
                    <span className="text-red-500">{counts.notStarted} Not Started</span>
                    <span>•</span>
                    <span className="text-yellow-500">{counts.inProgress} In Progress</span>
                    <span>•</span>
                    <span className="text-green-500">{counts.completed} Completed</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden flex">
                  {counts.notStarted > 0 && (
                    <div
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: `${(counts.notStarted / counts.total) * 100}%` }}
                    />
                  )}
                  {counts.inProgress > 0 && (
                    <div
                      className="h-full bg-yellow-500 transition-all duration-300"
                      style={{ width: `${(counts.inProgress / counts.total) * 100}%` }}
                    />
                  )}
                  {counts.completed > 0 && (
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${(counts.completed / counts.total) * 100}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}; 