"use client";

import React, { useEffect, useState, useRef } from "react";

export default function ConsoleCursor() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Apply only to devices with fine pointer and hover support (desktop mouse / precision trackpad)
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) {
      return;
    }

    setMounted(true);
    document.documentElement.classList.add("console-cursor-active");

    const updatePosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }
      rafId.current = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      if (!rafId.current) {
        rafId.current = requestAnimationFrame(updatePosition);
      }

      // Check target element type
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tagName = target.tagName.toLowerCase();
      const isText =
        tagName === "input" ||
        tagName === "textarea" ||
        target.isContentEditable ||
        target.getAttribute("role") === "textbox";

      setIsTextInput(isText);

      // Check if target is an interactive clickable element
      const isInteractive = Boolean(
        target.closest(
          "a, button, [role='button'], input[type='submit'], input[type='button'], summary, .cursor-pointer"
        )
      );
      setIsHovered(isInteractive && !isText);
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    const handlePointerEnter = () => {
      setIsVisible(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        // Hide custom cursor during keyboard navigation
        setIsVisible(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    document.documentElement.addEventListener("mouseenter", handlePointerEnter);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.classList.remove("console-cursor-active");
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      document.documentElement.removeEventListener("mouseenter", handlePointerEnter);
      window.removeEventListener("keydown", handleKeyDown);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[99999] transition-opacity duration-150 ${
        isVisible && !isTextInput ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-100px, -100px, 0)",
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      {/* Precision reticle centered precisely at (0, 0) */}
      <div className="relative -top-[9px] -left-[9px] w-[18px] h-[18px] flex items-center justify-center">
        {/* Reticle Corner Brackets */}
        <div
          className={`absolute inset-0 transition-transform duration-100 ease-out ${
            isHovered ? "scale-110" : "scale-90"
          }`}
        >
          {/* Top-Left */}
          <span
            className={`absolute top-0 left-0 w-1.5 h-1.5 border-t border-l transition-colors duration-100 ${
              isHovered
                ? "border-accent-emerald shadow-[0_0_4px_var(--accent-emerald)]"
                : "border-accent-cyan/70"
            }`}
          />
          {/* Top-Right */}
          <span
            className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r transition-colors duration-100 ${
              isHovered
                ? "border-accent-emerald shadow-[0_0_4px_var(--accent-emerald)]"
                : "border-accent-cyan/70"
            }`}
          />
          {/* Bottom-Left */}
          <span
            className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l transition-colors duration-100 ${
              isHovered
                ? "border-accent-emerald shadow-[0_0_4px_var(--accent-emerald)]"
                : "border-accent-cyan/70"
            }`}
          />
          {/* Bottom-Right */}
          <span
            className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r transition-colors duration-100 ${
              isHovered
                ? "border-accent-emerald shadow-[0_0_4px_var(--accent-emerald)]"
                : "border-accent-cyan/70"
            }`}
          />
        </div>

        {/* Central Precision Pinpoint Dot */}
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-100 ${
            isHovered
              ? "bg-[#32D74B] shadow-[0_0_6px_#32D74B] scale-110"
              : "bg-accent-cyan shadow-[0_0_4px_var(--accent-cyan)]"
          }`}
        />
      </div>
    </div>
  );
}
