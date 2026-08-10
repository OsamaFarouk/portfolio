"use client";

let activeAnimationId: number | null = null;
let activeInterruptionListeners: (() => void) | null = null;

const easeInOutCubic = (progress: number): number =>
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

export interface ScrollToSectionOptions {
  duration?: number; // Controlled duration (~1000ms)
  offsetExtra?: number; // Visual gap below navbar (default 16px)
  updateHash?: boolean; // Update URL hash (default true)
}

export const cancelCurrentScroll = () => {
  if (activeAnimationId !== null) {
    cancelAnimationFrame(activeAnimationId);
    activeAnimationId = null;
  }
  if (activeInterruptionListeners) {
    activeInterruptionListeners();
    activeInterruptionListeners = null;
  }
};

export const scrollToSection = (
  sectionId: string,
  options: ScrollToSectionOptions = {}
): boolean => {
  if (typeof window === "undefined") return false;

  const targetId = sectionId.replace(/^#/, "").replace(/^\//, "").replace(/^#/, "") || "home";
  const targetEl = document.getElementById(targetId);

  if (!targetEl) return false;

  // Check accessibility preference (prefers-reduced-motion)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Dynamically measure sticky header height
  const headerEl = document.querySelector("header");
  const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 64;
  const extraOffset = options.offsetExtra ?? 16;
  const totalOffset = headerHeight + extraOffset;

  // Calculate target position
  const targetRect = targetEl.getBoundingClientRect();
  const startY = window.scrollY;
  const targetY = Math.max(0, startY + targetRect.top - totalOffset);
  const distance = targetY - startY;

  // Reduced motion fallback: jump directly to offset position
  if (prefersReducedMotion) {
    cancelCurrentScroll();
    window.scrollTo({ top: targetY });
    if (options.updateHash !== false) {
      window.history.pushState(null, "", `#${targetId}`);
    }
    return true;
  }

  // Cancel any existing active scroll animation
  cancelCurrentScroll();

  const duration = options.duration ?? 1000; // 1000ms controlled duration
  let startTime: number | null = null;

  // User Interruption Handling (mouse wheel, touch drag, keyboard navigation)
  const handleUserInterruption = (e: Event) => {
    if (e.type === "keydown") {
      const key = (e as KeyboardEvent).key;
      if (["Shift", "Control", "Alt", "Meta", "Tab"].includes(key)) return;
    }
    cancelCurrentScroll();
  };

  const interruptionEvents = ["wheel", "touchstart", "keydown"];
  const attachInterruptionListeners = () => {
    interruptionEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserInterruption, { passive: true, once: true });
    });
  };

  const removeInterruptionListeners = () => {
    interruptionEvents.forEach((evt) => {
      window.removeEventListener(evt, handleUserInterruption);
    });
  };

  activeInterruptionListeners = removeInterruptionListeners;
  attachInterruptionListeners();

  const step = (currentTime: number) => {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    const currentY = startY + distance * easedProgress;
    window.scrollTo(0, Math.max(0, currentY));

    if (elapsed < duration) {
      activeAnimationId = requestAnimationFrame(step);
    } else {
      // Completed animation cleanly
      cancelCurrentScroll();
      if (options.updateHash !== false) {
        window.history.pushState(null, "", `#${targetId}`);
      }
    }
  };

  activeAnimationId = requestAnimationFrame(step);
  return true;
};
