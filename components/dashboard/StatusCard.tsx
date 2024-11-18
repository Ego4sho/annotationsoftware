import { StatusCardProps } from "@/types/dashboard"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export const StatusCard = ({ 
  title, 
  leftLabel, 
  leftValue, 
  rightLabel, 
  rightValue, 
  buttonLabel, 
  filePrefix 
}: StatusCardProps) => (
  <Card className="bg-gradient-to-br from-[#604abd] to-[#d84bf7] text-white">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between mb-4">
        <div className="text-center">
          <p className="text-3xl font-bold">{leftValue}</p>
          <p className="text-sm">{leftLabel}</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{rightValue}</p>
          <p className="text-sm">{rightLabel}</p>
        </div>
      </div>
      <ScrollArea className="h-24 bg-white/10 rounded p-2 mb-4">
        <ul className="space-y-1">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="text-sm">{filePrefix} {i + 1}</li>
          ))}
        </ul>
      </ScrollArea>
    </CardContent>
    <CardFooter>
      <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">{buttonLabel}</Button>
    </CardFooter>
  </Card>
) 