import { NavItemProps } from "@/types/dashboard"

export const NavItem = ({ icon: Icon, label, onClick }: NavItemProps) => (
  <div 
    className="flex items-center space-x-2 p-2 hover:bg-purple-700 rounded cursor-pointer"
    onClick={onClick}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </div>
) 