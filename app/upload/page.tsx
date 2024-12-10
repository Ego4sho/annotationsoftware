'use client'

import { useState, useEffect } from 'react'
import { UploadUI } from './components/ui/UploadUI'
import { useAuth } from '@/lib/context/AuthContext'
import { db } from '@/lib/firebase'
import { 
  collection as firestoreCollection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  doc, 
  updateDoc, 
  addDoc 
} from 'firebase/firestore'
import { Collection, Project } from '@/types/upload'
import { projectService } from '@/lib/services/projectService'
import { collectionService } from '@/lib/services/collectionService'
import { useToast } from '@/components/ui/use-toast'
import { SortFilter } from './components/ui/UploadUI'

export default function UploadPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [collections, setCollections] = useState<Collection[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFilter, setSortFilter] = useState<'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress'>('newest')
  const [deleteMode, setDeleteMode] = useState(false)
  const [isAddingProjectOpen, setIsAddingProjectOpen] = useState(false)
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    description: ''
  })

  // Set up Firebase listeners
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    console.log('Setting up Firebase listeners for user:', user.uid)

    // Collections listener
    const collectionsQuery = query(
      firestoreCollection(db, 'collections'),
      where('userId', '==', user.uid),
      where('deleted', '==', false),
      orderBy('createdAt', 'desc')
    )

    const unsubscribeCollections = onSnapshot(collectionsQuery, (snapshot) => {
      console.log('Collections snapshot received:', snapshot.docs.length, 'documents')
      const collectionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Collection[]
      console.log('Processed collections:', collectionsData)
      setCollections(collectionsData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching collections:', error)
      setLoading(false)
    })

    // Projects listener
    const projectsQuery = query(
      firestoreCollection(db, 'projects'),
      where('userId', '==', user.uid),
      where('deleted', '==', false),
      orderBy('createdAt', 'desc')
    )

    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      console.log('Projects snapshot received:', snapshot.docs.length, 'documents')
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[]
      console.log('Processed projects:', projectsData)
      setProjects(projectsData)
    }, (error) => {
      console.error('Error fetching projects:', error)
    })

    return () => {
      unsubscribeCollections()
      unsubscribeProjects()
    }
  }, [user])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleSortFilterChange = (value: 'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress') => {
    setSortFilter(value)
  }

  const handleAddingProjectToggle = () => {
    setIsAddingProjectOpen(!isAddingProjectOpen)
  }

  const handleNewProjectDataChange = (data: {
    title: string
    description: string
  }) => {
    setNewProjectData(data)
  }

  const handleProjectSubmit = async () => {
    if (!user) return;
    
    try {
      await projectService.createProject({
        name: newProjectData.title.trim(),
        description: newProjectData.description.trim(),
        userId: user.uid
      });
      
      setIsAddingProjectOpen(false);
      setNewProjectData({ title: '', description: '' }); // Reset form
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCollection = async (collectionId: string, projectId?: string) => {
    if (!user) return;

    try {
      console.log('Deleting collection:', { collectionId, projectId });

      // If the collection is in a project, remove it from the project first
      if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
          console.log('Removing collection from project:', projectId);
          const updatedProject = {
            ...project,
            collections: project.collections.filter(id => id !== collectionId)
          };
          await projectService.updateProject(updatedProject);
          
          // Update projects state immediately
          setProjects(prev => prev.map(p => 
            p.id === projectId ? updatedProject : p
          ));
        }
      }

      // Delete the collection
      console.log('Marking collection as deleted');
      const deleted = await collectionService.deleteCollection(collectionId);
      
      if (deleted) {
        // Update collections state immediately
        setCollections(prev => prev.filter(c => c.id !== collectionId));
        
        toast({
          title: 'Success',
          description: 'Collection deleted successfully',
        });
      } else {
        throw new Error('Failed to delete collection');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete collection. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveCollection = async (collection: Collection) => {
    if (!user) return;

    try {
      console.log('Saving collection with files:', collection);
      const now = Timestamp.now();
      const collectionData = {
        ...collection,
        userId: user.uid,
        updatedAt: now,
        createdAt: collection.id ? collection.createdAt : now,
        files: {
          video: collection.files?.video || [],
          audio: collection.files?.audio || [],
          motion: collection.files?.motion || [],
          aux1: collection.files?.aux1 || [],
          aux2: collection.files?.aux2 || [],
          aux3: collection.files?.aux3 || [],
          aux4: collection.files?.aux4 || [],
          aux5: collection.files?.aux5 || []
        },
        progress: collection.progress || {
          labeling: 'not-started',
          rating: 'not-started',
          validated: 'not-started'
        },
        deleted: false,
        status: collection.status || 'incomplete'
      } as Collection;

      console.log('Saving collection:', collectionData);
      if (collection.id) {
        await collectionService.updateCollection(collectionData);
      } else {
        // For new collections, just create it and let the Firebase listener handle the state update
        await collectionService.createCollection(collectionData);
      }

      toast({
        title: 'Success',
        description: collection.id ? 'Collection updated successfully' : 'Collection created successfully',
      });
    } catch (error) {
      console.error('Error saving collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to save collection. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleAddNewCollection = () => {
    // Reset collection data when opening dialog
    setEditingCollection({
      id: '',
      name: '',
      description: '',
      userId: user?.uid || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'incomplete',
      files: {
        video: [],
        audio: [],
        motion: [],
        aux1: [],
        aux2: [],
        aux3: [],
        aux4: [],
        aux5: []
      },
      progress: {
        labeling: 'not-started',
        rating: 'not-started',
        validated: 'not-started'
      }
    });
    setIsCollectionDialogOpen(true);
  };

  const handleCollectionMove = async (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => {
    if (!user) return;

    try {
      // Find the collection
      const collection = collections.find(c => c.id === collectionId);
      if (!collection) return;

      // If moving from one project to another
      if (sourceProjectId) {
        const sourceProject = projects.find(p => p.id === sourceProjectId);
        if (sourceProject) {
          const updatedSourceProject = {
            ...sourceProject,
            collections: sourceProject.collections.filter(id => id !== collectionId)
          };
          await projectService.updateProject(updatedSourceProject);
        }
      }

      // If moving to "no project" (outside any project)
      if (targetProjectId === 'none') {
        // Update the collection to remove project reference
        const updatedCollection = {
          ...collection,
          projectId: null
        };
        await collectionService.updateCollection(updatedCollection);
      } else {
        // Add to target project
        const targetProject = projects.find(p => p.id === targetProjectId);
        if (targetProject) {
          const updatedTargetProject = {
            ...targetProject,
            collections: [...(targetProject.collections || []), collectionId]
          };
          await projectService.updateProject(updatedTargetProject);

          // Update the collection with the new project reference
          const updatedCollection = {
            ...collection,
            projectId: targetProjectId
          };
          await collectionService.updateCollection(updatedCollection);
        }
      }

      toast({
        title: 'Success',
        description: 'Collection moved successfully',
      });
    } catch (error) {
      console.error('Error moving collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to move collection. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEditProject = async (projectId: string, updatedData: { title: string; name: string; description: string; createdAt: Timestamp }) => {
    if (!user) return;

    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        console.error('Project not found:', projectId);
        return;
      }

      const updatedProject = {
        ...project,
        name: updatedData.name,
        description: updatedData.description,
        updatedAt: Timestamp.now()
      };

      await projectService.updateProject(updatedProject);

      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (!user) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <UploadUI
      projects={projects}
      collections={collections}
      loading={loading}
      searchTerm={searchTerm}
      sortFilter={sortFilter}
      deleteMode={deleteMode}
      isAddingProjectOpen={isAddingProjectOpen}
      newProjectData={newProjectData}
      onSearchChange={handleSearchChange}
      onSortFilterChange={handleSortFilterChange}
      onDeleteCollection={handleDeleteCollection}
      onSaveCollection={handleSaveCollection}
      onDeleteModeToggle={() => setDeleteMode(!deleteMode)}
      onDeleteProject={handleDeleteProject}
      onCreateProject={handleProjectSubmit}
      onAddingProjectToggle={handleAddingProjectToggle}
      onNewProjectDataChange={handleNewProjectDataChange}
      onCollectionMove={handleCollectionMove}
      onEditProject={handleEditProject}
    />
  )
} 