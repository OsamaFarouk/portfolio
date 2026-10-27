"use client";

import React, { useRef, useEffect, useState } from "react";

interface ConsoleSectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function ConsoleSection({
  id,
  children,
  className = "",
  ...props
}: ConsoleSectionProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Immediately reveal without animation if reduced motion preferred
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    // If section is already in or above viewport on mount (e.g. initial load or hash navigation)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.05,
      }
    );

    observer.observe(el);

    // Resilient fallback: ensure content is never permanently hidden
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`console-reveal-block ${isRevealed ? "is-revealed" : "reveal-pending"} ${className}`}
      data-revealed={isRevealed}
      {...props}
    >
      {children}
    </section>
  );
}
