'use client'

import { LabelingInterfaceUI } from './components/LabelingInterfaceUI'
import { useState } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function LabelingInterfacePage() {
  const { user } = useAuth()
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: string}>({})

  const handleFileSelect = (fileType: string, fileId: string) => {
    setSelectedFiles(prev => ({
      ...prev,
      [fileType]: fileId
    }))
    console.log('Selected file:', { fileType, fileId })
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A1A]">
        <div className="text-white">Please log in to access this page.</div>
      </div>
    )
  }

  return (
    <LabelingInterfaceUI
      onFileSelect={handleFileSelect}
    />
  )
}