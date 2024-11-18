import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const useHomePage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to navigate')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    try {
      router.push('/signup')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to navigate')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    handleSignIn,
    handleSignUp
  }
} 