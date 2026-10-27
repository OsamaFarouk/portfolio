"use client";

import React from "react";

interface SectionHeaderProps {
  systemTag: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  systemTag,
  title,
  subtitle,
  badge,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8 ${className}`}
    >
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider shrink-0">
            {systemTag}
          </h2>
          {/* Subtle terminal-inspired console accent line */}
          <span
            className="section-accent-line h-[1px] bg-gradient-to-r from-accent-cyan/80 via-accent-cyan/40 to-transparent block w-10 sm:w-24"
            aria-hidden="true"
          />
        </div>
        <h3 className="text-2xl font-bold tracking-tight mt-1">{title}</h3>
        {subtitle && (
          <p className="font-mono text-xs text-text-secondary mt-1">{subtitle}</p>
        )}
      </div>
      {badge && badge}
    </div>
  );
}
