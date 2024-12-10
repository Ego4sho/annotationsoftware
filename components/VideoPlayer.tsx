'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function VideoPlayer() {
  return (
    <div className="flex flex-col h-full rounded-lg border border-indigo-500/20 bg-[#1E1E1E] overflow-hidden">
      <div className="flex-1 bg-[#1E1E1E] relative">
        <div className="absolute top-2 left-2 text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
          webview
        </div>
      </div>
      <div className="p-4 space-y-4 bg-[#1E1E1E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-black/20 rounded text-white/80">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-1 hover:bg-black/20 rounded text-white/80">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="p-1 hover:bg-black/20 rounded text-white/80">
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
          <div className="text-white/80 font-mono">00:00:00:00</div>
          <Select defaultValue="time">
            <SelectTrigger className="w-24 bg-white text-black border-0">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="frame">Frame</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-1 bg-black/20 rounded-full">
          <div className="h-full w-0 bg-indigo-500/50 rounded-full" />
        </div>
      </div>
    </div>
  )
}

