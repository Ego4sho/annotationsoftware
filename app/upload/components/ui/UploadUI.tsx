'use client'

import { Navigation } from '@/components/shared/Navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, X, Upload, Search, Plus, ChevronRight } from 'lucide-react'
import { Collection, File, Project } from '../../types'
import { CollectionCard } from './CollectionCard'
import { ProjectContainer } from './ProjectContainer'
import { CollectionDialog } from './CollectionDialog'
import { motion, AnimatePresence } from 'framer-motion'

interface UploadUIProps {
  collections: Collection[]
  projects: Project[]
  deleteMode: boolean
  searchTerm: string
  sortFilter: 'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress'
  editingCollection: Collection | null
  isCollectionDialogOpen: boolean
  isAddingProjectOpen: boolean
  newProjectData: Omit<Project, 'id' | 'collections'>
  onCollectionMove: (collectionId: string, sourceProjectId: string | null, targetProjectId: string) => void
  onCreateCollection: (collection: Collection) => void
  onEditCollection: (collection: Collection | null) => void
  onSaveCollection: (collection: Collection) => void
  onDeleteCollection: (id: string, projectId?: string) => void
  onAddProject: () => void
  onDeleteProject: (id: string) => void
  onDeleteModeToggle: () => void
  onSearchChange: (value: string) => void
  onSortFilterChange: (value: typeof sortFilter) => void
  onCollectionDialogClose: () => void
  onAddingProjectToggle: () => void
  onNewProjectDataChange: (data: Partial<typeof newProjectData>) => void
  onAddNewCollection: () => void
}

export const UploadUI: React.FC<UploadUIProps> = ({
  collections,
  projects,
  deleteMode,
  searchTerm,
  sortFilter,
  editingCollection,
  isCollectionDialogOpen,
  isAddingProjectOpen,
  newProjectData,
  onCollectionMove,
  onCreateCollection,
  onEditCollection,
  onSaveCollection,
  onDeleteCollection,
  onAddProject,
  onDeleteProject,
  onDeleteModeToggle,
  onSearchChange,
  onSortFilterChange,
  onCollectionDialogClose,
  onAddingProjectToggle,
  onNewProjectDataChange,
  onAddNewCollection
}) => {
  return (
    <div className="flex h-screen bg-[#1A1A1A] text-white overflow-hidden">
      <Navigation />
      <div className="flex-1 p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header with Title and Delete Mode Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#604abd] via-[#d84bf7] to-[#604abd] text-transparent bg-clip-text animate-gradient">
                Upload
              </h1>
              <div className="h-8 w-px bg-white/20" /> {/* Vertical divider */}
              <p className="text-gray-400 text-lg">
                Manage your collections and projects
              </p>
            </div>
            <Button 
              className={`bg-red-600 hover:bg-red-700 text-white transition-colors`}
              onClick={onDeleteModeToggle}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteMode ? 'Exit Delete Mode' : 'Enter Delete Mode'}
            </Button>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            <Card
              className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] hover:from-[#7059c4] hover:to-[#de65f7] cursor-pointer p-3 flex items-center justify-center h-[160px]"
              onClick={() => onAddNewCollection()}
            >
              <Plus className="w-6 h-6 text-white" />
            </Card>
            {collections.map(collection => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                deleteMode={deleteMode}
                onDelete={onDeleteCollection}
                onEdit={onEditCollection}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/20 mb-6" />

          {/* Search and Sort - Moved below divider */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-gray-700 text-white border-gray-600"
              />
            </div>

            <Select value={sortFilter} onValueChange={onSortFilterChange}>
              <SelectTrigger className="w-[200px] bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                <SelectItem value="newest" className="text-gray-900 hover:bg-gray-100">Newest First</SelectItem>
                <SelectItem value="oldest" className="text-gray-900 hover:bg-gray-100">Oldest First</SelectItem>
                <SelectItem value="completed" className="text-gray-900 hover:bg-gray-100">Completed</SelectItem>
                <SelectItem value="not-started" className="text-gray-900 hover:bg-gray-100">Not Started</SelectItem>
                <SelectItem value="in-progress" className="text-gray-900 hover:bg-gray-100">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            <Button
              onClick={onAddingProjectToggle}
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
                      onChange={(e) => onNewProjectDataChange({ title: e.target.value })}
                    />
                    <Textarea 
                      placeholder="Enter project description..."
                      className="bg-gray-700 text-white border-gray-600"
                      value={newProjectData.description}
                      onChange={(e) => onNewProjectDataChange({ description: e.target.value })}
                    />
                    <div className="flex items-center space-x-2">
                      <Label className="text-[#E5E7EB]">Creation Date:</Label>
                      <Input
                        type="date"
                        value={newProjectData.createdDate.toISOString().split('T')[0]}
                        onChange={(e) => onNewProjectDataChange({ createdDate: new Date(e.target.value) })}
                        className="bg-gray-700 text-white border-gray-600 rounded-md p-2"
                      />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white hover:from-[#7059c4] hover:to-[#de65f7]"
                      onClick={onAddProject}
                    >
                      Save Project
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Project Grid */}
            <div className="grid grid-cols-5 gap-3">
              {projects.map((project) => (
                <ProjectContainer
                  key={project.id}
                  project={project}
                  deleteMode={deleteMode}
                  onDelete={onDeleteProject}
                  onEditCollection={onEditCollection}
                  onCollectionMove={onCollectionMove}
                  onDeleteCollection={onDeleteCollection}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collection Dialog */}
      <CollectionDialog
        isOpen={isCollectionDialogOpen}
        onClose={onCollectionDialogClose}
        onSave={onSaveCollection}
        initialData={editingCollection}
      />
    </div>
  )
} 