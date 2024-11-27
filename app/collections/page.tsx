'use client'

import { CollectionUI } from './components/ui/CollectionUI'
import { useCollections } from './hooks/useCollections'
import { useProjects } from './hooks/useProjects'

export default function CollectionsPage() {
  const {
    collections,
    deleteMode,
    handleDelete,
    handleEdit,
    handleCollectionMove
  } = useCollections()

  const {
    projects,
    handleAddProject,
    handleDeleteProject
  } = useProjects()

  return (
    <CollectionUI
      collections={collections}
      projects={projects}
      deleteMode={deleteMode}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onCollectionMove={handleCollectionMove}
      onAddProject={handleAddProject}
      onDeleteProject={handleDeleteProject}
    />
  )
}
