import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Importing images from assets
import wineImage from '../assets/item4.jpg';
import burgerImage from '../assets/item6.jpg';
import { Link } from 'react-router-dom';

const PromoCards = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Premium reveal animation
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.25,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    );
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="w-full bg-[#fcfbf9] py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* Card 1 */}
        <div ref={addToRefs} className="flex-1 flex flex-col group cursor-pointer">
          <div className="w-full aspect-[4/5] overflow-hidden mb-8 bg-gray-200">
            <img 
              src={wineImage} 
              alt="Wine" 
              className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
            />
          </div>
          <h3 className="text-2xl font-serif text-gray-900 mb-3">For the Wine Lovers</h3>
          <p className="text-gray-600 mb-6 font-light leading-relaxed">Enjoy 1/2 price bottles of wine on Tuesdays.</p>
          <Link to="/private-dining" className="text-xs font-bold tracking-[0.25em] uppercase border-b border-black pb-1 w-fit hover:text-gray-500 hover:border-gray-500 transition-colors">
            RESERVE NOW
          </Link>
        </div>

        {/* Card 2 */}
        <div ref={addToRefs} className="flex-1 flex flex-col group cursor-pointer">
          <div className="w-full aspect-[4/5] overflow-hidden mb-8 bg-gray-200">
            <img 
              src={burgerImage} 
              alt="Burger" 
              className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
            />
          </div>
          <h3 className="text-2xl font-serif text-gray-900 mb-3">The Deals You're Craving</h3>
          <p className="text-gray-600 mb-6 font-light leading-relaxed">Join us for daily Happy Hour & Late Night.</p>
          <Link to="/menu" className="text-xs font-bold tracking-[0.25em] uppercase border-b border-black pb-1 w-fit hover:text-gray-500 hover:border-gray-500 transition-colors">
            VIEW MENU
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PromoCards;