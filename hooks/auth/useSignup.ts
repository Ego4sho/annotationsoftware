import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const handleSignup = async (fullName: string, email: string, password: string) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      if (email === 'google') {
        // Handle Google sign up
        console.log('Google sign up')
        await new Promise(resolve => setTimeout(resolve, 1500))
        router.push('/dashboard')
        return
      }

      // Regular email/password sign up
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Signup successful', { fullName, email, password })
      router.push('/dashboard')
    } catch (err) {
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
