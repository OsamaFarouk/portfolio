"use client";

import React, { useState, useEffect, useRef } from "react";
import { experience, Experience as ExpType } from "@/utils/dataLoader";
import { Calendar, MapPin, Briefcase, ChevronDown, ChevronUp, Star } from "lucide-react";
import ConsoleSection from "@/components/ConsoleSection";
import SectionHeader from "@/components/SectionHeader";
import { cancelCurrentScroll } from "@/utils/scrollHelper";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const getStickyNavbarOffset = (): number => {
  if (typeof document === "undefined") return 80;
  const headerEl = document.querySelector("header");
  const height = headerEl ? headerEl.getBoundingClientRect().height : 64;
  return height + 16;
};

export default function Experience() {
  // Collapse current role by default on mobile screens (< 768px), expand on desktop (>= 768px)
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);

  // References to each experience card container element
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Store layout compensation metadata across state transitions
  const pendingActionRef = useRef<{
    targetId: string;
    isExpanding: boolean;
    prevTop: number;
    collapseDelta: number;
  } | null>(null);

  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setExpandedId(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelCurrentScroll();
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  const toggleExpand = (id: string) => {
    // Immediately halt any in-flight section or smooth scroll to prevent position contamination
    cancelCurrentScroll();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: window.scrollY, behavior: "auto" });
    }
    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }

    const isExpanding = expandedId !== id;
    const targetEl = cardRefs.current.get(id);
    const prevTop = targetEl ? targetEl.getBoundingClientRect().top : 0;

    let collapseDelta = 0;
    if (isExpanding && expandedId) {
      const prevIdx = experience.findIndex((e) => e.id === expandedId);
      const targetIdx = experience.findIndex((e) => e.id === id);
      if (prevIdx !== -1 && targetIdx !== -1 && prevIdx < targetIdx) {
        const prevDetailsEl = document.getElementById(`exp-details-${expandedId}`);
        if (prevDetailsEl) {
          collapseDelta = prevDetailsEl.offsetHeight;
        }
      }
    }

    pendingActionRef.current = {
      targetId: id,
      isExpanding,
      prevTop,
      collapseDelta,
    };

    setExpandedId((prev) => (prev === id ? null : id));
  };

  useIsomorphicLayoutEffect(() => {
    const action = pendingActionRef.current;
    if (!action) return;
    pendingActionRef.current = null;

    const targetEl = cardRefs.current.get(action.targetId);
    if (!targetEl) return;

    const navbarOffset = getStickyNavbarOffset();
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (action.isExpanding) {
      // 1. Synchronous layout compensation:
      // If collapsing another card above removed vertical height, compensate synchronously
      // before paint so the selected header stays visible and doesn't shoot off-screen.
      if (action.collapseDelta > 0) {
        window.scrollBy(0, -action.collapseDelta);
      }
      const compensatedTop = targetEl.getBoundingClientRect().top;

      // 2. Alignment check:
      // - If header is cut off by or above sticky navbar, smoothly align below navbar.
      // - If header was clicked near the bottom of viewport, smoothly align below navbar
      //   so the details expanding downward are immediately visible and readable.
      const isMobile = window.innerWidth < 768;
      const bottomThreshold = isMobile
        ? window.innerHeight * 0.55
        : window.innerHeight - 200;

      const isCutOffByNav = compensatedTop < navbarOffset;
      const isTooCloseToBottom = compensatedTop > bottomThreshold;

      if (isCutOffByNav || isTooCloseToBottom) {
        const delta = compensatedTop - navbarOffset;
        if (scrollRafRef.current !== null) {
          cancelAnimationFrame(scrollRafRef.current);
        }
        scrollRafRef.current = requestAnimationFrame(() => {
          scrollRafRef.current = null;
          window.scrollBy({
            top: delta,
            behavior: prefersReducedMotion ? "auto" : "smooth",
          });
        });
      }
    } else {
      // Collapsing current card:
      // If the header was scrolled above the sticky navbar, bring it back into view below navbar
      const currentTop = targetEl.getBoundingClientRect().top;
      if (currentTop < navbarOffset) {
        const delta = currentTop - navbarOffset;
        if (scrollRafRef.current !== null) {
          cancelAnimationFrame(scrollRafRef.current);
        }
        scrollRafRef.current = requestAnimationFrame(() => {
          scrollRafRef.current = null;
          window.scrollBy({
            top: delta,
            behavior: prefersReducedMotion ? "auto" : "smooth",
          });
        });
      }
    }
  }, [expandedId]);

  return (
    <ConsoleSection id="experience" className="py-12 border-t border-border-muted scroll-mt-16">
      <SectionHeader
        systemTag="// SYSTEM_HISTORY"
        title="Professional Experience"
        badge={
          <div className="font-mono text-[11px] text-text-secondary bg-bg-secondary px-3 py-1.5 rounded border border-border-muted self-start">
            TIMELINE_ENTRIES: 0{experience.length}
          </div>
        }
      />

      <div
        className="relative border-l border-border-color/30 ml-4 md:ml-6 space-y-6"
        style={{ overflowAnchor: "none" }}
      >
        {experience.map((exp: ExpType, _idx) => {
          const isExpanded = expandedId === exp.id;
          
          return (
            <div
              key={exp.id}
              ref={(el) => {
                if (el) cardRefs.current.set(exp.id, el);
                else cardRefs.current.delete(exp.id);
              }}
              data-stagger-item
              style={{ transitionDelay: `${Math.min(_idx * 45, 180)}ms` }}
              className="relative pl-8 md:pl-10 group"
            >
              {/* Timeline interactive circle */}
              <button
                type="button"
                onClick={() => toggleExpand(exp.id)}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${exp.role} at ${exp.company}`}
                aria-expanded={isExpanded}
                aria-controls={`exp-details-${exp.id}`}
                title={`${isExpanded ? "Collapse" : "Expand"} details`}
                className={`absolute -left-[9px] top-6 md:top-7 w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary before:absolute before:-inset-2.5 before:content-[''] ${
                  exp.current 
                    ? "bg-accent-emerald border-accent-emerald shadow-[0_0_11px_var(--accent-emerald-glow)]" 
                    : isExpanded
                      ? "bg-bg-primary border-accent-cyan shadow-[0_0_8px_var(--accent-cyan-glow)]"
                      : "bg-bg-primary border-border-color group-hover:border-accent-cyan hover:border-accent-cyan"
                }`}
              >
                {exp.current && <span className="w-1.5 h-1.5 rounded-full bg-bg-primary animate-ping"></span>}
              </button>

              {/* Card Container */}
              <div className={`bg-bg-secondary border rounded-lg transition-all duration-300 overflow-hidden ${
                isExpanded 
                  ? "border-accent-cyan shadow-[0_4px_20px_rgba(6,182,212,0.08)]" 
                  : "border-border-muted hover:border-border-color"
              }`}>
                {/* Expandable Header Button */}
                <button
                  type="button"
                  onClick={() => toggleExpand(exp.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`exp-details-${exp.id}`}
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${exp.role} at ${exp.company} details`}
                  className="w-full text-left select-none hover:bg-bg-tertiary/20 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-inset"
                >
                  {/* DESKTOP HEADER LAYOUT (>= 768px) - 100% UNCHANGED */}
                  <div className="hidden md:flex p-5 flex-row items-center justify-between gap-4 w-full">
                    <div className="flex items-start gap-5">
                      {exp.logo && (
                        <div className="w-35 h-10 rounded-lg bg-white border border-border-muted flex items-center justify-center p-0.5 shrink-0 shadow-sm overflow-hidden mt-1.5">
                          <img
                            src={exp.logo}
                            alt={`${exp.company} Logo`}
                            width={140}
                            height={40}
                            loading="lazy"
                            decoding="async"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                            {exp.role}
                          </span>
                          {exp.current && (
                            <span className="px-2 py-0.5 rounded-full bg-accent-emerald-glow/10 border border-accent-emerald/60 font-mono text-[11px] text-accent-emerald font-bold animate-pulse">
                              CURRENT
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-bg-tertiary border border-border-muted font-mono text-[11px] text-text-secondary">
                            {exp.employmentType}
                          </span>
                        </div>

                        <div className="text-sm font-semibold text-text-secondary flex flex-wrap items-center gap-2">
                          <span>{exp.company}</span>
                          {exp.project && (
                            <>
                              <span className="text-text-secondary/40">|</span>
                              <span className="text-accent-cyan font-mono text-xs">{exp.project}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-6 font-mono text-xs text-text-secondary">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-accent-cyan" />
                          <span>{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-accent-cyan" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                      <div>
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-accent-cyan" />
                        ) : (
                          <ChevronDown size={16} className="text-text-secondary hover:text-accent-cyan" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* MOBILE HEADER LAYOUT (< 768px) - CLEAN VERTICAL HIERARCHY (FULL WIDTH) */}
                  <div className="flex md:hidden p-4 flex-col gap-2.5 relative w-full">
                    {/* 1. Company Logo */}
                    {exp.logo && (
                      <div className="w-35 h-10 rounded-lg bg-white border border-border-muted flex items-center justify-center p-0.5 shrink-0 shadow-sm overflow-hidden mb-0.5">
                        <img
                          src={exp.logo}
                          alt={`${exp.company} Logo`}
                          width={140}
                          height={40}
                          loading="lazy"
                          decoding="async"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}

                    {/* 2. Job Title */}
                    <div className="text-lg font-bold text-text-primary group-hover:text-accent-cyan transition-colors leading-snug w-full">
                      {exp.role}
                    </div>

                    {/* 3. Status / Employment Type */}
                    <div className="flex flex-wrap items-center gap-2 w-full">
                      {exp.current && (
                        <span className="px-2 py-0.5 rounded-full bg-accent-emerald-glow/10 border border-accent-emerald/60 font-mono text-[11px] text-accent-emerald font-bold animate-pulse">
                          CURRENT
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-bg-tertiary border border-border-muted font-mono text-[11px] text-text-secondary">
                        {exp.employmentType}
                      </span>
                    </div>

                    {/* 4. Company | Project / Client */}
                    {exp.id === "iti-internship" ? (
                      <div className="text-sm font-semibold text-text-secondary flex flex-col gap-0.5 w-full">
                        <span>{exp.company}</span>
                        {exp.project && (
                          <span className="text-accent-cyan font-mono text-xs">
                            {exp.project}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-text-secondary flex items-start gap-1.5 flex-wrap w-full">
                        <span className="shrink-0">{exp.company}</span>
                        {exp.project && (
                          <>
                            <span className="text-text-secondary/40 shrink-0">|</span>
                            <span className="text-accent-cyan font-mono text-xs flex-1 min-w-0">
                              {exp.project}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* 5. Date */}
                    <div className="flex items-center gap-1.5 font-mono text-xs text-text-secondary w-full">
                      <Calendar size={12} className="text-accent-cyan shrink-0" />
                      <span>{exp.startDate} – {exp.endDate}</span>
                    </div>

                    {/* 6. Location */}
                    <div className="flex items-center gap-1.5 font-mono text-xs text-text-secondary pr-7 w-full">
                      <MapPin size={12} className="text-accent-cyan shrink-0" />
                      <span>{exp.location}</span>
                    </div>

                    {/* 7. Expand / Collapse Arrow (Bottom Right) */}
                    <div className="absolute right-3.5 bottom-3.5">
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-accent-cyan" />
                      ) : (
                        <ChevronDown size={16} className="text-text-secondary hover:text-accent-cyan" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Collapsible Content (100% UNCHANGED) */}
                {isExpanded && (
                  <div
                    id={`exp-details-${exp.id}`}
                    role="region"
                    aria-label={`${exp.role} at ${exp.company} details`}
                    className="px-5 pb-5 border-t border-border-muted bg-bg-secondary/60 space-y-6 animate-fadeIn"
                  >
                    {/* Summary */}
                    <p className="text-text-secondary text-sm pt-4 italic">
                      {exp.summary}
                    </p>

                    {/* Responsibilities */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase size={12} />
                        <span>Core Responsibilities</span>
                      </h4>
                      <ul className="list-none space-y-2 pl-1.5">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i} className="text-sm text-text-primary flex items-start gap-2.5">
                            <span className="text-accent-cyan font-mono mt-0.5">&gt;</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Achievements */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-xs text-accent-emerald uppercase tracking-wider flex items-center gap-1.5">
                        <Star size={12} />
                        <span>KEY CONTRIBUTIONS</span>
                      </h4>
                      <ul className="list-none space-y-2 pl-1.5">
                        {exp.achievements.map((ach, i) => (
                          <li key={i} className="text-sm text-text-primary flex items-start gap-2.5">
                            <span className="text-accent-emerald font-mono mt-0.5">✔</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stack Used */}
                    <div className="space-y-2 border-t border-border-muted pt-4">
                      <h4 className="font-mono text-xs text-text-secondary uppercase tracking-wider">
                        {"// Deployment Stack"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span 
                            key={tech} 
                            className="px-2.5 py-1 rounded bg-bg-tertiary border border-border-muted font-mono text-[11px] text-text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ConsoleSection>
  );
}
