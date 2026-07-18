import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Importing the background image
import bgImage from '../assets/background.jpg';
import { Link } from 'react-router-dom';

const FixedBackgroundSection = () => {
  const textContainerRef = useRef(null);

  useEffect(() => {
    // Smooth GSAP animation for text content
    const textElements = textContainerRef.current.children;
    
    gsap.fromTo(textElements, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <section 
      className="relative w-full h-screen flex items-center justify-center bg-fixed bg-center bg-cover bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay for better text readability across all devices */}
      <div className="absolute inset-0 bg-black/45"></div>

      {/* Main Content Container - Fully Responsive & Max 1 Screen */}
      <div 
        ref={textContainerRef} 
        className="relative z-10 text-center px-6 md:px-12 flex flex-col items-center justify-center max-w-2xl w-full h-full select-none"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-light tracking-wide mb-4 font-serif leading-tight">
          We're Open in Miami
        </h2>
        
        <p className="text-xs sm:text-sm md:text-base text-gray-200 font-light mb-8 max-w-md leading-relaxed tracking-wide">
          Get a taste of our newest location, now open at 201 S Biscayne Blvd.
        </p>
        
        <Link 
          to="/private-dining"
          className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-white border-b border-white pb-1.5 hover:text-gray-300 hover:border-gray-300 transition-colors duration-300 inline-block"
        >
          RESERVE NOW
        </Link>
      </div>
    </section>
  );
};

export default FixedBackgroundSection;