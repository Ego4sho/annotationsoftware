import { Collection, ProgressCategory, ProgressCounts } from '../types'

export const getProgressCounts = (collections: Collection[], category: ProgressCategory): ProgressCounts => {
  const total = collections?.length || 0
  const completed = collections?.filter(c => c.progress[category] === 'completed').length || 0
  const inProgress = collections?.filter(c => c.progress[category] === 'in-progress').length || 0
  const notStarted = total - completed - inProgress

  return {
    total,
    completed,
    inProgress,
    notStarted
  }
} 