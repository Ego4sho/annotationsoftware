'use client'

import { useState, useEffect } from 'react'
import { LabelingInterfaceUI } from './components/LabelingInterfaceUI'
import { useAuth } from '@/lib/context/AuthContext'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

export default function LabelingInterfacePage() {
  const { user } = useAuth()
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: string}>({})
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | undefined>()

  const handleFileSelect = async (fileType: string, fileId: string) => {
    console.log('LabelingInterfacePage - File selected:', { fileType, fileId })
    
    setSelectedFiles(prev => ({
      ...prev,
      [fileType]: fileId
    }))

    // If it's a video file, get its URL
    if (fileType === 'video' && user) {
      try {
        // Query collections owned by the user
        const collectionsRef = collection(db, 'collections')
        const collectionsQuery = query(
          collectionsRef,
          where('userId', '==', user.uid),
          where('deleted', '==', false)
        )
        const collectionsSnapshot = await getDocs(collectionsQuery)
        console.log('Found collections:', collectionsSnapshot.docs.length)

        // Search through all collections for the file
        for (const doc of collectionsSnapshot.docs) {
          const collectionData = doc.data()
          console.log('Checking collection:', {
            id: doc.id,
            hasVideoFiles: !!collectionData.files?.video,
            videoFilesCount: collectionData.files?.video?.length || 0
          })
          
          if (collectionData.files?.video) {
            // Find the video file by ID
            const videoFile = collectionData.files.video.find((file: any) => file.id === fileId)
            if (videoFile) {
              console.log('Found video file:', {
                id: videoFile.id,
                fileName: videoFile.fileName,
                fileUrl: videoFile.fileUrl,
                storagePath: videoFile.storagePath
              })
              
              try {
                // If we have a direct fileUrl, use it
                if (videoFile.fileUrl && !videoFile.fileUrl.startsWith('blob:')) {
                  console.log('Using direct file URL:', videoFile.fileUrl);
                  setSelectedVideoUrl(videoFile.fileUrl);
                }
                // If no direct fileUrl or it's a blob URL, try to get it from storage
                else if (videoFile.storagePath) {
                  console.log('Getting URL from storage path:', videoFile.storagePath);
                  const storage = getStorage();
                  const fileRef = ref(storage, videoFile.storagePath);
                  const downloadUrl = await getDownloadURL(fileRef);
                  console.log('Got download URL from storage:', downloadUrl);
                  setSelectedVideoUrl(downloadUrl);
                } else {
                  console.error('No valid file URL or storage path found');
                }
              } catch (error) {
                console.error('Error getting video URL:', error);
              }
              break;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    }
  }

  useEffect(() => {
    console.log('Selected video URL changed:', selectedVideoUrl);
  }, [selectedVideoUrl]);

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
      selectedVideoUrl={selectedVideoUrl}
    />
  )
}