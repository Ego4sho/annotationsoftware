'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Tag, 
  Star, 
  CheckSquare, 
  BarChart2, 
  Upload, 
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useState } from 'react';
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/labeling', icon: Tag, label: 'Label' },
    { href: '/rating', icon: Star, label: 'Rate' },
    { href: '/validate', icon: CheckSquare, label: 'Validate' },
    { href: '/analytics', icon: BarChart2, label: 'Analytics' },
    { href: '/upload', icon: Upload, label: 'Upload' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav 
      className={cn(
        "bg-[#262626] border-r border-[#604abd] flex flex-col h-screen transition-all duration-300",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col flex-1 py-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-end px-2 mb-4 text-white hover:text-[#604abd] transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="h-6 w-6" />
          ) : (
            <ChevronRight className="h-6 w-6" />
          )}
        </button>

        <div className="flex-1 space-y-2 px-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link 
              key={href}
              href={href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-colors",
                "hover:bg-[#604abd]/20",
                pathname === href ? "bg-[#604abd]" : ""
              )}
            >
              <Icon className="h-5 w-5 text-white" />
              {isExpanded && (
                <span className="ml-3 text-white whitespace-nowrap">
                  {label}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}; 