import React, { useState, useEffect, useRef } from "react";
import { FiClock, FiArrowRight, FiX } from "react-icons/fi";
import gsap from "gsap";

export default function GrandLuxuryBlog() {
  const [selectedPost, setSelectedPost] = useState(null);

  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);

  // Expanded list of premium blog posts for a longer page layout
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Slow Roasting: Unlocking Deep Aromas",
      excerpt: "Discover the meticulous process behind our signature golden roast and how temperature timing changes everything.",
      content: "Slow roasting is more than a process; it is a symphony of time and temperature. By carefully controlling the heat, we allow the sugars within the coffee beans to caramelize perfectly, bringing out subtle notes of dark chocolate and a velvety smooth finish.",
      category: "Roasting",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Sourcing Excellence: High-Altitude Estates",
      excerpt: "A journey into the volcanic soils where our premium, ethically grown coffee beans are born.",
      content: "True quality begins at the source. Our beans are handpicked from sustainable, high-altitude farms nestled in volcanic regions. The thin air slows down the growth, allowing deeper flavor profiles.",
      category: "Sourcing",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "The Espresso Ritual & Creative Flow",
      excerpt: "How slowing down with a premium capsule or pour-over resets your daily cognitive performance.",
      content: "In a fast-paced world, the brewing ritual serves as a sanctuary for mindfulness. Taking ten minutes out of your day to sit quietly and appreciate the rich aroma can significantly reset your mental clarity.",
      category: "Culture",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "The Precision of Pour Over Mechanics",
      excerpt: "Mastering the geometry of water flow and paper filtration to isolate pure taste notes.",
      content: "Pour over brewing is an exact science. The angle of your kettle, the pattern of your pour, and the micro-texture of the paper filter all dictate which organic compounds are extracted first, ensuring a incredibly clean cup.",
      category: "Craft",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Sustainable Farming and the Bio-Dynamic Future",
      excerpt: "Protecting the ecosystems that reward us with extraordinary micro-lots year after year.",
      content: "We believe in circular farming. By supporting estates that use shade-grown techniques and natural compost, we preserve the soil biodiversity, securing the future of rare specialty coffee strains.",
      category: "Ethics",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "The Architecture of Sound and Coffee Gastronomy",
      excerpt: "Why the acoustic design of a luxury space completely changes how your brain perceives bitterness.",
      content: "Studies show that low-frequency sounds can enhance the perceived richness of food and drink. Our spaces are acoustically tuned with ambient textures to ensure every sip feels deeply resonant and premium.",
      category: "Design",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop",
    }
  ];

  // Initial load animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".animate-hero", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power4.out" }
      );
      gsap.fromTo(".luxury-card", 
        { opacity: 0, y: 25 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.4 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Modal open logic with autoAlpha
  useEffect(() => {
    if (selectedPost) {
      gsap.to(modalRef.current, { autoAlpha: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(modalContentRef.current, 
        { scale: 0.92, y: 30 }, 
        { scale: 1, y: 0, duration: 0.5, ease: "power4.out" }
      );
    }
  }, [selectedPost]);

  const closeModal = () => {
    gsap.to(modalContentRef.current, { scale: 0.92, y: 30, duration: 0.3, ease: "power3.in" });
    gsap.to(modalRef.current, { 
      autoAlpha: 0, 
      duration: 0.4, 
      ease: "power3.inOut",
      onComplete: () => setSelectedPost(null) 
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen mt-9 bg-[#0A0A0A] text-[#EAE3D2] font-sans antialiased overflow-x-hidden selection:bg-[#DFB178] selection:text-black">
      
      {/* Clean Grand Hero Header */}
      <header className="max-w-6xl mx-auto px-8 pt-40 pb-24 text-center">
        <span className="animate-hero text-xs tracking-[10px] uppercase text-[#DFB178] font-medium block mb-4 opacity-0">
          The Ivory Journal
        </span>
        <h1 className="animate-hero text-5xl md:text-7xl font-normal font-['Playfair_Display',serif] text-white tracking-tight leading-none max-w-4xl mx-auto opacity-0">
          Stories Behind The Perfect Brew
        </h1>
        <div className="animate-hero w-12 h-[1px] bg-[#DFB178]/30 mx-auto mt-10 opacity-0" />
      </header>

      {/* Massive & Spacious Article Grid Layout */}
      <main className="max-w-6xl mx-auto px-8 pb-32">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="luxury-card opacity-0 group flex flex-col cursor-pointer"
            >
              <div className="aspect-[16/11] overflow-hidden bg-zinc-950 rounded-lg relative mb-6">
                <img 
                  src={post.image} 
                  alt="" 
                  className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-103"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] text-[#DFB178] tracking-[3px] uppercase font-medium">{post.category}</span>
                  <h3 className="text-2xl font-normal font-['Playfair_Display',serif] text-white group-hover:text-[#DFB178] transition-colors duration-300 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-zinc-400 font-light text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-6 border-t border-zinc-900/60 mt-4">
                  <span className="flex items-center gap-2"><FiClock /> {post.readTime}</span>
                  <span className="text-[#DFB178] flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Discover <FiArrowRight />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Luxury Reading Modal Container */}
      <div 
        ref={modalRef}
        style={{ visibility: "hidden", opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 mt-8 md:p-12 cursor-pointer"
        onClick={closeModal}
      >
        {selectedPost && (
          <div 
            ref={modalContentRef}
            className="bg-[#0E0E0E] border border-zinc-900 max-w-3xl w-full rounded-xl overflow-hidden relative max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl shadow-black cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 p-2.5 bg-black/60 rounded-full text-zinc-400 hover:text-white border border-zinc-800/60 transition-colors z-10 cursor-pointer"
            >
              <FiX size={18} />
            </button>
            <div className="aspect-[21/10] w-full">
              <img src={selectedPost.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-8 md:p-12 space-y-6">
              <span className="text-xs text-[#DFB178] uppercase tracking-[4px] font-medium">{selectedPost.category}</span>
              <h2 className="text-3xl md:text-4xl font-normal font-['Playfair_Display',serif] text-white leading-tight">{selectedPost.title}</h2>
              <div className="w-16 h-[1px] bg-[#DFB178]/30 my-4" />
              <p className="text-zinc-300 font-light text-base leading-relaxed pt-2 whitespace-pre-line">{selectedPost.content}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}