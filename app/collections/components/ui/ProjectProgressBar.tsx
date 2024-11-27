import { Collection, Progress } from '../../types'

interface ProjectProgressBarProps {
  collections: Collection[]
  category: keyof Progress
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({ collections, category }) => {
  const totalCards = collections.length
  const statusCounts = {
    'not-started': collections.filter(c => c.progress[category] === 'not-started').length,
    'in-progress': collections.filter(c => c.progress[category] === 'in-progress').length,
    'completed': collections.filter(c => c.progress[category] === 'completed').length
  }

  return (
    <div className="space-y-1">
      <div className="flex h-2 bg-gray-700 rounded-full overflow-hidden">
        {statusCounts['not-started'] > 0 && (
          <div 
            className="bg-red-500 h-full"
            style={{ width: `${(statusCounts['not-started'] / totalCards) * 100}%` }}
          />
        )}
        {statusCounts['in-progress'] > 0 && (
          <div 
            className="bg-orange-500 h-full"
            style={{ width: `${(statusCounts['in-progress'] / totalCards) * 100}%` }}
          />
        )}
        {statusCounts['completed'] > 0 && (
          <div 
            className="bg-green-500 h-full"
            style={{ width: `${(statusCounts['completed'] / totalCards) * 100}%` }}
          />
        )}
      </div>
    </div>
  )
} 