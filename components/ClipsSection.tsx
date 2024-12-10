'use client'

import { Search, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'

type Clip = {
  id: string
  name: string
  status: 'pending' | 'validated' | 'current'
  flagged?: boolean
}

const mockClips: Clip[] = Array.from({ length: 32 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Clip ${i + 1}`,
  status: i < 25 ? (i === 0 ? 'current' : 'pending') : 'validated',
  flagged: i % 5 === 0
}))

export function ClipsSection() {
  return (
    <div className="flex flex-col h-full rounded-lg border border-indigo-500/20 bg-[#1E1E1E] overflow-hidden">
      <div className="p-2 border-b border-indigo-500/20">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            className="w-full bg-black/20 text-white placeholder-gray-400 pl-8 pr-2 py-1 rounded-md border border-indigo-500/20 text-sm"
            placeholder="Search clips..."
          />
        </div>
      </div>

      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {mockClips.filter(clip => clip.status !== 'validated').map((clip) => (
            <div
              key={clip.id}
              className={cn(
                "relative rounded-md bg-gradient-to-br from-purple-600 to-purple-800 p-1 flex flex-col justify-between aspect-square cursor-pointer",
                "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:rounded-b-md",
                clip.status === 'current' && "before:bg-gray-400",
                clip.status === 'pending' && "before:bg-red-500",
              )}
            >
              {clip.flagged && (
                <Flag className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-yellow-500" />
              )}
              <div className="w-5 h-5 bg-purple-500/50 rounded-md flex items-center justify-center text-[10px] mb-1">
                ?
              </div>
              <div className="text-[10px] text-white truncate">{clip.name}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <span className="relative px-2 bg-[#1E1E1E] text-gray-400 text-xs">
              Completed
            </span>
          </div>

          <div className="grid grid-cols-8 gap-1">
            {mockClips.filter(clip => clip.status === 'validated').map((clip) => (
              <div
                key={clip.id}
                className={cn(
                  "relative rounded-md bg-gradient-to-br from-purple-600 to-purple-800 p-1 flex flex-col justify-between aspect-square cursor-pointer",
                  "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:rounded-b-md",
                  "before:bg-green-500"
                )}
              >
                {clip.flagged && (
                  <Flag className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-yellow-500" />
                )}
                <div className="w-5 h-5 bg-purple-500/50 rounded-md flex items-center justify-center text-[10px] mb-1">
                  ?
                </div>
                <div className="text-[10px] text-white truncate">{clip.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

