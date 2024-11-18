import { LucideIcon } from 'lucide-react'
import React from 'react'

export interface AdminNote {
  id: number
  author: string
  timestamp: string
  title: string
  content: string
}

export interface StatusData {
  label: { finished: number, notLabeled: number }
  rate: { notRated: number, rated: number }
  validate: { notValidated: number, validated: number }
}

export interface DashboardProps {
  adminNotes: AdminNote[]
  statusData: StatusData
  handleAddNote: () => void
  handleEditNote: (id: number) => void
  handleDeleteNote: (id: number) => void
  handleLabel: () => void
  handleRate: () => void
  handleValidate: () => void
  isLoading?: boolean
  error?: string
}

export interface NavItemProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
}

export interface StatusCardProps {
  title: string
  leftLabel: string
  leftValue: number
  rightLabel: string
  rightValue: number
  buttonLabel: string
  filePrefix: string
} 