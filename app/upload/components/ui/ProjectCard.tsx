import { Project } from "@/types/upload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteMode?: boolean;
}

export const ProjectCard = ({ project, onEdit, onDelete, deleteMode = false }: ProjectCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(project.id);
    }
  };

  return (
    <Card
      className="bg-[#262626] border-[#604abd] p-3 cursor-pointer hover:bg-[#303030] relative h-[200px] flex flex-col"
      onClick={() => onEdit?.(project)}
    >
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
        <div className="flex-grow">
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

        <div className="space-y-1.5 mt-2">
          <div className="space-y-0.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Progress</span>
              <span className="text-xs text-gray-400 capitalize">{project.status}</span>
            </div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  project.status === 'ready' ? 'bg-green-500' :
                  project.status === 'processing' ? 'bg-yellow-500' :
                  project.status === 'error' ? 'bg-red-500' :
                  'bg-gray-600'
                }`}
                style={{
                  width: project.status === 'ready' ? '100%' :
                         project.status === 'processing' ? '50%' :
                         project.status === 'error' ? '100%' :
                         '0%'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}; 