import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Float,
  PerspectiveCamera,
  OrbitControls,
  useProgress,
} from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpecialFeatureLoader from "./SpecialFeatureLoader";
import "./SpecialFeature.css";

// Register GSAP ScrollTrigger Plugin for scroll animations
gsap.registerPlugin(ScrollTrigger);

// Preload the 3D model for performance optimization
const GLB_URL =
  "https://res.cloudinary.com/didqmq9xz/image/upload/v1780954664/Untitled_pbyeba.glb";
useGLTF.preload(GLB_URL);

// Component for the 3D Coffee Cup
const CoffeeCup = React.forwardRef(
  ({ onLoadComplete, onHover, onHoverOut }, ref) => {
    const { scene } = useGLTF(GLB_URL);

    useLayoutEffect(() => {
      if (scene) {
        // Delay for premium loader feel
        const loadingDelayTimer = setTimeout(() => {
          onLoadComplete();
        }, 1500);
        return () => clearTimeout(loadingDelayTimer);
      }
    }, [scene, onLoadComplete]);

    return (
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
        <primitive
          ref={ref}
          object={scene}
          scale={[14.4, 14.4, 14.4]}
          position={[0, -1.2, 0]}
          dispose={null} // Memory leak optimization
          onPointerOver={(event) => {
            event.stopPropagation();
            onHover();
            document.body.style.cursor = "grab";
          }}
          onPointerOut={(event) => {
            onHoverOut();
            document.body.style.cursor = "auto";
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
            onHover(); // Enable touch interaction
            document.body.style.cursor = "grabbing";
          }}
          onPointerUp={() => {
            document.body.style.cursor = "grab";
          }}
        />
      </Float>
    );
  },
);

