import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const jobOpenings = [
  {
    id: 1,
    title: "Head Barista",
    type: "Full-time",
    location: "Main Branch",
    desc: "Crafting exceptional coffee experiences with precision and passion.",
  },
  {
    id: 2,
    title: "Pastry Chef",
    type: "Full-time",
    location: "Bakery Hub",
    desc: "Creating artisanal pastries that perfectly complement our roasts.",
  },
  {
    id: 3,
    title: "Cafe Manager",
    type: "Full-time",
    location: "Downtown Outlet",
    desc: "Leading a dynamic team to deliver premium customer service.",
  },
];

const Careers = () => {
  const container = useRef(null);

  useGSAP(
    () => {
      // Hero Section Animation
      const tl = gsap.timeline();
      tl.from(".hero-text", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2,
      }).from(
        ".hero-image",
        {
          scale: 1.1,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
        },
        "-=0.8"
      );

      // Job List Scroll Animation
      gsap.from(".job-card", {
        scrollTrigger: {
          trigger: ".job-section",
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Values Section Scroll Animation
      gsap.from(".value-item", {
        scrollTrigger: {
          trigger: ".values-section",
          start: "top 80%",
        },
        opacity: 0,
        x: -30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-amber-700 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 hero-image">
          <img
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80"
            alt="Cafe Interior"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <h1 className="hero-text text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
            Join Our <span className="text-amber-600">Brew</span>
          </h1>
          <p className="hero-text text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            We are always looking for passionate individuals who share our love for artisanal coffee, premium service, and community.
          </p>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="values-section py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {["Premium Environment", "Growth Opportunities", "Artisan Culture"].map((value, idx) => (
            <div key={idx} className="value-item space-y-4">
              <div className="h-px w-12 bg-amber-600 mb-6"></div>
              <h3 className="text-2xl font-semibold text-white tracking-wide">{value}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Experience a workplace that values craftsmanship, continuous learning, and an uncompromising commitment to quality.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="job-section py-24 px-6 md:px-12 bg-[#111111]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 uppercase tracking-tight text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Open Positions
          </h2>
          
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div
                key={job.id}
                className="job-card group relative p-8 border border-white/10 hover:border-amber-600/50 bg-[#0a0a0a] transition-colors duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden"
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-500 transition-colors duration-300">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-400 uppercase tracking-widest">
                    <span>{job.type}</span>
                    <span className="w-1 h-1 rounded-full bg-amber-600"></span>
                    <span>{job.location}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2 max-w-lg">
                    {job.desc}
                  </p>
                </div>
                
                <button className="relative z-10 px-8 py-3 border border-white/20 text-sm uppercase tracking-widest hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all duration-300">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">
              Don't see a role that fits? Send your resume to <a href="mailto:careers@premiumcafe.com" className="text-amber-600 hover:underline">careers@premiumcafe.com</a>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Careers;