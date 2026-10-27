"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

export default function ConsoleCursor() {
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Mutable state references for continuous tracking without effect recreation
  const posRef = useRef({ x: -100, y: -100 });
  const isVisibleRef = useRef(false);
  const isTextInputRef = useRef(false);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Strict capability check: Fine pointer (mouse/trackpad) and hover capability required
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointerQuery.matches || reducedMotionQuery.matches) {
      return;
    }

    setMounted(true);

    const updateCursorDOM = () => {
      const el = cursorRef.current;
      if (!el) return;

      // Position directly using viewport-relative coordinates
      el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;

      // Visible only when pointer is in viewport and not inside an editable text area
      const shouldShow = isVisibleRef.current && !isTextInputRef.current;
      el.style.opacity = shouldShow ? "1" : "0";

      // CRITICAL: Only suppress native cursor while custom cursor is active and actively visible
      if (shouldShow) {
        document.documentElement.classList.add("console-cursor-active");
      } else {
        document.documentElement.classList.remove("console-cursor-active");
      }

      // Interactive hover feedback styling
      if (reticleRef.current && dotRef.current) {
        if (isHoveredRef.current) {
          reticleRef.current.classList.add("is-hovered");
          dotRef.current.classList.add("is-hovered");
        } else {
          reticleRef.current.classList.remove("is-hovered");
          dotRef.current.classList.remove("is-hovered");
        }
      }
    };

    const checkTarget = (target: HTMLElement) => {
      const tagName = target.tagName ? target.tagName.toLowerCase() : "";
      const isText =
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target.isContentEditable ||
        target.getAttribute("role") === "textbox" ||
        target.closest("input, textarea, select, [contenteditable], [role='textbox']") !== null;

      isTextInputRef.current = Boolean(isText);

      const isInteractive = Boolean(
        target.closest(
          "a, button, [role='button'], input[type='submit'], input[type='button'], summary, .cursor-pointer"
        )
      );

      isHoveredRef.current = isInteractive && !isText;
    };

    const showCursorAt = (x: number, y: number, target: HTMLElement | null) => {
      posRef.current = { x, y };
      isVisibleRef.current = true;

      if (target) {
        checkTarget(target);
      }

      updateCursorDOM();
    };

    const hideCursor = () => {
      isVisibleRef.current = false;
      updateCursorDOM();
    };

    // Pointer movement: updates position immediately on every valid event
    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      if ("pointerType" in e && e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") {
        return;
      }
      showCursorAt(e.clientX, e.clientY, e.target as HTMLElement | null);
    };

    // Pointer leaves the browser window/viewport (e.g. crossing to second monitor or OS interface)
    const handleMouseLeave = (e: MouseEvent) => {
      const targetElement = (e as unknown as { toElement?: Element }).toElement;
      if (!e.relatedTarget && !targetElement) {
        hideCursor();
      }
    };

    // Window blur: switching applications, Alt+Tab, or clicking onto a second monitor
    const handleBlur = () => {
      hideCursor();
    };

    // Tab visibility change: switching browser tabs
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hideCursor();
      }
    };

    // Keyboard navigation: hide during Tab focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        hideCursor();
      }
    };

    // Scroll listener: update hover state under stationary cursor
    const handleScroll = () => {
      if (isVisibleRef.current && posRef.current.x >= 0 && posRef.current.y >= 0) {
        const target = document.elementFromPoint(posRef.current.x, posRef.current.y) as HTMLElement | null;
        if (target) {
          checkTarget(target);
          updateCursorDOM();
        }
      }
    };

    // Attach listeners once on mount
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.documentElement.classList.remove("console-cursor-active");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!mounted) return null;

  const cursorContent = (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[999999] transition-opacity duration-100 opacity-0 will-change-transform"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
      }}
      aria-hidden="true"
    >
      {/* Precision reticle centered precisely at (0, 0) */}
      <div className="relative -top-[9px] -left-[9px] w-[18px] h-[18px] flex items-center justify-center pointer-events-none">
        {/* Reticle Corner Brackets */}
        <div
          ref={reticleRef}
          className="console-cursor-reticle absolute inset-0 pointer-events-none"
        >
          {/* Top-Left */}
          <span className="console-cursor-bracket absolute top-0 left-0 w-1.5 h-1.5 border-t border-l" />
          {/* Top-Right */}
          <span className="console-cursor-bracket absolute top-0 right-0 w-1.5 h-1.5 border-t border-r" />
          {/* Bottom-Left */}
          <span className="console-cursor-bracket absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l" />
          {/* Bottom-Right */}
          <span className="console-cursor-bracket absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r" />
        </div>

        {/* Central Precision Pinpoint Dot */}
        <div
          ref={dotRef}
          className="console-cursor-dot w-1.5 h-1.5 rounded-full pointer-events-none"
        />
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(cursorContent, document.body) : null;
}
