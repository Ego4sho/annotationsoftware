import { Card } from "@/components/ui/card"
import { Collection, Project } from "@/types/upload"
import { SelectableCollectionCard } from "./SelectableCollectionCard"
import { format } from 'date-fns'
import { ProjectProgressBar } from "@/app/upload/components/ui/ProjectProgressBar"
import { ChevronRight, Pencil } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProgressCategory } from "@/app/upload/types"

interface SelectableProjectContainerProps {
  project: Project
  collections: Collection[]
  onFileSelect: (fileType: string, fileId: string) => void
}

export function SelectableProjectContainer({
  project,
  collections,
  onFileSelect
}: SelectableProjectContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const projectCollections = collections.filter(c => c.projectId === project.id && !c.deleted)

  const getProgressCounts = (category: ProgressCategory) => {
    const total = projectCollections.length;
    if (total === 0) return { notStarted: 0, inProgress: 0, completed: 0 };

    return {
      notStarted: projectCollections.filter(c => c.progress?.[category] === 'not-started').length,
      inProgress: projectCollections.filter(c => c.progress?.[category] === 'in-progress').length,
      completed: projectCollections.filter(c => c.progress?.[category] === 'completed').length
    };
  };

  const getProgressText = (category: ProgressCategory) => {
    const counts = getProgressCounts(category);
    const parts = [];
    
    if (counts.notStarted > 0) parts.push(`${counts.notStarted} Not Started`);
    if (counts.inProgress > 0) parts.push(`${counts.inProgress} In Progress`);
    if (counts.completed > 0) parts.push(`${counts.completed} Completed`);
    
    return parts.join(' • ');
  };

  return (
    <Card 
      className={cn(
        "bg-[#262626] border-[#604abd] p-4 relative",
        isExpanded ? "col-span-3" : "hover:bg-[#303030]"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[#E5E7EB] font-medium text-lg">{project.name}</h3>
          <p className="text-gray-400 text-sm mt-1">
            Created: {format(project.createdAt.toDate(), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 hover:bg-[#404040] rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              // Handle edit
            }}
          >
            <Pencil className="h-4 w-4 text-gray-400" />
          </button>
          <button
            className="p-2 hover:bg-[#404040] rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            <ChevronRight 
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-200",
                isExpanded && "rotate-90"
              )} 
            />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* Progress Bars */}
        <div className="space-y-4">
          {(['labeling', 'rating', 'validated'] as const).map(category => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span className="capitalize">{category}</span>
                <span>{getProgressText(category)}</span>
              </div>
              <ProjectProgressBar
                collections={projectCollections}
                category={category}
              />
            </div>
          ))}
        </div>

        {/* Expanded Collections */}
        {isExpanded && (
          <div className="border-t border-[#404040] pt-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectCollections.map((collection) => (
                <SelectableCollectionCard
                  key={collection.id}
                  collection={collection}
                  onFileSelect={onFileSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
} 