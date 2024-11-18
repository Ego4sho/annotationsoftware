"use client"

import { HomePageUI } from '../components/HomePageUI'
import { useHomePage } from '../hooks/useHomePage'

export default function HomePage() {
  const {
    isLoading,
    error,
    handleSignIn,
    handleSignUp
  } = useHomePage()

  return (
    <HomePageUI
      handleSignIn={handleSignIn}
      handleSignUp={handleSignUp}
      isLoading={isLoading}
      error={error}
    />
  )
}