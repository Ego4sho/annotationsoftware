import { ClipCardProps } from '../types';

export const ClipCard: React.FC<ClipCardProps> = ({ 
  clip, 
  isActive = false,
  isPending = false,
  isCompleted = false 
}) => {
  return (
    <div className="relative flex flex-col bg-gradient-to-r from-[#604abd] to-[#d84bf7] rounded-lg overflow-hidden">
      <div className="aspect-video w-full">
        <img 
          src={clip.thumbnail} 
          alt={clip.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-1">
        <p className="text-xs text-white truncate">{clip.title}</p>
      </div>

      <div 
        className={`
          absolute bottom-0 left-0 right-0 h-1
          ${isCompleted 
            ? 'bg-green-500'
            : isActive
              ? 'bg-gray-400'
              : 'bg-red-500'
          }
        `}
      />
    </div>
  );
}; 