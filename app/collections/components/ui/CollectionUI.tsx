'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Trash2, Search, Plus } from 'lucide-react'
import { Navigation } from '@/components/shared/Navigation'
import { Collection, CollectionsUIProps } from '../../types'
import { CollectionCard } from './CollectionCard'
import { ProjectContainer } from './ProjectContainer'
import { CollectionDialog } from './CollectionDialog'

export const CollectionUI: React.FC<CollectionsUIProps> = ({
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
  onNewProjectDataChange
}) => {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#E5E7EB] p-6">
      <div className="flex">
        <Navigation />
        <div className="flex-1">
          <div className="flex justify-end mb-6">
            <Button 
              className={`bg-red-600 hover:bg-red-700 text-white`}
              onClick={onDeleteModeToggle}
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-gray-700 text-white border-gray-600"
              />
            </div>

            <Select value={sortFilter} onValueChange={onSortFilterChange}>
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
                  onClick={() => onEditCollection(null)}
                >
                  <Plus className="w-12 h-12 text-white" />
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

              <div className="w-full h-px bg-white/20" />

              <div className="grid grid-cols-2 gap-6">
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
          </ScrollArea>

          <CollectionDialog
            isOpen={isCollectionDialogOpen}
            onClose={onCollectionDialogClose}
            onSave={onSaveCollection}
            initialData={editingCollection}
          />
        </div>
      </div>
    </div>
  )
} 