export default function SpecialFeature() {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Track drag state for smooth rotation and zoom

  // Fetch real-time loading progress
  const { progress } = useProgress();

  // References for Three.js and DOM elements
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const controlsRef = useRef(null);

  const introTextRef = useRef(null);
  const featureText1Ref = useRef(null);
  const featureText2Ref = useRef(null);
  const featureText3Ref = useRef(null);
  const featureText4Ref = useRef(null);
  const featureText5Ref = useRef(null);
  const finalConclusionTextRef = useRef(null);

  useLayoutEffect(() => {
    // Ensure all references exist before initializing GSAP to prevent Invalid scope errors
    if (
      !isLoaded ||
      !containerRef.current ||
      !modelRef.current ||
      !cameraRef.current
    ) {
      return;
    }

    const matchMediaContext = gsap.matchMedia();

    matchMediaContext.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
      },
      (context) => {
        const { isMobile } = context.conditions;

        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=600%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true, // Helps with responsive resizing
          },
        });

        const allFloatingTexts = [
          featureText1Ref.current,
          featureText2Ref.current,
          featureText3Ref.current,
          featureText4Ref.current,
          featureText5Ref.current,
          finalConclusionTextRef.current,
        ];

        gsap.set(allFloatingTexts, { opacity: 0, y: isMobile ? 20 : 40 });
        gsap.set(introTextRef.current, { opacity: 1, y: 0 });
        cameraRef.current.position.set(0, 0, 6.5);
        modelRef.current.scale.set(14.4, 14.4, 14.4);
        modelRef.current.rotation.set(0, 0, 0);

        scrollTimeline.to(
          introTextRef.current,
          {
            opacity: 0,
            y: isMobile ? -20 : -40,
            duration: 0.5,
            ease: "power1.inOut",
          },
          0,
        );

        const finalModelScale = isMobile ? 22 : 34;
        const finalCameraYPosition = isMobile ? 4.5 : 6.8;

        scrollTimeline.to(
          modelRef.current.scale,
          {
            x: finalModelScale,
            y: finalModelScale,
            z: finalModelScale,
            ease: "none",
            duration: 6,
          },
          0,
        );
        scrollTimeline.to(
          cameraRef.current.position,
          {
            y: finalCameraYPosition,
            z: isMobile ? 4 : 2.8,
            ease: "none",
            duration: 6,
          },
          0,
        );

        const dynamicCameraTarget = { y: 0 };
        scrollTimeline.to(
          dynamicCameraTarget,
          {
            y: isMobile ? 0.5 : 1.2,
            ease: "none",
            duration: 6,
            onUpdate: () => {
              if (controlsRef.current) {
                controlsRef.current.target.set(0, dynamicCameraTarget.y, 0);
                controlsRef.current.update();
              }
            },
          },
          0,
        );

        const baseRotationStep = Math.PI * 0.7;

        allFloatingTexts.forEach((textElement, index) => {
          const sequenceStartTime = index * 1;

          scrollTimeline.to(
            modelRef.current.rotation,
            {
              y: baseRotationStep * (index + 1),
              ease: "power2.inOut",
              duration: 1,
            },
            sequenceStartTime,
          );
          scrollTimeline.to(
            textElement,
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
            sequenceStartTime + 0.2,
          );

          if (index < 5) {
            scrollTimeline.to(
              textElement,
              {
                opacity: 0,
                y: isMobile ? -20 : -30,
                duration: 0.3,
                ease: "power2.in",
              },
              sequenceStartTime + 0.8,
            );
          }
        });

        return () => {
          // Kill timeline and ScrollTrigger instance to prevent memory leaks
          scrollTimeline.kill();
          ScrollTrigger.getAll().forEach((t) => t.kill());
          gsap.killTweensOf(modelRef.current);
          gsap.killTweensOf(cameraRef.current);
        };
      },
    );

    return () => matchMediaContext.revert();
  }, [isLoaded]);

  return (
    <section
      className="special-feature"
      ref={containerRef}
      style={{ visibility: "visible" }}
    >
      {/* Intro Section */}
      <div className="sf-intro" ref={introTextRef}>
        <span className="sf-label">SPECIAL FEATURE</span>
        <h2 className="sf-heading">
          Experience Every Detail of Premium Coffee
        </h2>
        <p className="sf-desc">
          Discover the craftsmanship behind every cup. Scroll to explore the
          aroma, texture, and richness of Ivori Coffee through an immersive 3D
          experience.
        </p>
      </div>

      {/* Floating Description Texts */}
      <div className="sf-text-block right" ref={featureText1Ref}>
        <h3>Premium Roasted Beans</h3>
        <p>Carefully selected beans roasted to perfection.</p>
      </div>
      <div className="sf-text-block left" ref={featureText2Ref}>
        <h3>Ethically Sourced</h3>
        <p>
          Harvested from sustainable, high-altitude farms for the purest
          quality.
        </p>
      </div>
      <div className="sf-text-block right" ref={featureText3Ref}>
        <h3>Rich Aroma</h3>
        <p>An unforgettable fragrance crafted for true coffee lovers.</p>
      </div>
      <div className="sf-text-block left" ref={featureText4Ref}>
        <h3>Precision Brewing</h3>
        <p>
          Engineered to extract the perfect tasting notes, every single time.
        </p>
      </div>
      <div className="sf-text-block right" ref={featureText5Ref}>
        <h3>Exceptional Taste</h3>
        <p>Balanced flavor with smooth texture and deep character.</p>
      </div>

      {/* Final Conclusion Text */}
      <div className="sf-text-block center final" ref={finalConclusionTextRef}>
        <h3>Crafted for the Perfect Moment</h3>
        <p>
          Every sip of Ivori Coffee is designed to deliver warmth, comfort, and
          an unforgettable premium experience.
        </p>
      </div>

      {/* 3D Canvas - Optimized & Restricted Interactions */}
      <div
        className="sf-canvas-container"
        style={{ touchAction: isHovered || isDragging ? "none" : "auto" }} // Prevents page scroll ONLY when touching the model
      >
        <Canvas
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.5]}
          style={{ touchAction: "inherit" }}
        >
          <PerspectiveCamera makeDefault ref={cameraRef} />

          {/* Updated OrbitControls to allow full interaction on all devices */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true} // Enables sliding and moving the model
            enableZoom={true} // Ensures mobile pinch-to-zoom works flawlessly
            enableRotate={true} // Ensures mobile swipe rotation works flawlessly
            minDistance={3} // Prevents zooming in too much
            maxDistance={10} // Prevents zooming out too much
            onStart={() => setIsDragging(true)} // Keeps interaction active even if pointer leaves model while dragging
            onEnd={() => setIsDragging(false)}
          />

          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.5}
              color="#F5E6D3"
            />
            <directionalLight
              position={[-5, 5, -5]}
              intensity={0.8}
              color="#D4A574"
            />
            <Environment preset="city" />

            <CoffeeCup
              ref={modelRef}
              onLoadComplete={() => setIsLoaded(true)}
              onHover={() => setIsHovered(true)}
              onHoverOut={() => setIsHovered(false)}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Dynamic Loader Display */}
      {!isLoaded && (
        <SpecialFeatureLoader progress={progress} label="Loading Experience" />
      )}
    </section>
  );
}