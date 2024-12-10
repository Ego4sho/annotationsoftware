import { Collection } from '../../types'

interface ProjectProgressBarProps {
  collections: Collection[]
  category: 'labeling' | 'rating' | 'validated'
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  collections,
  category
}) => {
  const total = collections.length
  const completed = collections.filter(c => c.progress[category] === 'completed').length
  const inProgress = collections.filter(c => c.progress[category] === 'in-progress').length
  const notStarted = total - completed - inProgress

  return (
    <div className="flex h-1 bg-gray-700 rounded-full overflow-hidden">
      <div 
        className="bg-green-500" 
        style={{ width: `${(completed / total) * 100}%` }}
      />
      <div 
        className="bg-yellow-500" 
        style={{ width: `${(inProgress / total) * 100}%` }}
      />
      <div 
        className="bg-gray-500" 
        style={{ width: `${(notStarted / total) * 100}%` }}
      />
    </div>
  )
} 