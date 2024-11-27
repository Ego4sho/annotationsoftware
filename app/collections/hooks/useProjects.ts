import { useState, useCallback } from 'react'
import { Project } from '../types'

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])

  const handleAddProject = useCallback((project: Project) => {
    setProjects(prev => [...prev, project])
  }, [])

  const handleDeleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  return {
    projects,
    handleAddProject,
    handleDeleteProject
  }
} 