'use client'

import { UploadUI } from './components/ui/UploadUI';

export default function UploadPage() {
  // Add your hooks and state management here
  const mockProps = {
    collections: [],
    projects: [],
    deleteMode: false,
    searchTerm: '',
    sortFilter: 'newest' as const,
    editingCollection: null,
    isCollectionDialogOpen: false,
    isAddingProjectOpen: false,
    newProjectData: {
      title: '',
      description: '',
      createdDate: new Date(),
    },
    onCollectionMove: () => {},
    onCreateCollection: () => {},
    onEditCollection: () => {},
    onSaveCollection: () => {},
    onDeleteCollection: () => {},
    onAddProject: () => {},
    onDeleteProject: () => {},
    onDeleteModeToggle: () => {},
    onSearchChange: () => {},
    onSortFilterChange: () => {},
    onCollectionDialogClose: () => {},
    onAddingProjectToggle: () => {},
    onNewProjectDataChange: () => {},
    onAddNewCollection: () => {},
  };

  return <UploadUI {...mockProps} />;
} 