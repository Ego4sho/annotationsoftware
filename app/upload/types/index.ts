import { Collection, Project, File } from '@/app/collections/types'

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

export interface UploadState {
  files: File[]
  collections: Collection[]
  projects: Project[]
  deleteMode: boolean
  searchTerm: string
  sortFilter: 'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress'
  editingCollection: Collection | null
  isCollectionDialogOpen: boolean
  isAddingProjectOpen: boolean
  newProjectData: Omit<Project, 'id' | 'collections'>
}

export interface UploadUIProps extends UploadState {
  onFileUpload: (files: File[]) => void
  onFileDelete: (id: string) => void
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void
  onCreateCollection: (collection: Collection) => void
  onEditCollection: (collection: Collection | null) => void
  onSaveCollection: (collection: Collection) => void
  onDeleteCollection: (id: string, projectId?: string) => void
  onAddProject: () => void
  onDeleteProject: (id: string) => void
  onDeleteModeToggle: () => void
  onSearchChange: (term: string) => void
  onSortFilterChange: (filter: UploadState['sortFilter']) => void
  onCollectionDialogClose: () => void
  onAddingProjectToggle: () => void
  onNewProjectDataChange: (data: Partial<Omit<Project, 'id' | 'collections'>>) => void
  onAddNewCollection: () => void
} 