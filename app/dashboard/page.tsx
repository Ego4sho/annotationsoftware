'use client'

import { DashboardUI } from '@/components/dashboard/DashboardUI'
import { useDashboard } from '@/hooks/dashboard/useDashboard'

export default function DashboardPage() {
  const {
    adminNotes,
    statusData,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleLabel,
    handleRate,
    handleValidate
  } = useDashboard()

  return (
    <DashboardUI
      adminNotes={adminNotes}
      statusData={statusData}
      handleAddNote={handleAddNote}
      handleEditNote={handleEditNote}
      handleDeleteNote={handleDeleteNote}
      handleLabel={handleLabel}
      handleRate={handleRate}
      handleValidate={handleValidate}
    />
  )
}