import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      // Mock authentication - replace with real auth later
      if (email === 'google') {
        // Handle Google sign in
        console.log('Google sign in')
        await new Promise(resolve => setTimeout(resolve, 1500))
        // Set some auth state/token here
        localStorage.setItem('isAuthenticated', 'true')
        router.push('/dashboard')
        return
      }

      // Regular email/password sign in
      await new Promise(resolve => setTimeout(resolve, 1500))
      if (email === 'user@example.com' && password === 'password') {
        // Set some auth state/token here
        localStorage.setItem('isAuthenticated', 'true')
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    handleLogin
  }
}
