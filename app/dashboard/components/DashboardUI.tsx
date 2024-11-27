"use client"

import { DashboardProps } from '@/types/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StatusCard } from './StatusCard'
import { Navigation } from '@/components/shared/Navigation'
import { useRouter } from 'next/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"

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

  return (
    <div className="flex h-screen bg-[#1A1A1A] text-white overflow-hidden">
      <Navigation />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
          
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <StatusCard
              title="Label"
              leftLabel="Not Labeled"
              leftValue={statusData.label.notLabeled}
              rightLabel="Finished"
              rightValue={statusData.label.finished}
              buttonLabel="Label"
              onClick={() => router.push('/labelinginterface')}
              filePrefix="Files"
            />
            <StatusCard
              title="Rate"
              leftLabel="Not Rated"
              leftValue={statusData.rate.notRated}
              rightLabel="Rated"
              rightValue={statusData.rate.rated}
              buttonLabel="Rate"
              onClick={() => router.push('/ratinginterface')}
              filePrefix="Files"
            />
            <StatusCard
              title="Validate"
              leftLabel="Not Validated"
              leftValue={statusData.validate.notValidated}
              rightLabel="Validated"
              rightValue={statusData.validate.validated}
              buttonLabel="Validate"
              onClick={() => router.push('/validationinterface')}
              filePrefix="Files"
            />
          </div>

          {/* Admin Notes */}
          <Card className="bg-[#262626] border-none">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-center">
                <span>Admin Notes</span>
                <Button 
                  size="sm" 
                  onClick={handleAddNote}
                  className="bg-black hover:bg-black/80"
                >
                  <Plus className="h-4 w-4 mr-2 text-white" />
                  <span className="text-white">Add Note</span>
                </Button>
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
                      <ChevronDown className="h-4 w-4 text-white" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-2">
                      <p className="text-gray-300">{note.content}</p>
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
        </div>
      </div>
    </div>
  )
} 