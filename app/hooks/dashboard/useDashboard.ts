import { useState, useEffect } from 'react'
import { AdminNote } from '@/types/dashboard'

export const useDashboard = () => {
  const [adminNotes, setAdminNotes] = useState<AdminNote[]>([])

  useEffect(() => {
    const savedNotes = localStorage.getItem('adminNotes')
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes)
        setAdminNotes(parsedNotes)
        console.log('Loaded saved notes:', parsedNotes)
      } catch (error) {
        console.error('Error loading saved notes:', error)
      }
    }
  }, [])

  const [statusData] = useState({
    label: { notLabeled: 10, finished: 5 },
    rate: { notRated: 8, rated: 7 },
    validate: { notValidated: 12, validated: 3 }
  })

  const handleAddNote = (newNote: AdminNote) => {
    console.log('Adding new note:', newNote)
    setAdminNotes(prevNotes => {
      const updatedNotes = [newNote, ...prevNotes]
      localStorage.setItem('adminNotes', JSON.stringify(updatedNotes))
      console.log('Updated notes:', updatedNotes)
      return updatedNotes
    })
  }

  const handleEditNote = (id: string) => {
    console.log('Edit note:', id)
  }

  const handleDeleteNote = (id: string) => {
    setAdminNotes(prevNotes => {
      const updatedNotes = prevNotes.filter(note => note.id !== id)
      localStorage.setItem('adminNotes', JSON.stringify(updatedNotes))
      return updatedNotes
    })
  }

  return {
    adminNotes,
    statusData,
    handleAddNote,
    handleEditNote,
    handleDeleteNote
  }
} 