import React from 'react';

export default function SpecialFeatureLoader({ progress = null, label = 'Crafting Perfection' }) {
  // Ensure the progress value is safely bound between 0 and 100, default to 12
  const currentProgress = progress !== null ? Math.min(Math.max(progress, 0), 100) : 12;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#030303]">
      <div className="flex flex-col items-center justify-center bg-[#030303]/95 backdrop-blur-xl px-8 sm:px-10 py-6 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
        
        {/* Loading Label Display */}
        <div className="relative mb-4">
          <span className="text-amber-500 font-serif text-xl sm:text-2xl italic tracking-wider">
            {label}
          </span>
        </div>
        
        {/* Animated Progress Bar Container */}
        <div className="w-40 sm:w-48 h-[1px] bg-neutral-800 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
        
        {/* Dynamic Percentage Text */}
        <span className="text-neutral-500 font-mono text-[10px] tracking-[0.4em] uppercase mt-4">
          {progress === null ? 'Preparing experience' : `Loading ${currentProgress.toFixed(0)}%`}
        </span>
        
      </div>
    </div>
  );
}