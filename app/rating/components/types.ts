export type Status = 'not-started' | 'in-progress' | 'completed'

export interface Progress {
  labeling: Status
  rating: Status
  validated: Status
}

export interface File {
  id: string
  name: string
  type: 'video' | 'audio' | 'sensor'
  size?: string
}

export interface Collection {
  id: string
  title: string
  description: string
  createdDate: Date
  videoFiles: File[]
  audioFiles: File[]
  bvhFile: File | null
  auxFiles: {
    [key: number]: File | null
  }
  progress: Progress
  currentProjectId?: string
}

export interface Project {
  id: string
  title: string
  description: string
  createdDate: Date
  collections: Collection[]
} 