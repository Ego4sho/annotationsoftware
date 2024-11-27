import { Home, Tag, Star, CheckSquare, BarChart2, Upload, Settings } from 'lucide-react';
import { NavItem } from '@/components/dashboard/NavItem';
import { useRouter } from 'next/navigation';

export const Navigation = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-[60px] hover:w-64 group transition-all duration-300 h-screen bg-[#262626] border-r border-[#604abd] flex flex-col py-4 overflow-hidden">
      <div className="flex flex-col space-y-2">
        <NavItem 
          icon={<Home className="h-5 w-5" />} 
          label="Dashboard" 
          onClick={() => handleNavigation('/dashboard')}
        />
        <NavItem 
          icon={<Tag className="h-5 w-5" />} 
          label="Label" 
          onClick={() => handleNavigation('/labelinginterface')}
        />
        <NavItem 
          icon={<Star className="h-5 w-5" />} 
          label="Rate" 
          onClick={() => handleNavigation('/rate')}
        />
        <NavItem 
          icon={<CheckSquare className="h-5 w-5" />} 
          label="Validate" 
          onClick={() => handleNavigation('/validate')}
        />
        <NavItem 
          icon={<BarChart2 className="h-5 w-5" />} 
          label="Analytics" 
          onClick={() => handleNavigation('/analytics')}
        />
        <NavItem 
          icon={<Upload className="h-5 w-5" />} 
          label="Upload" 
          onClick={() => handleNavigation('/upload')}
        />
        <NavItem 
          icon={<Settings className="h-5 w-5" />} 
          label="Settings" 
          onClick={() => handleNavigation('/settings')}
        />
      </div>
    </div>
  );
}; 