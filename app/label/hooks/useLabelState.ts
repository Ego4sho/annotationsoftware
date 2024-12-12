import { useState, useEffect } from 'react';
import { Collection, Project, ProjectFile } from '@/types/upload';
import { useCollectionsAndProjects } from '@/app/upload/hooks/useCollectionsAndProjects';

type ViewState = 'projects' | 'collections' | 'files';
type FileType = 'video' | 'audio' | 'motion';

interface SelectedFile {
  id: string;
  type: FileType;
  file: ProjectFile;
}

interface UseLabelStateReturn {
  viewState: ViewState;
  selectedProjectId: string | null;
  selectedCollectionId: string | null;
  selectedFiles: { [key: string]: boolean };
  selectedFilesByType: { [K in FileType]: ProjectFile | null };
  projects: Project[];
  collections: Collection[];
  filteredCollections: Collection[];
  currentCollection: Collection | null;
  loading: boolean;
  isSelectionOpen: boolean;
  handleProjectSelect: (projectId: string) => void;
  handleUnassignedSelect: () => void;
  handleCollectionSelect: (collectionId: string) => void;
  handleBackToProjects: () => void;
  handleBackToCollections: () => void;
  handleFileSelect: (fileId: string, type: FileType) => void;
  handleOpenSelection: () => void;
  handleCloseSelection: () => void;
  getSelectedProject: () => Project | null;
}

export function useLabelState(): UseLabelStateReturn {
  const [viewState, setViewState] = useState<ViewState>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: boolean }>({});
  const [selectedFilesByType, setSelectedFilesByType] = useState<{ [K in FileType]: ProjectFile | null }>({
    video: null,
    audio: null,
    motion: null
  });
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  
  const { collections, projects, loading } = useCollectionsAndProjects();

  const filteredCollections = selectedProjectId
    ? collections.filter(c => c.projectId === selectedProjectId)
    : collections.filter(c => !c.projectId);

  const currentCollection = selectedCollectionId 
    ? collections.find(c => c.id === selectedCollectionId) || null
    : null;

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setViewState('collections');
  };

  const handleUnassignedSelect = () => {
    setSelectedProjectId(null);
    setViewState('collections');
  };

  const handleCollectionSelect = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setViewState('files');
    // Reset file selections
    setSelectedFiles({});
    setSelectedFilesByType({
      video: null,
      audio: null,
      motion: null
    });
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setSelectedCollectionId(null);
    setViewState('projects');
    setSelectedFiles({});
    setSelectedFilesByType({
      video: null,
      audio: null,
      motion: null
    });
  };

  const handleBackToCollections = () => {
    setSelectedCollectionId(null);
    setViewState('collections');
    setSelectedFiles({});
    setSelectedFilesByType({
      video: null,
      audio: null,
      motion: null
    });
  };

  const handleFileSelect = (fileId: string, type: FileType) => {
    if (!currentCollection) return;

    const file = currentCollection.files[type].find(f => f.id === fileId);
    if (!file) return;

    // Toggle the file selection
    setSelectedFiles(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));

    // Update the selected file for this type
    setSelectedFilesByType(prev => ({
      ...prev,
      [type]: prev[type]?.id === fileId ? null : file
    }));

    // Close the selection dialog after selecting files
    if (Object.values(selectedFiles).some(selected => selected)) {
      setIsSelectionOpen(false);
    }
  };

  const handleOpenSelection = () => {
    setIsSelectionOpen(true);
    setViewState('projects');
  };

  const handleCloseSelection = () => {
    setIsSelectionOpen(false);
  };

  const getSelectedProject = () => {
    if (!selectedProjectId) return null;
    return projects.find(p => p.id === selectedProjectId) || null;
  };

  return {
    viewState,
    selectedProjectId,
    selectedCollectionId,
    selectedFiles,
    selectedFilesByType,
    projects,
    collections,
    filteredCollections,
    currentCollection,
    loading,
    isSelectionOpen,
    handleProjectSelect,
    handleUnassignedSelect,
    handleCollectionSelect,
    handleBackToProjects,
    handleBackToCollections,
    handleFileSelect,
    handleOpenSelection,
    handleCloseSelection,
    getSelectedProject
  };
} 