'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, X, Search, Plus } from 'lucide-react'
import { Collection, Project } from '../types'
import { CollectionDialog } from './CollectionDialog'
import { CollectionCard } from './CollectionCard'

export const MainContainer: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [deleteMode, setDeleteMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFilter, setSortFilter] = useState<'newest' | 'oldest' | 'completed' | 'not-started' | 'in-progress'>('newest')
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false)
  const [isAddingProjectOpen, setIsAddingProjectOpen] = useState(false)
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    description: '',
    createdDate: new Date().toISOString().split('T')[0]
  })
  const { toast } = useToast()

  const handleCreateCollection = (newCollection: Collection) => {
    setCollections(prev => [newCollection, ...prev])
    setIsCollectionDialogOpen(false)
    toast({
      title: "Success",
      description: "Collection created successfully",
    })
  }

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection)
    setIsCollectionDialogOpen(true)
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
      title: newProjectData.title,
      description: newProjectData.description,
      createdDate: new Date(newProjectData.createdDate),
      collections: []
    }
    const today = new Date().toISOString().split('T')[0]
    setProjects(prev => [newProject, ...prev])
    setNewProjectData({
      title: '',
      description: '',
      createdDate: today
    })
    setIsAddingProjectOpen(false)
    toast({
      title: "Success",
      description: "Project created successfully",
    })
  }

  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePlusCardClick = () => {
    console.log('Plus card clicked');
    setEditingCollection(null);
    setIsCollectionDialogOpen(true);
  };

  const handleAddProjectClick = () => {
    console.log('Add project clicked')
    setIsAddingProjectOpen(!isAddingProjectOpen)
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#E5E7EB] p-6">
      <div className="flex justify-end mb-6">
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => setDeleteMode(!deleteMode)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {deleteMode ? 'Exit Delete Mode' : 'Enter Delete Mode'}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] overscroll-contain">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div 
              role="button"
              onClick={handlePlusCardClick}
              className="bg-gradient-to-r from-[#604abd] to-[#d84bf7] hover:from-[#7059c4] hover:to-[#de65f7] cursor-pointer p-8 flex items-center justify-center rounded-lg"
            >
              <Plus className="w-12 h-12 text-white" />
            </div>

            {filteredCollections.map(collection => (
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
              type="button"
              onClick={() => {
                console.log('Add project clicked');
                setIsAddingProjectOpen(!isAddingProjectOpen);
              }}
              className="bg-[#262626] hover:bg-[#303030] text-white w-auto flex items-center space-x-2 px-4 py-2 rounded-md"
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
                        value={newProjectData.createdDate}
                        onChange={(e) => setNewProjectData(prev => ({ 
                          ...prev, 
                          createdDate: e.target.value 
                        }))}
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
        </div>
      </ScrollArea>

      {isCollectionDialogOpen && (
        <CollectionDialog
          isOpen={isCollectionDialogOpen}
          onClose={() => setIsCollectionDialogOpen(false)}
          onSave={handleCreateCollection}
          initialData={editingCollection}
        />
      )}
    </div>
  )
} 