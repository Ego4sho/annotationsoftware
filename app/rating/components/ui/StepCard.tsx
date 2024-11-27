import { StepCardProps } from '../types';

export const StepCard: React.FC<StepCardProps> = ({ step, onClick }) => {
  return (
    <div 
      className="relative flex flex-col bg-gradient-to-r from-[#604abd] to-[#d84bf7] rounded-lg overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video w-full flex items-center justify-center">
        <span className="text-white font-semibold text-center">{step.name}</span>
      </div>

      <div className="p-1">
        <p className="text-xs text-white truncate text-center">{step.ratedClips}/{step.totalClips} Rated</p>
      </div>
    </div>
  );
}; 