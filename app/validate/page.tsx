'use client'

import { VideoPlayer } from "@/components/VideoPlayer"
import { MotionViewer } from "@/components/MotionViewer"
import { ClipsSection } from "@/components/ClipsSection"
import { ValidationMenu } from "@/components/ValidationMenu"
import { Navigation } from "@/components/shared/Navigation"

export default function ValidatePage() {
  return (
    <div className="flex h-screen bg-black">
      <Navigation />
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        <div className="h-[350px] grid grid-cols-2 gap-4">
          <VideoPlayer />
          <MotionViewer />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          <ClipsSection />
          <ValidationMenu />
        </div>
      </div>
    </div>
  )
} 