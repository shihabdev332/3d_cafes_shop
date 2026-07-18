import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PrivateDining = () => {
  const container = useRef(null);

  useGSAP(
    () => {
      // Hero Section Animation
      const tl = gsap.timeline();
      tl.from(".hero-title", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2,
      }).from(
        ".hero-bg",
        {
          scale: 1.15,
          opacity: 0,
          duration: 2,
          ease: "power3.out",
        },
        "-=1.2"
      );

      // Features Scroll Animation
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Gallery Scroll Animation
      gsap.from(".gallery-img", {
        scrollTrigger: {
          trigger: ".gallery-section",
          start: "top 70%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
      });

      // CTA/Reservation Animation
      gsap.from(".reservation-box", {
        scrollTrigger: {
          trigger: ".reservation-section",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-amber-700 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 hero-bg">
          <img
            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80"
            alt="Exclusive Private Dining"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 mt-16">
          <p className="hero-title text-amber-500 tracking-[0.3em] uppercase text-sm mb-4 font-semibold">
            An Exclusive Experience
          </p>
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Private Dining
          </h1>
          <p className="hero-title text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Elevate your special occasions in our elegantly designed private spaces, tailored for intimate gatherings and unforgettable moments.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {[
            {
              title: "Tailored Menus",
              desc: "Work with our executive chef to curate a bespoke menu that perfectly suits your guests' tastes and dietary preferences.",
            },
            {
              title: "Dedicated Service",
              desc: "Enjoy the luxury of a private waitstaff, ensuring every detail is attended to with unobtrusive precision.",
            },
            {
              title: "Intimate Atmosphere",
              desc: "A beautifully appointed room with adjustable ambient lighting, custom music control, and complete privacy.",
            },
          ].map((feature, idx) => (
            <div key={idx} className="feature-card flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full border border-amber-600/30 flex items-center justify-center mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ambiance Gallery */}
      <section className="gallery-section py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="gallery-img overflow-hidden h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80" 
              alt="Dining Table Setting" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="gallery-img overflow-hidden h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80" 
              alt="Private Room Ambiance" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      {/* Reservation CTA Section */}
      <section className="reservation-section py-24 px-6 md:px-12">
        <div className="reservation-box max-w-4xl mx-auto bg-[#111111] border border-white/10 p-10 md:p-16 text-center relative overflow-hidden">
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-amber-600/50"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-amber-600/50"></div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-widest" style={{ fontFamily: 'Playfair Display, serif' }}>
            Reserve Your Table
          </h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            Our private dining room accommodates up to 20 guests. Please inquire early to secure your preferred date and time.
          </p>

          <form className="max-w-xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-amber-600 transition-colors"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="date" 
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-gray-400 focus:outline-none focus:border-amber-600 transition-colors"
              />
              <input 
                type="number" 
                placeholder="Number of Guests" 
                min="1"
                max="20"
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>
            <button 
              type="button" 
              className="mt-8 px-10 py-4 bg-transparent border border-amber-600 text-amber-500 uppercase tracking-widest text-sm hover:bg-amber-600 hover:text-white transition-all duration-300 w-full md:w-auto"
            >
              Request Booking
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default PrivateDining;