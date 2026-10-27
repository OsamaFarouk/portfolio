"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface ReadingProgressBarProps {
  className?: string;
  isFixed?: boolean;
}

export default function ReadingProgressBar({
  className = "",
  isFixed = false,
}: ReadingProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pipRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;
      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;

      let progress = 0;
      if (maxScroll > 0) {
        if (currentScroll <= 1) {
          progress = 0;
        } else if (currentScroll >= maxScroll - 2) {
          progress = 1;
        } else {
          progress = currentScroll / maxScroll;
        }
      }

      // Frame-synchronized GPU-accelerated update using scaleX (no layout reflow)
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }

      // Leading precision glow pip tracking leading edge
      if (pipRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth || window.innerWidth;
        const pipX = progress * containerWidth;
        pipRef.current.style.transform = `translate3d(${pipX}px, -50%, 0)`;
        pipRef.current.style.opacity = progress > 0.002 ? "1" : "0";
      }

      rafId.current = null;
    };

    const requestUpdate = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateProgress);
      }
    };

    // Passive scroll and resize listeners for zero-latency tracking
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    // Handle dynamic page height changes from loading images, accordions, and DOM expansions
    const resizeObserver = new ResizeObserver(() => {
      requestUpdate();
    });

    resizeObserver.observe(document.documentElement);
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    // Window load event for late-loading media
    window.addEventListener("load", requestUpdate);

    // Initial update
    updateProgress();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("load", requestUpdate);
      resizeObserver.disconnect();
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className={`${
        isFixed
          ? "fixed top-0 left-0 right-0 h-[2px] z-50 print:hidden"
          : "absolute -bottom-[1px] left-0 right-0 h-[2px]"
      } bg-transparent pointer-events-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      {/* Hardware-accelerated scaleX progress bar */}
      <div
        ref={barRef}
        className="h-full w-full bg-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)] origin-left will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
      {/* Leading micro console glow pip */}
      <div
        ref={pipRef}
        className="absolute top-1/2 left-0 w-1.5 h-1.5 -ml-[3px] rounded-full bg-[#00ffcc] shadow-[0_0_8px_#00ffcc] opacity-0 will-change-transform pointer-events-none"
        style={{ transform: "translate3d(0, -50%, 0)" }}
      />
    </div>
  );
}
