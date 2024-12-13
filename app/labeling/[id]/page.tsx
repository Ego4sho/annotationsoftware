import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { LabelingInterfaceUI } from '../components/LabelingInterfaceUI';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function LabelingPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | undefined>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleFileSelect = async (fileType: string, fileId: string) => {
    console.log('LabelingPage - Handling file selection:', { fileType, fileId });
    if (fileType === 'video') {
      try {
        const storage = getStorage();
        const fileRef = ref(storage, fileId);
        const url = await getDownloadURL(fileRef);
        console.log('Video URL retrieved:', url);
        setSelectedVideoUrl(url);
      } catch (error) {
        console.error('Error getting video URL:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A1A]">
        <div className="text-white">Please log in to access this page.</div>
      </div>
    );
  }

  return (
    <LabelingInterfaceUI
      onFileSelect={handleFileSelect}
      selectedVideoUrl={selectedVideoUrl}
    />
  );
} 