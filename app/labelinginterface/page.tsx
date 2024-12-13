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
        // Query collections owned by the user, including those in projects
        const collectionsRef = collection(db, 'collections')
        const collectionsQuery = query(
          collectionsRef,
          where('userId', '==', user.uid),
          where('deleted', '==', false)
        )
        const collectionsSnapshot = await getDocs(collectionsQuery)
        console.log('Found collections:', collectionsSnapshot.docs.length)

        // Search through all collections for the file
        for (const docSnapshot of collectionsSnapshot.docs) {
          const collectionData = docSnapshot.data()
          console.log('Checking collection:', {
            id: docSnapshot.id,
            name: collectionData.name,
            projectId: collectionData.projectId,
            hasVideoFiles: !!collectionData.files?.video,
            videoFilesCount: collectionData.files?.video?.length || 0
          })

          // Get the full collection document to ensure we have all data
          const fullCollectionDoc = await getDoc(doc(db, 'collections', docSnapshot.id))
          if (!fullCollectionDoc.exists()) {
            console.log('Collection document not found:', docSnapshot.id)
            continue
          }

          const fullCollectionData = fullCollectionDoc.data()
          console.log('Full collection data:', {
            id: fullCollectionDoc.id,
            name: fullCollectionData.name,
            videoFiles: fullCollectionData.files?.video || []
          })

          if (fullCollectionData.files?.video) {
            // Find the video file by ID
            const videoFile = fullCollectionData.files.video.find((file: any) => file.id === fileId)
            if (videoFile) {
              console.log('Found video file:', {
                id: videoFile.id,
                fileName: videoFile.fileName,
                storagePath: videoFile.storagePath
              })
              
              try {
                // Always try to get a fresh URL from storage
                if (videoFile.storagePath) {
                  console.log('Getting URL from storage path:', videoFile.storagePath);
                  const storage = getStorage();
                  const fileRef = ref(storage, videoFile.storagePath);
                  const downloadUrl = await getDownloadURL(fileRef);
                  console.log('Got fresh download URL from storage:', downloadUrl);
                  setSelectedVideoUrl(downloadUrl);
                } else {
                  console.error('No storage path found for video file');
                  setSelectedVideoUrl(undefined);
                }
                break;
              } catch (error) {
                console.error('Error getting video URL:', error);
                setSelectedVideoUrl(undefined);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error searching for video file:', error);
        setSelectedVideoUrl(undefined);
      }
    }
  }

  return (
    <div className="h-screen bg-black">
      <LabelingInterfaceUI
        selectedVideoUrl={selectedVideoUrl}
        onFileSelect={handleFileSelect}
      />
    </div>
  )
}