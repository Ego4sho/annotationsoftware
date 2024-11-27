import { useState } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { Collection, Project, CollectionsState, SortFilter } from '../types'

export const useCollections = () => {
  const [state, setState] = useState<CollectionsState>({
    collections: [],
    projects: [],
    deleteMode: false,
    searchTerm: '',
    sortFilter: 'newest',
    editingCollection: null,
    isCollectionDialogOpen: false,
    isAddingProjectOpen: false,
    newProjectData: {
      title: '',
      description: '',
      createdDate: new Date()
    }
  })

  const { toast } = useToast()

  const handleCollectionMove = (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => {
    setState(prev => {
      const newState = { ...prev }
      let collectionToMove: Collection | undefined

      if (sourceProjectId) {
        newState.projects = prev.projects.map(project => {
          if (project.id === sourceProjectId) {
            const updatedCollections = project.collections.filter(c => {
              if (c.id === collectionId) {
                collectionToMove = { ...c, currentProjectId: targetProjectId }
                return false
              }
              return true
            })
            return { ...project, collections: updatedCollections }
          }
          if (project.id === targetProjectId && collectionToMove) {
            return { ...project, collections: [...project.collections, collectionToMove] }
          }
          return project
        })
      } else {
        newState.collections = prev.collections.filter(c => {
          if (c.id === collectionId) {
            collectionToMove = { ...c, currentProjectId: targetProjectId }
            return false
          }
          return true
        })
        if (collectionToMove) {
          newState.projects = prev.projects.map(project => 
            project.id === targetProjectId
              ? { ...project, collections: [...project.collections, collectionToMove!] }
              : project
          )
        }
      }

      return newState
    })
  }

  // ... implement other handlers following the same pattern

  return {
    state,
    handleCollectionMove,
    // ... other handlers
  }
} 