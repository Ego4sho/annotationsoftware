'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardUI } from './components/DashboardUI'
import { useDashboard } from '@/hooks/dashboard/useDashboard'

export default function DashboardPage() {
  const router = useRouter()
  const dashboard = useDashboard()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [router])

  return <DashboardUI {...dashboard} />
}