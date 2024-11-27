export type Status = 'not-started' | 'in-progress' | 'completed'
export type SortFilter = 'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress'

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

export interface CollectionsState {
  collections: Collection[]
  projects: Project[]
  deleteMode: boolean
  searchTerm: string
  sortFilter: SortFilter
  editingCollection: Collection | null
  isCollectionDialogOpen: boolean
  isAddingProjectOpen: boolean
  newProjectData: Omit<Project, 'id' | 'collections'>
}

export interface CollectionsUIProps extends CollectionsState {
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void
  onCreateCollection: (collection: Collection) => void
  onEditCollection: (collection: Collection) => void
  onSaveCollection: (collection: Collection) => void
  onDeleteCollection: (id: string, projectId?: string) => void
  onAddProject: () => void
  onDeleteProject: (id: string) => void
  onDeleteModeToggle: () => void
  onSearchChange: (term: string) => void
  onSortFilterChange: (filter: SortFilter) => void
  onCollectionDialogClose: () => void
  onAddingProjectToggle: () => void
  onNewProjectDataChange: (data: Partial<Omit<Project, 'id' | 'collections'>>) => void
} 