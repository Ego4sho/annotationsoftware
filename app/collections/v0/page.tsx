'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, X, Upload, Search, Plus, ChevronRight } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

type Status = 'not-started' | 'in-progress' | 'completed'

interface Progress {
  labeling: Status
  rating: Status
  validated: Status
}

interface File {
  id: string
  name: string
  type: 'video' | 'audio' | 'sensor'
  size?: string
}

interface Collection {
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

interface Project {
  id: string
  title: string
  description: string
  createdDate: Date
  collections: Collection[]
}

const CollectionDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSave: (collection: Collection) => void
  initialData?: Collection | null
}> = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState<Collection>({
    id: '',
    title: '',
    description: '',
    createdDate: new Date(),
    videoFiles: [],
    audioFiles: [],
    bvhFile: null,
    auxFiles: {},
    progress: {
      labeling: 'not-started',
      rating: 'not-started',
      validated: 'not-started'
    }
  })

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {
        id: Date.now().toString(),
        title: '',
        description: '',
        createdDate: new Date(),
        videoFiles: [],
        audioFiles: [],
        bvhFile: null,
        auxFiles: {},
        progress: {
          labeling: 'not-started',
          rating: 'not-started',
          validated: 'not-started'
        }
      })
    }
  }, [isOpen, initialData])

  const handleDelete = () => {
    // Implement delete functionality here
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-[#1A1A1A] border border-[#604abd] w-[90vw] max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-lg">
        <DialogHeader className="border-b border-[#604abd] px-6 py-4 shrink-0">
          <div className="flex items-center justify-between w-full relative">
            <Button variant="ghost" className="p-1 hover:bg-white/10 rounded-full" onClick={handleDelete}>
              <Trash2 className="h-5 w-5 text-white" />
            </Button>
            <DialogTitle className="absolute left-1/2 transform -translate-x-1/2 text-[#E5E7EB] text-xl">
              {initialData ? 'Edit Collection' : 'New Collection'}
            </DialogTitle>
            <DialogClose className="p-1 hover:bg-white/10 rounded-full">
              <X className="h-5 w-5 text-white" />
            </DialogClose>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            <div>
              <Label className="text-[#E5E7EB]">Collection Title</Label>
              <Input 
                className="bg-gray-700 text-white border-gray-600"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-[#E5E7EB]">Description</Label>
              <Textarea 
                className="bg-gray-700 text-white border-gray-600 min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-[#E5E7EB]">Creation Date</Label>
              <div className="flex items-center mt-2">
                <Input
                  type="date"
                  value={formData.createdDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData(prev => ({ ...prev, createdDate: new Date(e.target.value) }))}
                  className="bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              {(['labeling', 'rating', 'validated'] as const).map(category => (
                <div key={category} className="space-y-2">
                  <Label className="text-[#E5E7EB] capitalize">{category} Status</Label>
                  <Select
                    value={formData.progress[category]}
                    onValueChange={(value: Status) => setFormData(prev => ({
                      ...prev,
                      progress: {
                        ...prev.progress,
                        [category]: value
                      }
                    }))}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <ProgressBar status={formData.progress[category]} />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-[#E5E7EB]">Video Files (Max 5)</Label>
                <FileUploadArea
                  files={formData.videoFiles}
                  onFilesChange={(files) => setFormData(prev => ({
                    ...prev,
                    videoFiles: files
                  }))}
                  maxFiles={5}
                  accept="video/*"
                />
              </div>

              <div>
                <Label className="text-[#E5E7EB]">Audio Files (Max 5)</Label>
                <FileUploadArea
                  files={formData.audioFiles}
                  onFilesChange={(files) => setFormData(prev => ({
                    ...prev,
                    audioFiles: files
                  }))}
                  maxFiles={5}
                  accept="audio/*"
                />
              </div>

              <div>
                <Label className="text-[#E5E7EB]">BVH Sensor File</Label>
                <FileUploadArea
                  files={formData.bvhFile ? [formData.bvhFile] : []}
                  onFilesChange={(files) => setFormData(prev => ({
                    ...prev,
                    bvhFile: files[0] || null
                  }))}
                  maxFiles={1}
                  accept=".bvh"
                />
              </div>

              {[1, 2, 3, 4, 5].map(num => (
                <div key={num}>
                  <Label className="text-[#E5E7EB]">AUX Sensor {num}</Label>
                  <FileUploadArea
                    files={formData.auxFiles[num] ? [formData.auxFiles[num]!] : []}
                    onFilesChange={(files) => setFormData(prev => ({
                      ...prev,
                      auxFiles: {
                        ...prev.auxFiles,
                        [num]: files[0] || null
                      }
                    }))}
                    maxFiles={1}
                    accept=".aux,.csv,.txt"
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="border-t border-[#604abd] px-6 py-4 mt-auto shrink-0">
          <Button 
            className="w-full bg-gradient-to-r from-[#604abd] to-[#d84bf7] hover:from-[#7059c4] hover:to-[#de65f7]"
            onClick={() => {
              onSave(formData)
              onClose()
            }}
          >
            {initialData ? 'Save Changes' : 'Create Collection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ProgressBar: React.FC<{ status: Status }> = ({ status }) => {
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

const ProjectProgressBar: React.FC<{ collections: Collection[], category: keyof Progress }> = ({ collections, category }) => {
  const totalCards = collections.length;
  const statusCounts = {
    'not-started': collections.filter(c => c.progress[category] === 'not-started').length,
    'in-progress': collections.filter(c => c.progress[category] === 'in-progress').length,
    'completed': collections.filter(c => c.progress[category] === 'completed').length
  };

  return (
    <div className="space-y-1">
      <div className="flex h-2 bg-gray-700 rounded-full overflow-hidden">
        {statusCounts['not-started'] > 0 && (
          <div 
            className="bg-red-500 h-full"
            style={{ width: `${(statusCounts['not-started'] / totalCards) * 100}%` }}
          />
        )}
        {statusCounts['in-progress'] > 0 && (
          <div 
            className="bg-orange-500 h-full"
            style={{ width: `${(statusCounts['in-progress'] / totalCards) * 100}%` }}
          />
        )}
        {statusCounts['completed'] > 0 && (
          <div 
            className="bg-green-500 h-full"
            style={{ width: `${(statusCounts['completed'] / totalCards) * 100}%` }}
          />
        )}
      </div>
    </div>
  );
};

const FileUploadArea: React.FC<{
  files: File[]
  onFilesChange: (files: File[]) => void
  maxFiles: number
  accept: string
}> = ({ files, onFilesChange, maxFiles, accept }) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = (newFiles: FileList | File[]) => {
    const validFiles = Array.from(newFiles)
      .slice(0, maxFiles - files.length)
      .filter(file => accept.includes(file.type) || accept.includes(`.${file.name.split('.').pop()}`))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.split('/')[0] as 'video' | 'audio' | 'sensor',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }))

    onFilesChange([...files, ...validFiles])
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-[#604abd] transition-colors"
      >
        <div className="flex flex-col items-center">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-gray-400 mt-2">Drop files here or click to upload</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={(e) => handleFiles(e.target.files!)}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-2 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
              <span className="text-white">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFilesChange(files.filter((_, i) => i !== index))}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const CollectionCard: React.FC<{ 
  collection: Collection
  deleteMode: boolean
  onDelete: (id: string, projectId?: string) => void
  onEdit: (collection: Collection) => void
  inProject?: boolean
}> = ({ 
  collection, 
  deleteMode, onDelete,
  onEdit,
  inProject = false
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      ...collection,
      sourceProjectId: inProject ? collection.currentProjectId : null
    }))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Card
      draggable={true}
      onDragStart={handleDragStart}
      onClick={() => onEdit(collection)}
      className="bg-[#262626] border-[#604abd] p-4 cursor-pointer hover:bg-[#303030] relative"
    >
      {deleteMode && (
        <Button
          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(collection.id, collection.currentProjectId);
          }}
        >
          <X className="h-4 w-4 text-white" />
        </Button>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-[#E5E7EB] font-medium text-lg">{collection.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 mt-1">{collection.description}</p>
          <p className="text-gray-400 text-xs mt-1">
            Created: {format(collection.createdDate, 'MMM d, yyyy')}
          </p>
        </div>

        <div className="space-y-1 text-sm text-gray-400">
          <p>Videos: {collection.videoFiles.length}</p>
          <p>Audio: {collection.audioFiles.length}</p>
          <p>Sensors: {Object.values(collection.auxFiles).filter(Boolean).length + (collection.bvhFile ? 1 : 0)}</p>
        </div>

        <div className="space-y-2">
          {(['labeling', 'rating', 'validated'] as const).map(category => (
            <div key={category} className="space-y-1">
              <span className="text-xs text-gray-400 capitalize">{category}</span>
              <ProgressBar status={collection.progress[category]} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

const getProgressCounts = (collections: Collection[], category: string) => {
  const total = collections.length;
  const notStarted = collections.filter(c => c.progress[category as keyof Progress] === 'not-started').length;
  const inProgress = collections.filter(c => c.progress[category as keyof Progress] === 'in-progress').length;
  const completed = collections.filter(c => c.progress[category as keyof Progress] === 'completed').length;

  const parts = [];
  if (notStarted > 0) parts.push(`${notStarted}/${total} Not Started`);
  if (inProgress > 0) parts.push(`${inProgress}/${total} In Progress`);
  if (completed > 0) parts.push(`${completed}/${total} Completed`);

  return parts.join(' • ');
};

const ProjectContainer: React.FC<{ 
  project: Project
  deleteMode: boolean
  onDelete: (id: string) => void
  onEditCollection: (collection: Collection) => void
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void
  onDeleteCollection: (id: string, projectId: string) => void
}> = ({ 
  project, 
  deleteMode, 
  onDelete, 
  onEditCollection,
  onCollectionMove,
  onDeleteCollection
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCollections = project.collections?.filter(collection =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    try {
      const { id: collectionId, sourceProjectId } = JSON.parse(
        e.dataTransfer.getData('application/json')
      )

      if (sourceProjectId !== project.id) {
        onCollectionMove(collectionId, sourceProjectId, project.id)
      }
    } catch (error) {
      console.error('Drop handling error:', error)
    }
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-col w-full p-4 bg-[#262626] rounded-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center flex-1"
          >
            <ChevronRight 
              className={`h-5 w-5 transform transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
            <div className="ml-2">
              <h3 className="text-lg font-medium text-[#E5E7EB]">{project.title}</h3>
              <p className="text-sm text-gray-400">{project.description}</p>
            </div>
          </button>

          {deleteMode && (
            <Button
              className="p-1 rounded-full bg-red-500 hover:bg-red-600"
              onClick={() => onDelete(project.id)}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {(['labeling', 'rating', 'validated'] as const).map(category => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span className="capitalize">{category}</span>
                <span>{getProgressCounts(project.collections, category)}</span>
              </div>
              <ProjectProgressBar 
                collections={project.collections} 
                category={category} 
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div
              className={`
                space-y-4
                p-4 
                rounded-lg 
                transition-colors
                ${dragOver 
                  ? 'bg-white/20 border-2 border-dashed border-[#604abd]' 
                  : 'bg-white/10 border-2 border-dashed border-transparent'
                }
              `}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search collections in this project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 pl-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {filteredCollections?.map(collection => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    deleteMode={deleteMode}
                    onDelete={(id) => onDeleteCollection(id, project.id)}
                    onEdit={() => onEditCollection(collection)}
                    inProject={true}
                  />
                ))}
              </div>

              {(!filteredCollections || filteredCollections.length === 0) && (
                <div className="text-center py-8 text-gray-400">
                  {searchTerm 
                    ? 'No collections found matching your search'
                    : 'Drag and drop collection cards here'}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MainContainer: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [deleteMode, setDeleteMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFilter, setSortFilter] = useState<'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress'>('newest')
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false)
  const [isAddingProjectOpen, setIsAddingProjectOpen] = useState(false)
  const [newProjectData, setNewProjectData] = useState<Omit<Project, 'id' | 'collections'>>({
    title: '',
    description: '',
    createdDate: new Date()
  })
  const { toast } = useToast()

  const filteredAndSortedCollections = collections
    .filter(collection => 
      collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortFilter) {
        case 'newest':
          return b.createdDate.getTime() - a.createdDate.getTime()
        case 'oldest':
          return a.createdDate.getTime() - b.createdDate.getTime()
        case 'completed':
          return (Object.values(b.progress).filter(status => status === 'completed').length) -
                 (Object.values(a.progress).filter(status => status === 'completed').length)
        case 'not-started':
          return (Object.values(b.progress).filter(status => status === 'not-started').length) -
                 (Object.values(a.progress).filter(status => status === 'not-started').length)
        case 'in-progress':
          return (Object.values(b.progress).filter(status => status === 'in-progress').length) -
                 (Object.values(a.progress).filter(status => status === 'in-progress').length)
      }
    })

  const handleCollectionMove = (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => {
    let collectionToMove: Collection | undefined

    if (sourceProjectId) {
      setProjects(prev => prev.map(project => {
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
      }))
    } else {
      setCollections(prev => {
        const updatedCollections = prev.filter(c => {
          if (c.id === collectionId) {
            collectionToMove = { ...c, currentProjectId: targetProjectId }
            return false
          }
          return true
        })
        if (collectionToMove) {
          setProjects(prevProjects => prevProjects.map(project => 
            project.id === targetProjectId
              ? { ...project, collections: [...project.collections, collectionToMove!] }
              : project
          ))
        }
        return updatedCollections
      })
    }
  }

  const handleCreateCollection = (newCollection: Collection) => {
    setCollections(prev => [newCollection, ...prev])
    toast({
      title: "Success",
      description: "Collection created successfully",
    })
  }

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection)
    setIsCollectionDialogOpen(true)
  }

  const handleSaveCollection = (updatedCollection: Collection) => {
    if (editingCollection) {
      setCollections(prev => prev.map(c => 
        c.id === updatedCollection.id ? updatedCollection : c
      ))
      setProjects(prev => prev.map(project => ({
        ...project,
        collections: project.collections.map(c => 
          c.id === updatedCollection.id ? updatedCollection : c
        )
      })))
    } else {
      handleCreateCollection(updatedCollection)
    }
    setEditingCollection(null)
    setIsCollectionDialogOpen(false)
  }

  const handleDeleteCollection = (id: string, projectId?: string) => {
    if (projectId) {
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            collections: project.collections.filter(collection => collection.id !== id)
          }
        }
        return project
      }))
    } else {
      setCollections(prev => prev.filter(collection => collection.id !== id))
    }
    toast({
      title: "Success",
      description: "Collection deleted successfully",
    })
  }

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      ...newProjectData,
      collections: []
    }
    setProjects(prev => [newProject, ...prev])
    setNewProjectData({
      title: '',
      description: '',
      createdDate: new Date()
    })
    setIsAddingProjectOpen(false)
    toast({
      title: "Success",
      description: "Project created successfully",
    })
  }

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id))
    toast({
      title: "Success",
      description: "Project deleted successfully",
    })
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#E5E7EB] p-6">
      <div className="flex justify-end mb-6">
        <Button 
          className={`bg-red-600 hover:bg-red-700 text-white`}
          onClick={() => setDeleteMode(!deleteMode)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {deleteMode ? 'Exit Delete Mode' : 'Enter Delete Mode'}
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700 text-white border-gray-600"
          />
        </div>

        <Select value={sortFilter} onValueChange={(value: typeof sortFilter) => setSortFilter(value)}>
          <SelectTrigger className="w-[200px] bg-gray-700 text-white border-gray-600">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] overscroll-contain">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Card
              className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] hover:from-[#7059c4] hover:to-[#de65f7] cursor-pointer p-8 flex items-center justify-center"
              onClick={() => {
                setEditingCollection(null)
                setIsCollectionDialogOpen(true)
              }}
            >
              <Plus className="w-12 h-12 text-white" />
            </Card>
            {filteredAndSortedCollections.map(collection => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                deleteMode={deleteMode}
                onDelete={handleDeleteCollection}
                onEdit={handleEditCollection}
              />
            ))}
          </div>

          <div className="w-full h-px bg-white/20" />

          <div className="space-y-4">
            <Button
              onClick={() => setIsAddingProjectOpen(!isAddingProjectOpen)}
              className="bg-[#262626] hover:bg-[#303030] text-white w-auto flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Project</span>
            </Button>

            <AnimatePresence>
              {isAddingProjectOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 p-4 bg-[#262626] rounded-lg">
                    <Input 
                      placeholder="Enter project title..."
                      className="bg-gray-700 text-white border-gray-600"
                      value={newProjectData.title}
                      onChange={(e) => setNewProjectData(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea 
                      placeholder="Enter project description..."
                      className="bg-gray-700 text-white border-gray-600"
                      value={newProjectData.description}
                      onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="flex items-center space-x-2">
                      <Label className="text-[#E5E7EB]">Creation Date:</Label>
                      <Input
                        type="date"
                        value={newProjectData.createdDate.toISOString().split('T')[0]}
                        onChange={(e) => setNewProjectData(prev => ({ ...prev, createdDate: new Date(e.target.value) }))}
                        className="bg-gray-700 text-white border-gray-600 rounded-md p-2"
                      />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white hover:from-[#7059c4] hover:to-[#de65f7]"
                      onClick={handleAddProject}
                    >
                      Save Project
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectContainer
                key={project.id}
                project={project}
                deleteMode={deleteMode}
                onDelete={handleDeleteProject}
                onEditCollection={handleEditCollection}
                onCollectionMove={handleCollectionMove}
                onDeleteCollection={handleDeleteCollection}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <CollectionDialog
        isOpen={isCollectionDialogOpen}
        onClose={() => {
          setIsCollectionDialogOpen(false)
          setEditingCollection(null)
        }}
        onSave={handleSaveCollection}
        initialData={editingCollection}
      />
    </div>
  )
}

export default function Component() {
  return <MainContainer />
}