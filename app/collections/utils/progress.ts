import { Collection, Progress } from '../types'

export const getProgressCounts = (collections: Collection[], category: keyof Progress): string => {
  const total = collections.length
  const notStarted = collections.filter(c => c.progress[category] === 'not-started').length
  const inProgress = collections.filter(c => c.progress[category] === 'in-progress').length
  const completed = collections.filter(c => c.progress[category] === 'completed').length

  const parts = []
  if (notStarted > 0) parts.push(`${notStarted}/${total} Not Started`)
  if (inProgress > 0) parts.push(`${inProgress}/${total} In Progress`)
  if (completed > 0) parts.push(`${completed}/${total} Completed`)

  return parts.join(' • ')
} 