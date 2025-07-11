import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";

// Register GSAP plugin globally
gsap.registerPlugin(InertiaPlugin);

/**
 * ✅ SVG Filter Component
 * Put <LiquidDistortionFilter /> once in your root tree (e.g. App.tsx) to enable the liquid distortion filter.
 */
export const LiquidDistortionFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter id="liquid-filter" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.012 0.025"
        numOctaves="3"
        result="turbulence"
        seed="2"
      >
        <animate
          attributeName="baseFrequency"
          dur="20s"
          values="0.012 0.025;0.018 0.035;0.012 0.025"
          repeatCount="indefinite"
        />
      </feTurbulence>
      <feDisplacementMap
        in2="turbulence"
        in="SourceGraphic"
        scale="15"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

type AdvancedLiquidGlassCardProps = {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  saturate?: number;
  radius?: number;
  elasticity?: number; // controls fluid displacement range
};

/**
 * ✅ AdvancedLiquidGlassCard Component
 * A glass morphism card with liquid distortion and elasticity-based smooth fluid movement on hover.
 */
const AdvancedLiquidGlassCard: React.FC<AdvancedLiquidGlassCardProps> = ({
  children,
  className = "",
  blur = 28,
  saturate = 140,
  radius = 32,
  elasticity = 1,
}) => {
  const borderRef = useRef<HTMLSpanElement | null>(null);
  const highlightRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const highlight = highlightRef.current;
    const inner = innerRef.current;

    if (!card || !highlight || !inner) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      // Animate highlight radial gradient position
      gsap.to(highlight, {
        background: `radial-gradient(circle at ${nx * 100 + 50}% ${
          ny * 100 + 50
        }%, rgba(255,255,255,0.8), rgba(255,255,255,0) 60%)`,
        duration: 0.4,
        ease: "power3.out",
      });

      // Animate inner card displacement with elasticity
      gsap.to(inner, {
        x: nx * elasticity,
        y: ny * elasticity,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    };

    const handleMouseEnter = () => {
      gsap.to(highlight, { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(highlight, { opacity: 0, duration: 0.3 });
      // Return inner card to center smoothly
      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [elasticity]);

  const glassWarpStyle: React.CSSProperties = {
    filter: 'url("#liquid-filter")',
    backdropFilter: `blur(${blur}px) saturate(${saturate}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturate}%)`,
    background:
      "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0) 70%)",
    borderRadius: `${radius}px`,
  };

  const mainContainerStyle: React.CSSProperties = {
    borderRadius: `${radius}px`,
    boxShadow: "rgba(0, 0, 0, 0.75) 0px 16px 70px",
  };

  const borderOverlayStyle: React.CSSProperties = {
    borderRadius: `${radius}px`,
    pointerEvents: "none",
    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    padding: "2px",
    background: `
      linear-gradient(135deg,
        rgba(255,255,255,0.4) 0%,
        rgba(255,255,255,0.4) 25%,
        rgba(255,255,255,0.1) 75%,
        rgba(255,255,255,0.1) 100%
      )
    `,
  };

  const highlightOverlayStyle: React.CSSProperties = {
    ...borderOverlayStyle,
    background: "transparent",
    opacity: 0,
    transition: "opacity 0.3s ease-out",
    position: "absolute",
    inset: 0,
  };

  return (
    <div ref={cardRef} className={`relative ${className}`}>
      <div ref={innerRef} className="relative overflow-hidden" style={mainContainerStyle}>
        <span className="absolute inset-0" style={glassWarpStyle}></span>

        {/* Always-visible subtle border */}
        <span ref={borderRef} className="absolute inset-0" style={borderOverlayStyle}></span>

        {/* Highlight fluid effect border on hover */}
        <span ref={highlightRef} style={highlightOverlayStyle}></span>

        {/* Content */}
        <div className="relative z-10 p-8 text-white">{children}</div>
      </div>
    </div>
  );
};

export default AdvancedLiquidGlassCard;
