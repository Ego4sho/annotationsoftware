import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface StatusCardProps {
  title: string
  leftLabel: string
  leftValue: number
  rightLabel: string
  rightValue: number
  buttonLabel: string
  onClick?: () => void
  filePrefix: string
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  buttonLabel,
  onClick,
  filePrefix,
}) => {
  return (
    <Card className="bg-[#262626] border-none">
      <CardHeader>
        <CardTitle className="text-xl text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">{leftLabel}</p>
            <p className="text-2xl font-bold text-white">{leftValue}</p>
            <p className="text-xs text-gray-400">{filePrefix}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">{rightLabel}</p>
            <p className="text-2xl font-bold text-white">{rightValue}</p>
            <p className="text-xs text-gray-400">{filePrefix}</p>
          </div>
        </div>
        <Button 
          className="w-full bg-gradient-to-r from-[#604abd] to-[#d84bf7] text-white hover:opacity-90"
          onClick={onClick}
        >
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  )
} 