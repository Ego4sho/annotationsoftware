'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { useLogin } from '@/hooks/auth/useLogin'

export default function LoginPage() {
  const { isLoading, error, handleLogin } = useLogin()

  return (
    <LoginForm
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  )
}