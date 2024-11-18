import { AdminNote, StatusData } from '@/types/dashboard'

export const useDashboard = () => {
  const adminNotes: AdminNote[] = [
    { id: 1, author: 'Admin', timestamp: '2023-06-15 10:30', title: 'System Update', content: 'We will be performing a system update on June 20th at 2:00 AM EST. Please save your work before this time.' },
    { id: 2, author: 'Sarah', timestamp: '2023-06-14 15:45', title: 'New Feature Release', content: 'We\'re excited to announce the release of our new AI-assisted labeling feature. Check it out in the Label section!' },
    { id: 3, author: 'John', timestamp: '2023-06-13 09:15', title: 'Validation Guidelines Update', content: 'We\'ve updated our validation guidelines. Please review the new document in the Resources section.' },
    { id: 4, author: 'Emma', timestamp: '2023-06-12 14:00', title: 'Upcoming Training Session', content: 'There will be a training session on advanced rating techniques on June 25th at 11:00 AM EST. All raters are encouraged to attend.' },
    { id: 5, author: 'Admin', timestamp: '2023-06-11 16:30', title: 'Maintenance Notice', content: 'Routine maintenance will be performed on our servers this weekend. You may experience brief interruptions in service.' },
  ]

  const statusData: StatusData = {
    label: { finished: 1250, notLabeled: 350 },
    rate: { notRated: 800, rated: 450 },
    validate: { notValidated: 400, validated: 50 },
  }

  const handleAddNote = () => {
    console.log('Add note clicked')
  }
  
  const handleEditNote = (id: number) => {
    console.log('Edit note', id)
  }
  
  const handleDeleteNote = (id: number) => {
    console.log('Delete note', id)
  }
  
  const handleLabel = () => {
    console.log('Label clicked')
  }
  
  const handleRate = () => {
    console.log('Rate clicked')
  }
  
  const handleValidate = () => {
    console.log('Validate clicked')
  }

  return {
    adminNotes,
    statusData,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleLabel,
    handleRate,
    handleValidate
  }
} 