import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroHeadingRef = useRef(null);
  const heroBtnRef = useRef(null);
  const contentSectionRef = useRef(null);
  const contentLeftRef = useRef(null);
  const contentRightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      const tl = gsap.timeline();

      tl.fromTo(
        heroHeadingRef.current,
        {
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
          y: 60,
          autoAlpha: 0,
        },
        {
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
          y: 0,
          autoAlpha: 1,
          duration: 1.4,
          ease: "power4.out",
        }
      ).fromTo(
        heroBtnRef.current,
        {
          y: 20,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.8"
      );

      // Content Section Animation
      gsap.fromTo(
        contentLeftRef.current,
        {
          x: -50,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        contentRightRef.current,
        {
          x: 50,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/didqmq9xz/video/upload/v1780605989/fbc4b857-bf3aca17_cwq3cn.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

        <div className="relative z-10 flex h-full items-center px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl">
            <h1
              ref={heroHeadingRef}
              className="mb-8 text-4xl font-normal leading-tight tracking-wide text-[#D4AF37] md:text-5xl lg:text-7xl"
            >
              Elevated Everyday Dining
            </h1>

            <div ref={heroBtnRef}>
              <Link
                to="/menu"
                className="inline-block border-b-2 border-[#D4AF37] pb-1.5 text-xs font-bold tracking-[0.2em] text-[#F8F1E4] uppercase transition-colors hover:text-[#D4AF37] md:text-sm"
              >
                RESERVE NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section
        ref={contentSectionRef}
        className="w-full overflow-visible bg-[#FAF9F6] px-6 py-24 text-black md:px-12 lg:px-24 lg:py-36"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-12 lg:gap-16">
          <div ref={contentLeftRef} className="md:col-span-5">
            <h2 className="text-3xl font-light leading-[1.15] tracking-wide text-[#1A1A1A] md:text-4xl lg:text-[52px]">
              Craveable dishes.
              <br />
              Vibrant spaces.
              <br />
              <span className="text-[#D4AF37]">
                Warm hospitality.
              </span>
            </h2>
          </div>

          <div
            ref={contentRightRef}
            className="md:col-span-7 md:pl-6 lg:pt-4"
          >
            <h4 className="max-w-2xl text-orange-300 md:text-lg">
              Our vibe is upbeat and stylish, fueled by energetic music,
              magnetic people, and spaces that feel as good as they look.
              Our chef-driven menu delivers bold, refined dishes with
              something for every craving. Fresh yet familiar, it's easy
              to love and easy to come back to.
            </h4>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;