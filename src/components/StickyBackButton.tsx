"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { scrollToSection } from "@/utils/scrollHelper";

interface StickyBackButtonProps {
  href: string;
  label: string;
}

export default function StickyBackButton({ href, label }: StickyBackButtonProps) {
  const [isFixed, setIsFixed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFixed(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      const targetId = href.replace(/^.*#/, "");
      scrollToSection(targetId);
    }
  };

  return (
    <>
      {/* Inline Sentinel & Top Bar Button */}
      <div ref={sentinelRef} className="inline-block">
        <Link
          href={href}
          onClick={handleClick}
          className="inline-flex items-center gap-2 font-mono text-xs text-accent-cyan font-bold hover:underline group cursor-pointer self-start focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan rounded"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>{label}</span>
        </Link>
      </div>

      {/* Floating Fixed Back Button when top inline position scrolls out of view */}
      {isFixed && (
        <div className="fixed top-20 left-4 sm:left-8 lg:left-16 z-30 transition-all duration-300">
          <Link
            href={href}
            onClick={handleClick}
            className="inline-flex items-center gap-2 font-mono text-xs text-accent-cyan font-bold bg-bg-secondary/95 backdrop-blur-md px-3.5 py-2 rounded-md border border-border-muted hover:border-accent-cyan hover:bg-bg-tertiary shadow-lg group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>{label}</span>
          </Link>
        </div>
      )}
    </>
  );
}
