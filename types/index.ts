export interface HomePageProps {
  handleSignIn: () => Promise<void>
  handleSignUp: () => Promise<void>
  isLoading?: boolean
  error?: string
}

export interface HomePageState {
  isLoading: boolean
  error?: string
} 