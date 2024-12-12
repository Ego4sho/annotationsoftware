import { Project, Collection } from '@/types/upload';
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ProgressBar } from '@/app/upload/components/ui/ProgressBar';
import { ProgressCategory } from '@/app/upload/types';

interface ProjectSelectionViewProps {
  projects: Project[];
  collections: Collection[];
  onProjectSelect: (projectId: string) => void;
  onUnassignedSelect: () => void;
}

const LabelProjectCard = ({ project, onSelect }: { project: Project; onSelect: () => void }) => {
  const getProgressCounts = (category: ProgressCategory) => {
    const collections = project.collections || [];
    const total = collections.length;
    
    return {
      total,
      notStarted: collections.filter(c => c.progress?.[category] === 'not-started').length,
      inProgress: collections.filter(c => c.progress?.[category] === 'in-progress').length,
      completed: collections.filter(c => c.progress?.[category] === 'completed').length
    };
  };

  const categories: ProgressCategory[] = ['labeling', 'rating', 'validated'];

  return (
    <Card
      className="bg-[#262626] border-[#604abd] p-3 cursor-pointer hover:bg-[#303030] relative flex flex-col h-[200px]"
      onClick={onSelect}
    >
      <div className="absolute top-0 left-0 bg-purple-500 text-white text-xs px-1 rounded">Label Page Project Card</div>
      <div className="flex flex-col h-full">
        <div className="flex-grow mt-4">
          <h3 className="text-[#E5E7EB] font-medium text-base truncate">{project.name}</h3>
          <p className="text-gray-400 text-xs line-clamp-2 mt-0.5">{project.description}</p>
          <p className="text-gray-400 text-xs mt-1">
            {format(project.createdAt.toDate(), 'MMM d, yyyy')}
          </p>
        </div>

        <div className="space-y-3 mt-4">
          {categories.map(category => {
            const counts = getProgressCounts(category);
            return (
              <div key={category}>
                <ProgressBar
                  category={category}
                  total={counts.total}
                  notStarted={counts.notStarted}
                  inProgress={counts.inProgress}
                  completed={counts.completed}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export function ProjectSelectionView({ 
  projects, 
  collections,
  onProjectSelect,
  onUnassignedSelect 
}: ProjectSelectionViewProps) {
  const unassignedCollections = collections.filter(c => !c.projectId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Select Project</h2>
        {unassignedCollections.length > 0 && (
          <Button
            onClick={onUnassignedSelect}
            className="bg-[#604abd] hover:bg-[#4c3a9e] text-white"
          >
            Unassigned Collections ({unassignedCollections.length})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <LabelProjectCard
            key={project.id}
            project={project}
            onSelect={() => onProjectSelect(project.id)}
          />
        ))}
      </div>
    </div>
  );
} 