"use client"

import { useState } from 'react'
import { DashboardProps } from '@/types/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Home, Tag, Star, CheckSquare, BarChart2, Upload, Settings, ChevronRight, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavItem } from './NavItem'
import { StatusCard } from './StatusCard'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navigation } from '../shared/Navigation'

export const DashboardUI: React.FC<DashboardProps> = ({
  adminNotes,
  statusData,
  handleAddNote,
  handleEditNote,
  handleDeleteNote,
  handleLabel,
  handleRate,
  handleValidate
}) => {
  const router = useRouter()
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [expandedNotes, setExpandedNotes] = useState<number[]>([])

  const toggleNote = (id: number) => {
    setExpandedNotes(prev =>
      prev.includes(id) ? prev.filter(noteId => noteId !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex h-screen bg-[#1A1A1A]">
      <Navigation />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>

        {/* Admin Notes */}
        <Card className="mb-8 bg-[#262626] border-none">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-white">
              <span>Admin Notes</span>
              <Button size="sm" onClick={handleAddNote}><Plus className="h-4 w-4 mr-2" /> Add Note</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {adminNotes.map((note) => (
                <Collapsible key={note.id} className="mb-4">
                  <CollapsibleTrigger className="flex justify-between items-center w-full text-left p-2 hover:bg-[#333333] rounded">
                    <div>
                      <h3 className="font-semibold text-white">{note.title}</h3>
                      <p className="text-sm text-gray-400">{note.timestamp} - {note.author}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-white transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-2 text-gray-300">
                    <p>{note.content}</p>
                    <div className="mt-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditNote(note.id)}>
                        <Edit className="h-4 w-4 mr-2 text-white" />
                        <span className="text-white">Edit</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteNote(note.id)}>
                        <Trash2 className="h-4 w-4 mr-2 text-white" />
                        <span className="text-white">Delete</span>
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Primary Status Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <StatusCard
            title="Label"
            titleClassName="text-white"
            leftLabel="Not Labeled"
            leftValue={statusData.label.notLabeled}
            rightLabel="Finished"
            rightValue={statusData.label.finished}
            buttonLabel="Label"
            onClick={() => router.push('/labelinginterface')}
            filePrefix="Files"
            valueClassName="text-white"
          />
          <StatusCard
            title="Rate"
            titleClassName="text-white"
            leftLabel="Not Rated"
            leftValue={statusData.rate.notRated}
            rightLabel="Rated"
            rightValue={statusData.rate.rated}
            buttonLabel="Rate"
            filePrefix="Files"
            valueClassName="text-white"
          />
          <StatusCard
            title="Validate"
            titleClassName="text-white"
            leftLabel="Not Validated"
            leftValue={statusData.validate.notValidated}
            rightLabel="Validated"
            rightValue={statusData.validate.validated}
            buttonLabel="Validate"
            filePrefix="Files"
            valueClassName="text-white"
          />
        </div>

        {/* Placeholder Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-gray-50 border-dashed border-2 border-gray-300">
              <CardContent className="h-48 flex items-center justify-center text-gray-400">
                <p>Future Feature {i + 1}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 