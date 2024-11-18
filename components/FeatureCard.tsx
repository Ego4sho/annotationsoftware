"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="relative overflow-hidden border-2 border-transparent hover:border-[#604abd] transition-colors">
      <CardHeader className="flex flex-col items-center text-center">
        {icon}
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-gray-500">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
} 