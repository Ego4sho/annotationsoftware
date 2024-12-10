import Link from 'next/link'
import { Button } from "@/components/ui/button"

interface DashboardCardProps {
  title: string
  description: string
  buttonText: string
  route: string
  // ... other props
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  buttonText,
  route,
  // ... other props
}) => {
  return (
    <div className="...">
      <h2>{title}</h2>
      <p>{description}</p>
      <Link href={route}>
        <Button>
          {buttonText}
        </Button>
      </Link>
    </div>
  )
} 