import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Importing images from assets folder
import item1 from '../assets/item1.jpg';
import item2 from '../assets/item2.jpg';
import item3 from '../assets/item3.jpg';
import item4 from '../assets/item4.jpg';
import item5 from '../assets/item5.jpg';
import item6 from '../assets/item6.jpg';
import item7 from '../assets/item7.jpg';

const menuItems = [
  { id: 1, name: 'Frosé (at Canadian Locations)', img: item1 },
  { id: 2, name: 'Scallop & Prawn Ceviche', img: item2 },
  { id: 3, name: 'Paloma Rosa', img: item3 },
  { id: 4, name: 'Classic Burger', img: item4 },
  { id: 5, name: 'White Sangria', img: item5 },
  { id: 6, name: 'Spaghetti Portofino', img: item6 },
  { id: 7, name: 'Premium Steak', img: item7 },
];

const MenuCarousel = () => {
  // Creating proper clones boundary to prevent blank flash or disappearing cards
  const extendedItems = [
    menuItems[menuItems.length - 1], 
    ...menuItems,
    menuItems[0],                    
    menuItems[1],                    
  ];

  const [currentIndex, setCurrentIndex] = useState(1); 
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [dimensions, setDimensions] = useState({ slideWidth: 45, gap: 32 });
  const autoPlayRef = useRef(null);

  // Handle responsive dimensions via state to avoid calculation mismatch
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setDimensions({
        slideWidth: isMobile ? 90 : 45,
        gap: isMobile ? 20 : 32
      });
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startAutoplay = () => {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        // Prevent incrementing out of bounds if the transition hasn't fired yet
        if (prev >= menuItems.length + 1) return prev;
        return prev + 1;
      });
    }, 5000);
  };

  useEffect(() => {
    startAutoplay();

    // Pause autoplay when the browser tab is hidden to prevent index runaway
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(autoPlayRef.current);
      } else {
        startAutoplay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(autoPlayRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Seamless boundary checking with safe fallback limits (<= and >=)
  const handleTransitionEnd = () => {
    if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(menuItems.length); 
    } else if (currentIndex >= menuItems.length + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1); 
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => setIsTransitioning(true), 30);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const handleDotClick = (index) => {
    setIsTransitioning(true); // Ensure smooth sliding when manually clicked
    setCurrentIndex(index + 1);
    startAutoplay(); 
  };

  const activeDotIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;

  return (
    <section className="w-full bg-[#f4f1eb] py-24 px-6 md:px-12 lg:px-24 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="mb-14">
          <h3 className="text-[11px] tracking-[0.25em] uppercase font-bold text-gray-900 border-b border-black/40 pb-2 inline-block">
            Only the icons
          </h3>
          <p className="text-gray-600 text-sm md:text-base font-light tracking-wide mt-4 max-w-md">
            From cocktails that flirt to dishes that deliver.
          </p>
          <Link to="/menu" className="text-xs text-blue-900 font-bold tracking-[0.15em] uppercase border-b border-black mt-6 inline-block pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors">
            VIEW MENU
          </Link>
        </div>

        {/* CAROUSEL CONTAINER */}
        <div className="relative w-full overflow-visible">
          <div 
            className="flex will-change-transform"
            style={{
              gap: `${dimensions.gap}px`,
              transform: `translateX(calc(-${currentIndex * dimensions.slideWidth}% - ${currentIndex * dimensions.gap}px))`,
              transition: isTransitioning ? 'transform 1000ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedItems.map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className="w-[90%] md:w-[45%] flex-shrink-0 flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-200 shadow-sm">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <p className="mt-5 text-xs md:text-sm italic font-serif tracking-wide text-gray-900">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PAGINATION DOTS */}
        <div className="flex justify-start items-center space-x-2.5 mt-14 pl-1">
          {menuItems.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                activeDotIndex === index 
                  ? 'w-6 bg-[#c49a45]' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default MenuCarousel;