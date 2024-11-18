'use client'

import { SignupForm } from '@/components/auth/SignupForm'
import { useSignup } from '@/hooks/auth/useSignup'

export default function SignupPage() {
  const { isLoading, error, handleSignup } = useSignup()

  return (
    <SignupForm
      onSubmit={handleSignup}
      isLoading={isLoading}
      error={error}
    />
  )
}