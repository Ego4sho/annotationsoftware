import { Collection, Project, ProjectFile, UploadFile } from '@/types/upload'
import { Timestamp } from 'firebase/firestore'

export type { Collection, Project, ProjectFile, UploadFile }

export type ProgressCategory = 'labeling' | 'rating' | 'validated'
export type ProgressStatus = 'incomplete' | 'processing' | 'ready' | 'error'

export interface ProgressCounts {
  total: number
  notStarted: number
  inProgress: number
  completed: number
}

export interface NewProjectData {
  title: string
  description: string
  createdDate: Timestamp
} 