import { Button } from "@/components/ui/button"
import { Collection, Project } from "@/types/upload"
import { useState, useEffect } from "react"
import { FileSelectionDialog } from "./FileSelectionDialog"
import { useCollectionsAndProjects } from "@/app/upload/hooks/useCollectionsAndProjects"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/lib/context/AuthContext"

interface LabelingInterfaceProps {
  onFileSelect: (fileType: string, fileId: string) => void
}

export function LabelingInterfaceUI({
  onFileSelect
}: LabelingInterfaceProps) {
  const [isFileSelectionOpen, setIsFileSelectionOpen] = useState(false)
  const { collections, projects, loading } = useCollectionsAndProjects()
  const { user } = useAuth()

  useEffect(() => {
    console.log('LabelingInterfaceUI - Auth State:', {
      isAuthenticated: !!user,
      userId: user?.uid,
      email: user?.email
    });

    console.log('LabelingInterfaceUI - Data State:', {
      collectionsCount: collections?.length || 0,
      projectsCount: projects?.length || 0,
      isLoading: loading,
      collections: collections?.map(c => ({
        id: c.id,
        name: c.name,
        userId: c.userId
      })),
      projects: projects?.map(p => ({
        id: p.id,
        name: p.name,
        userId: p.userId
      }))
    });
  }, [user, collections, projects, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Please log in to access this page.</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full rounded-lg border border-indigo-500/20 bg-[#1E1E1E] p-4 space-y-4">
        <Button 
          onClick={() => setIsFileSelectionOpen(true)}
          className="w-full py-2 px-4 bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white hover:from-[#7059c4] hover:to-[#de65f7] rounded-lg transition-all duration-300"
        >
          Select Files
        </Button>
      </div>

      <FileSelectionDialog
        open={isFileSelectionOpen}
        onOpenChange={setIsFileSelectionOpen}
        projects={projects}
        collections={collections}
        onFileSelect={onFileSelect}
      />
    </div>
  )
}