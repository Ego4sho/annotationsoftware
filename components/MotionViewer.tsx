'use client'

import * as React from 'react'
import { RotateCcw, ZoomIn, ZoomOut, Maximize } from 'lucide-react'

export function MotionViewer() {
  return (
    <div className="flex flex-col h-full rounded-lg border border-indigo-500/20 bg-[#1E1E1E] overflow-hidden">
      <div className="flex-1 bg-[#1E1E1E] relative">
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center">
          <div className="text-xs text-white/80">FPS: 60 | Verts: 10000 | Faces: 5000</div>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-black/20 rounded text-white/80">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-black/20 rounded text-white/80">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-black/20 rounded text-white/80">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-black/20 rounded text-white/80">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

