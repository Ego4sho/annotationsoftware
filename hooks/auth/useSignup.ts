import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/config'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const handleSignup = async (fullName: string, email: string, password: string) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      if (email === 'google') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        router.push('/dashboard')
        return
      }

      // Regular email/password sign up
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard')
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    handleSignup
  }
}
