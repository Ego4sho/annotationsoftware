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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [expandedNotes, setExpandedNotes] = useState<number[]>([])

  const toggleNote = (id: number) => {
    setExpandedNotes(prev =>
      prev.includes(id) ? prev.filter(noteId => noteId !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Collapsible Navigation Sidebar */}
      <Collapsible
        open={isSidebarExpanded}
        onOpenChange={setIsSidebarExpanded}
        className="bg-gradient-to-b from-[#604abd] to-[#d84bf7] text-white p-4 flex flex-col h-full"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="self-end mb-4">
            {isSidebarExpanded ? <ChevronRight /> : <ChevronDown />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          <NavItem icon={Home} label="Dashboard" />
          <NavItem icon={Tag} label="Label" />
          <NavItem icon={Star} label="Rate" />
          <NavItem icon={CheckSquare} label="Validate" />
          <NavItem icon={BarChart2} label="Analysis" />
          <NavItem icon={Upload} label="File Upload" />
          <NavItem icon={Settings} label="Settings" />
          {[...Array(5)].map((_, i) => (
            <NavItem key={i} icon={ChevronRight} label={`Feature ${i + 1}`} />
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Main Dashboard Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Admin Notes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Admin Notes</span>
              <Button size="sm" onClick={handleAddNote}><Plus className="h-4 w-4 mr-2" /> Add Note</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {adminNotes.map((note) => (
                <Collapsible key={note.id} className="mb-4">
                  <CollapsibleTrigger className="flex justify-between items-center w-full text-left p-2 hover:bg-gray-100 rounded">
                    <div>
                      <h3 className="font-semibold">{note.title}</h3>
                      <p className="text-sm text-gray-500">{note.timestamp} - {note.author}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedNotes.includes(note.id) ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-2">
                    <p>{note.content}</p>
                    <div className="mt-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditNote(note.id)}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteNote(note.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
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
            leftLabel="Finished Labeling"
            leftValue={statusData.label.finished}
            rightLabel="Not Labeled"
            rightValue={statusData.label.notLabeled}
            buttonLabel="Label"
            filePrefix="Unlabeled File"
          />
          <StatusCard
            title="Rate"
            leftLabel="Not Rated"
            leftValue={statusData.rate.notRated}
            rightLabel="Rated"
            rightValue={statusData.rate.rated}
            buttonLabel="Rate"
            filePrefix="Unrated File"
          />
          <StatusCard
            title="Validate"
            leftLabel="Not Validated"
            leftValue={statusData.validate.notValidated}
            rightLabel="Validated"
            rightValue={statusData.validate.validated}
            buttonLabel="Validate"
            filePrefix="Unvalidated File"
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