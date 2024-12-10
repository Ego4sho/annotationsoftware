import { useState } from 'react';
import { Collection, Project } from '@/types/upload';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ProjectProgressBar } from './ProjectProgressBar';

interface ProjectListProps {
  projects: Project[];
  collections: Collection[];
  onAddProject: () => void;
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  collections,
  onAddProject,
  onCollectionMove
}) => {
  const [draggedCollectionId, setDraggedCollectionId] = useState<string | null>(null);
  const [dragOverProjectId, setDragOverProjectId] = useState<string | null>(null);

  const handleDragStart = (collectionId: string) => {
    setDraggedCollectionId(collectionId);
  };

  const handleDragOver = (e: React.DragEvent, projectId: string) => {
    e.preventDefault();
    setDragOverProjectId(projectId);
  };

  const handleDrop = (e: React.DragEvent, targetProjectId: string) => {
    e.preventDefault();
    if (!draggedCollectionId) return;
    onCollectionMove(draggedCollectionId, null, targetProjectId);
    setDraggedCollectionId(null);
    setDragOverProjectId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Projects</h2>
        <Button
          onClick={onAddProject}
          className="bg-[#604abd] hover:bg-[#4c3a9e] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const projectCollections = collections.filter(c => c.projectId === project.id);
          
          return (
            <Card
              key={project.id}
              className={`bg-[#262626] border-[#604abd] p-4 ${
                dragOverProjectId === project.id ? 'border-2 border-purple-500' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, project.id)}
              onDrop={(e) => handleDrop(e, project.id)}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{project.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {format(project.createdAt.toDate(), 'MMM d, yyyy')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Labeling</span>
                      <span>
                        {projectCollections.filter(c => c.progress.labeling === 'completed').length}/
                        {projectCollections.length} Completed
                      </span>
                    </div>
                    <ProjectProgressBar collections={projectCollections} category="labeling" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Rating</span>
                      <span>
                        {projectCollections.filter(c => c.progress.rating === 'completed').length}/
                        {projectCollections.length} Completed
                      </span>
                    </div>
                    <ProjectProgressBar collections={projectCollections} category="rating" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Validated</span>
                      <span>
                        {projectCollections.filter(c => c.progress.validated === 'completed').length}/
                        {projectCollections.length} Completed
                      </span>
                    </div>
                    <ProjectProgressBar collections={projectCollections} category="validated" />
                  </div>
                </div>

                {projectCollections.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">Collections</h4>
                    <div className="space-y-1">
                      {projectCollections.map((collection) => (
                        <div
                          key={collection.id}
                          className="bg-[#1A1A1A] p-2 rounded text-sm text-gray-300"
                          draggable
                          onDragStart={() => handleDragStart(collection.id)}
                        >
                          {collection.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}; 