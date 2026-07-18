import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

// Importing the images
import img1 from "../assets/coffee1.jpg";
import img2 from "../assets/coffee2.png";
import { Link } from "react-router-dom";

const PromoSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs for animation
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  // Interval for changing slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // GSAP Premium Transform Animation (Fixed Text Missing Issue)
  useEffect(() => {
    // Select direct children for staggered animation (h2, p, div)
    const t1Elements = text1Ref.current.children;
    const t2Elements = text2Ref.current.children;

    if (activeIndex === 0) {
      // 1. Image Transitions
      gsap.to(img1Ref.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
      });
      gsap.to(img2Ref.current, {
        autoAlpha: 0,
        scale: 1.05,
        duration: 1.5,
        ease: "power3.inOut",
      });

      // 2. Hide Slide 2 Text
      gsap.to(text2Ref.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(t2Elements, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });

      // 3. Show Slide 1 Text
      gsap.to(text1Ref.current, { autoAlpha: 1, duration: 0.1 }); // Instant parent visibility
      gsap.fromTo(
        t1Elements,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          stagger: 0.15,
          delay: 0.3,
        },
      );
    } else {
      // 1. Image Transitions
      gsap.to(img2Ref.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
      });
      gsap.to(img1Ref.current, {
        autoAlpha: 0,
        scale: 1.05,
        duration: 1.5,
        ease: "power3.inOut",
      });

      // 2. Hide Slide 1 Text
      gsap.to(text1Ref.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(t1Elements, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });

      // 3. Show Slide 2 Text
      gsap.to(text2Ref.current, { autoAlpha: 1, duration: 0.1 }); // Instant parent visibility
      gsap.fromTo(
        t2Elements,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          stagger: 0.15,
          delay: 0.3,
        },
      );
    }
  }, [activeIndex]);

  return (
    <section className="w-full bg-white flex flex-col md:flex-row pl-2 pr-2 overflow-hidden">
      {/* LEFT: Image Container with Scale Effect */}
      <div className="w-full md:w-1/2 relative h-[60vh] md:h-[80vh] overflow-hidden bg-[#f4f1eb]">
        <img
          ref={img1Ref}
          src={img1}
          alt="Coffee Promo 1"
          className="absolute inset-0 w-full h-full object-cover scale-105 will-change-transform"
        />
        <img
          ref={img2Ref}
          src={img2}
          alt="Coffee Promo 2"
          className="absolute inset-0 w-full h-full object-cover opacity-0 invisible scale-105 will-change-transform "
        />
      </div>

      {/* RIGHT: Text Content Container */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-20 px-8 md:px-16">
        <div className="grid w-full place-items-center">
          {/* TEXT CONTENT 1 */}
          <div
            ref={text1Ref}
            className="col-start-1 row-start-1 text-center max-w-[420px] w-full"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6 font-serif">
              Secure Your Spot for <br /> FIFA World Cup 2026™
            </h2>
            <p className="text-sm md:text-base text-gray-700 font-light mb-10 leading-relaxed">
              Reservations are live to book your match day. VIP table bookings
              for groups of 4+ are available at select locations.
            </p>
            <div>
              <Link
                to="/private-dining"
                className="text-xs text-orange-500 font-bold tracking-[0.15em] uppercase border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors duration-300 inline-block"
              >
                RESERVE NOW
              </Link>
            </div>
          </div>

          {/* TEXT CONTENT 2 */}
          <div
            ref={text2Ref}
            className="col-start-1 row-start-1 text-center max-w-[420px] w-full opacity-0 invisible"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6 font-serif">
              Experience the Best <br /> Premium Coffee Blend
            </h2>
            <p className="text-sm md:text-base text-gray-700 font-light mb-10 leading-relaxed">
              Start your morning right with our exclusively roasted beans. Order
              now and get it delivered straight to your door with special
              discounts.
            </p>
            <div>
              <Link
                to="/menu"
                className="text-xs text-orange-500 font-bold tracking-[0.15em] uppercase border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors duration-300 inline-block"
              >
                ORDER NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
