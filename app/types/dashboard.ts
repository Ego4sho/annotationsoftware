export interface AdminNote {
  id: string
  title: string
  content: string
  timestamp: string
  author: string
}

export interface DashboardProps {
  adminNotes: AdminNote[]
  statusData: {
    label: { notLabeled: number; finished: number }
    rate: { notRated: number; rated: number }
    validate: { notValidated: number; validated: number }
  }
  handleAddNote: (note: AdminNote) => void
  handleEditNote: (id: string) => void
  handleDeleteNote: (id: string) => void
  handleLabel?: () => void
  handleRate?: () => void
  handleValidate?: () => void
} 