import { useState, useCallback } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { UploadState } from '../types'
import { Collection, File, Project } from '@/app/collections/types'

export interface UploadState {
  files: File[]
  collections: Collection[]
  projects: Project[]
  originalCollections: Collection[]
  originalProjects: Project[]
  deleteMode: boolean
  searchTerm: string
  sortFilter: 'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress'
  editingCollection: Collection | null
  isCollectionDialogOpen: boolean
  isAddingProjectOpen: boolean
  newProjectData: {
    title: string
    description: string
    createdDate: Date
  }
}

export const useUpload = () => {
  const [state, setState] = useState<UploadState>(() => ({
    files: [],
    collections: [],
    projects: [],
    originalCollections: [],
    originalProjects: [],
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
  }))

  const { toast } = useToast()

  const handleFileUpload = useCallback((newFiles: File[]) => {
    setState(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }))
    toast({
      title: "Success",
      description: "Files uploaded successfully",
    })
  }, [toast])

  const handleFileDelete = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== id)
    }))
  }, [])

  const handleEditCollection = useCallback((collection: Collection | null) => {
    setState(prev => ({
      ...prev,
      editingCollection: collection,
      isCollectionDialogOpen: true
    }))
  }, [])

  const handleDeleteModeToggle = useCallback(() => {
    setState(prev => ({
      ...prev,
      deleteMode: !prev.deleteMode
    }))
  }, [])

  const handleSearchChange = useCallback((term: string) => {
    setState(prev => {
      // Filter projects based on project title/description
      const filteredProjects = prev.originalProjects.filter(project =>
        project.title.toLowerCase().includes(term.toLowerCase()) ||
        project.description.toLowerCase().includes(term.toLowerCase())
      );

      // Keep unassigned collections as is
      const filteredCollections = prev.originalCollections;

      return {
        ...prev,
        searchTerm: term,
        collections: filteredCollections,
        projects: filteredProjects
      };
    });
  }, []);

  const handleSortFilterChange = useCallback((filter: UploadState['sortFilter']) => {
    setState(prev => {
      const getProjectProgress = (project: Project, status: Status) => {
        const totalStatuses = project.collections.reduce((sum, collection) => {
          return sum + Object.values(collection.progress).filter(s => s === status).length;
        }, 0);
        const totalPossible = project.collections.length * 3; // 3 statuses per collection
        return totalPossible > 0 ? totalStatuses / totalPossible : 0;
      };

      // Always start with original projects
      let filteredProjects = [...prev.originalProjects];

      switch (filter) {
        case 'newest':
          filteredProjects.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
          break;
        case 'oldest':
          filteredProjects.sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime());
          break;
        case 'completed':
          filteredProjects = filteredProjects
            .filter(project => getProjectProgress(project, 'completed') > 0)
            .sort((a, b) => 
              getProjectProgress(b, 'completed') - getProjectProgress(a, 'completed')
            );
          break;
        case 'not-started':
          filteredProjects = filteredProjects
            .filter(project => getProjectProgress(project, 'not-started') > 0)
            .sort((a, b) => 
              getProjectProgress(b, 'not-started') - getProjectProgress(a, 'not-started')
            );
          break;
        case 'in-progress':
          filteredProjects = filteredProjects
            .filter(project => getProjectProgress(project, 'in-progress') > 0)
            .sort((a, b) => 
              getProjectProgress(b, 'in-progress') - getProjectProgress(a, 'in-progress')
            );
          break;
      }

      return {
        ...prev,
        sortFilter: filter,
        collections: prev.originalCollections, // Keep collections unchanged
        projects: filteredProjects
      };
    });
  }, []);

  const handleCollectionDialogClose = useCallback(() => {
    setState(prev => ({
      ...prev,
      isCollectionDialogOpen: false,
      editingCollection: null
    }))
  }, [])

  const handleAddingProjectToggle = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAddingProjectOpen: !prev.isAddingProjectOpen
    }))
  }, [])

  const handleNewProjectDataChange = useCallback((data: Partial<Omit<Project, 'id' | 'collections'>>) => {
    setState(prev => ({
      ...prev,
      newProjectData: { ...prev.newProjectData, ...data }
    }))
  }, [])

  const handleCollectionMove = useCallback((collectionId: string, sourceProjectId: string | null, targetProjectId: string) => {
    setState(prev => {
      let collectionToMove: Collection | undefined;
      let newCollections = [...prev.collections];
      let newProjects = [...prev.projects];

      // If coming from another project
      if (sourceProjectId) {
        newProjects = prev.projects.map(project => {
          if (project.id === sourceProjectId) {
            // Remove from source project
            const projectCollections = project.collections.filter(c => {
              if (c.id === collectionId) {
                collectionToMove = { ...c, currentProjectId: targetProjectId };
                return false;
              }
              return true;
            });
            return { ...project, collections: projectCollections };
          }
          if (project.id === targetProjectId && collectionToMove) {
            // Add to target project
            return {
              ...project,
              collections: [...project.collections, collectionToMove]
            };
          }
          return project;
        });
      } else {
        // If coming from unassigned collections
        newCollections = prev.collections.filter(c => {
          if (c.id === collectionId) {
            collectionToMove = { ...c, currentProjectId: targetProjectId };
            return false;
          }
          return true;
        });

        if (collectionToMove) {
          newProjects = prev.projects.map(project => 
            project.id === targetProjectId
              ? { ...project, collections: [...project.collections, collectionToMove!] }
              : project
          );
        }
      }

      toast({
        title: "Success",
        description: "Collection moved successfully",
      });

      return {
        ...prev,
        collections: newCollections,
        projects: newProjects
      };
    });
  }, [toast]);

  const handleCreateCollection = useCallback((collection: Collection) => {
    setState(prev => ({
      ...prev,
      collections: [collection, ...prev.collections]
    }))
  }, [])

  const handleSaveCollection = useCallback((collection: Collection) => {
    setState(prev => {
      const isEditing = prev.editingCollection !== null;
      let updatedState = { ...prev };

      if (isEditing) {
        // Editing existing collection
        if (!collection.currentProjectId) {
          updatedState.collections = prev.collections.map(c => 
            c.id === collection.id ? collection : c
          );
          updatedState.originalCollections = prev.originalCollections.map(c => 
            c.id === collection.id ? collection : c
          );
        }

        updatedState.projects = prev.projects.map(project => ({
          ...project,
          collections: project.collections.map(c => 
            c.id === collection.id ? collection : c
          )
        }));
        updatedState.originalProjects = prev.originalProjects.map(project => ({
          ...project,
          collections: project.collections.map(c => 
            c.id === collection.id ? collection : c
          )
        }));
      } else {
        // Creating new collection
        const newCollection = { ...collection, id: Date.now().toString() };
        updatedState = {
          ...prev,
          collections: [newCollection, ...prev.collections],
          originalCollections: [newCollection, ...prev.originalCollections],
          projects: [...prev.projects], // Keep projects unchanged
          originalProjects: [...prev.originalProjects], // Keep original projects unchanged
          isCollectionDialogOpen: false,
          editingCollection: null
        };
      }

      toast({
        title: "Success",
        description: isEditing ? "Collection updated successfully" : "Collection created successfully",
      });

      return updatedState;
    });
  }, [toast]);

  const handleDeleteCollection = useCallback((id: string, projectId?: string) => {
    setState(prev => {
      if (projectId) {
        // If collection is in a project
        return {
          ...prev,
          projects: prev.projects.map(project => {
            if (project.id === projectId) {
              return {
                ...project,
                collections: project.collections.filter(c => c.id !== id)
              }
            }
            return project
          })
        }
      } else {
        // If collection is not in a project
        return {
          ...prev,
          collections: prev.collections.filter(c => c.id !== id)
        }
      }
    })

    toast({
      title: "Success",
      description: "Collection deleted successfully",
    })
  }, [toast])

  const handleAddProject = useCallback(() => {
    const newProject: Project = {
      id: Date.now().toString(),
      ...state.newProjectData,
      collections: []
    }
    setState(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects],
      newProjectData: {
        title: '',
        description: '',
        createdDate: new Date()
      },
      isAddingProjectOpen: false
    }))
  }, [state.newProjectData])

  const handleDeleteProject = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }))
  }, [])

  const handleAddNewCollection = useCallback(() => {
    setState(prev => ({
      ...prev,
      editingCollection: null,
      isCollectionDialogOpen: true
    }))
  }, [])

  // Helper function to apply filters
  const applyFilter = (collections: Collection[], projects: Project[], filter: UploadState['sortFilter']) => {
    const getStatusCount = (collection: Collection, status: Status) => {
      return Object.values(collection.progress).filter(s => s === status).length;
    };

    const getProjectStatusCount = (project: Project, status: Status) => {
      return project.collections.reduce((sum, collection) => 
        sum + getStatusCount(collection, status), 0
      );
    };

    let filteredCollections = [...collections];
    let filteredProjects = [...projects];

    switch (filter) {
      case 'newest':
        filteredCollections.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
        filteredProjects.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
        break;
      case 'oldest':
        filteredCollections.sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime());
        filteredProjects.sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime());
        break;
      case 'completed':
      case 'not-started':
      case 'in-progress':
        filteredCollections = collections
          .filter(collection => 
            Object.values(collection.progress).some(status => status === filter)
          )
          .sort((a, b) => 
            getStatusCount(b, filter as Status) - getStatusCount(a, filter as Status)
          );

        filteredProjects = projects
          .map(project => ({
            ...project,
            collections: project.collections.filter(collection =>
              Object.values(collection.progress).some(status => status === filter)
            )
          }))
          .filter(project => project.collections.length > 0)
          .sort((a, b) => 
            getProjectStatusCount(b, filter as Status) - getProjectStatusCount(a, filter as Status)
          );
        break;
    }

    return { collections: filteredCollections, projects: filteredProjects };
  };

  return {
    state,
    handleFileUpload,
    handleFileDelete,
    handleEditCollection,
    handleDeleteModeToggle,
    handleSearchChange,
    handleSortFilterChange,
    handleCollectionDialogClose,
    handleAddingProjectToggle,
    handleNewProjectDataChange,
    handleCollectionMove,
    handleCreateCollection,
    handleSaveCollection,
    handleDeleteCollection,
    handleAddProject,
    handleDeleteProject,
    handleAddNewCollection,
    isCollectionDialogOpen: state.isCollectionDialogOpen,
    setIsCollectionDialogOpen: (value: boolean) => setState(prev => ({
      ...prev,
      isCollectionDialogOpen: value
    }))
  }
} 