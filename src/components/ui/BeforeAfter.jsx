'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';

const BeforeAfter = ({ beforeImage, afterImage, alt = "Before and After" }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleDrag = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className="relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none border border-brand-gray shadow-xl group"
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseMove={handleDrag}
      onTouchStart={() => setIsDragging(true)}
      onTouchMove={handleDrag}
    >
      {/* After Image (Background) */}
      <img 
        src={afterImage} 
        alt={`After: ${alt}`}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      
      {/* Before Image (Foreground overlay) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt={`Before: ${alt}`}
          className="absolute inset-0 w-[200%] h-full object-cover pointer-events-none max-w-none"
          style={{ width: `calc(100% * (100 / ${sliderPosition || 1}))` }}
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 w-1 bg-white pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center shadow-xl border-2 border-white transition-transform group-hover:scale-110">
          <ArrowLeftRight className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Labels */}
      <div className={`absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm font-semibold pointer-events-none transition-opacity duration-300 ${sliderPosition < 20 ? 'opacity-0' : 'opacity-100'}`}>
        Before Repair
      </div>
      <div className={`absolute top-4 right-4 bg-brand-orange/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm font-semibold pointer-events-none transition-opacity duration-300 ${sliderPosition > 80 ? 'opacity-0' : 'opacity-100'}`}>
        After Repair
      </div>
    </div>
  );
};

export default BeforeAfter;
