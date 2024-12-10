import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/config'
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  browserPopupRedirectResolver
} from 'firebase/auth'

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      if (email === 'google') {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        
        try {
          const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
          if (result.user) {
            router.push('/dashboard');
          }
        } catch (popupError: any) {
          if (popupError.code === 'auth/popup-closed-by-user') {
            setError('Sign-in was cancelled. Please try again.');
          } else {
            console.error('Google sign-in error:', popupError);
            setError('Failed to sign in with Google. Please try again.');
          }
          return;
        }
        return;
      }

      // Regular email/password sign in
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError(err.message || 'Failed to sign in');
      }
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
