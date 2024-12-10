'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Flag, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react'

type Step = {
  id: string
  name: string
  labeledRated: number
  validated: number
  total: number
}

const mockSteps: Step[] = [
  { id: '1', name: 'Jumps', labeledRated: 50, validated: 30, total: 104 },
  { id: '2', name: 'Spins', labeledRated: 40, validated: 20, total: 80 },
  { id: '3', name: 'Footwork', labeledRated: 35, validated: 15, total: 60 },
  { id: '4', name: 'Step 4', labeledRated: 25, validated: 10, total: 50 },
  { id: '5', name: 'Step 5', labeledRated: 45, validated: 25, total: 70 },
  { id: '6', name: 'Completed Step', labeledRated: 75, validated: 75, total: 75 },
]

const mockRatings = [
  { name: 'Technique', score: 8 },
  { name: 'Artistry', score: 7 },
  { name: 'Difficulty', score: 9 },
  { name: 'Execution', score: 8 },
  { name: 'Interpretation', score: 7 },
  { name: 'Timing', score: 9 },
  { name: 'Performance', score: 8 },
  { name: 'Choreography', score: 9 },
]

export function ValidationMenu() {
  const [selectedStep, setSelectedStep] = useState<Step | null>(null)
  const [currentStepNumber, setCurrentStepNumber] = useState(0)
  const [flagged, setFlagged] = useState(false)

  const totalScore = mockRatings.reduce((sum, rating) => sum + rating.score, 0)

  return (
    <div className="flex flex-col h-full rounded-lg border border-purple-500/20 bg-[#1E2029] p-2 overflow-hidden">
      {!selectedStep ? (
        <div className="space-y-2 overflow-y-auto">
          <div className="grid grid-cols-5 gap-1">
            {mockSteps.filter(step => step.labeledRated !== step.validated).map((step) => (
              <Card
                key={step.id}
                className="p-2 bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 cursor-pointer transition-colors aspect-square flex flex-col justify-between"
                onClick={() => {
                  setSelectedStep(step)
                  setCurrentStepNumber(step.validated + 1)
                  setFlagged(false)
                }}
              >
                <h3 className="text-sm font-semibold text-white">{step.name}</h3>
                <div className="text-xs text-gray-200">
                  {step.labeledRated - step.validated} / {step.validated}
                </div>
              </Card>
            ))}
          </div>
          {mockSteps.some(step => step.labeledRated === step.validated) && (
            <div>
              <h3 className="text-sm font-semibold mb-1 text-white">Completed</h3>
              <div className="grid grid-cols-5 gap-1">
                {mockSteps.filter(step => step.labeledRated === step.validated).map((step) => (
                  <Card
                    key={step.id}
                    className="p-2 bg-gradient-to-br from-green-600 to-green-800 cursor-default aspect-square flex flex-col justify-between"
                  >
                    <h3 className="text-sm font-semibold text-white">{step.name}</h3>
                    <div className="text-xs text-gray-200">
                      {step.validated} / {step.total}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2 text-white overflow-y-auto">
          <button
            className="p-1 hover:bg-gray-700 rounded-full"
            onClick={() => {
              setSelectedStep(null)
              setFlagged(false)
            }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold text-center">{selectedStep.name}</h2>
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // Add play functionality
              }}
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // Add pause functionality
              }}
            >
              <Pause className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // Add restart functionality
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setCurrentStepNumber((prev) => Math.min(prev + 1, selectedStep.total))
                setFlagged(false)
              }}
            >
              <Check className="w-4 h-4 mr-1" />
              Validate
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </Button>
            <Button
              size="sm"
              className={`bg-yellow-600 hover:bg-yellow-700 ${flagged ? 'ring-2 ring-yellow-400' : ''}`}
              onClick={() => setFlagged(true)}
            >
              <Flag className="w-4 h-4 mr-1" />
              Flag
            </Button>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1 space-y-1 text-sm">
              {mockRatings.slice(0, Math.ceil(mockRatings.length / 2)).map((rating, index) => (
                <div key={index} className="flex justify-between">
                  <span>{rating.name}</span>
                  <span>{rating.score}/10</span>
                </div>
              ))}
            </div>
            <div className="w-px bg-white"></div>
            <div className="flex-1 space-y-1 text-sm">
              {mockRatings.slice(Math.ceil(mockRatings.length / 2)).map((rating, index) => (
                <div key={index} className="flex justify-between">
                  <span>{rating.name}</span>
                  <span>{rating.score}/10</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-center font-bold">
            Total Score: {totalScore}/{mockRatings.length * 10}
          </div>
          <div className="text-center text-sm">
            Step {currentStepNumber} of {selectedStep.total}
          </div>
        </div>
      )}
    </div>
  )
}

