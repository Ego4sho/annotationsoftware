'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardUI } from './components/DashboardUI'
import { useDashboard } from '@/hooks/dashboard/useDashboard'

export default function DashboardPage() {
  const {
    adminNotes,
    statusData,
    handleAddNote,
    handleEditNote,
    handleDeleteNote
  } = useDashboard()

  console.log('Current admin notes:', adminNotes)

  const router = useRouter()

  return (
    <DashboardUI 
      adminNotes={adminNotes}
      statusData={statusData}
      handleAddNote={handleAddNote}
      handleEditNote={handleEditNote}
      handleDeleteNote={handleDeleteNote}
    />
  )
}