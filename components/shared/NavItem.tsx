import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export const NavItem = ({ icon: Icon, label, onClick }: NavItemProps) => {
  return (
    <div 
      className="flex items-center space-x-2 p-2 hover:bg-[#604abd] rounded cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <Icon className="h-5 w-5 text-white" />
      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">{label}</span>
    </div>
  );
}; 