import { Status } from '../../types'

interface ProgressBarProps {
  status: Status
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ status }) => {
  const colors = {
    'not-started': {
      bg: 'bg-red-500',
      width: '33%',
      text: 'Not Started'
    },
    'in-progress': {
      bg: 'bg-orange-500',
      width: '66%',
      text: 'In Progress'
    },
    'completed': {
      bg: 'bg-green-500',
      width: '100%',
      text: 'Completed'
    }
  }

  return (
    <div className="space-y-1">
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[status].bg} transition-all duration-300`}
          style={{ width: colors[status].width }}
        />
      </div>
      <span className="text-xs text-gray-400">{colors[status].text}</span>
    </div>
  )
} 