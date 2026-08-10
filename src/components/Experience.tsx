"use client";

import React, { useState } from "react";
import { experience, Experience as ExpType } from "@/utils/dataLoader";
import { Calendar, MapPin, Briefcase, ChevronDown, ChevronUp, Star } from "lucide-react";

export default function Experience() {
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="experience" className="py-12 border-t border-border-muted scroll-mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider">// SYSTEM_HISTORY</h2>
          <h3 className="text-2xl font-bold tracking-tight mt-1">Professional Experience</h3>
        </div>
        <div className="font-mono text-[11px] text-text-secondary bg-bg-secondary px-3 py-1.5 rounded border border-border-muted self-start">
          TIMELINE_ENTRIES: 0{experience.length}
        </div>
      </div>

      <div className="relative border-l border-border-color/30 ml-4 md:ml-6 space-y-6">
        {experience.map((exp: ExpType, idx) => {
          const isExpanded = expandedId === exp.id;
          
          return (
            <div key={exp.id} className="relative pl-8 md:pl-10 group">
              {/* Timeline dot */}
              <div 
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  exp.current 
                    ? "bg-accent-emerald border-accent-emerald shadow-[0_0_11px_var(--accent-emerald-glow)]" 
                    : "bg-bg-primary border-border-color group-hover:border-accent-cyan"
                }`}
              >
                {exp.current && <span className="w-1.5 h-1.5 rounded-full bg-bg-primary animate-ping"></span>}
              </div>

              {/* Card Container */}
              <div className={`bg-bg-secondary border rounded-lg transition-all duration-300 overflow-hidden ${
                isExpanded 
                  ? "border-accent-cyan shadow-[0_4px_20px_rgba(6,182,212,0.08)]" 
                  : "border-border-muted hover:border-border-color"
              }`}>
                {/* Expandable Header */}
                <button
                  onClick={() => toggleExpand(exp.id)}
                  className="w-full p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-bg-tertiary/20 transition-all duration-200"
                >
                  <div className="flex items-start gap-5">
                    {exp.logo && (
                      <div className="w-35 h-10 rounded-lg bg-white border border-border-muted flex items-center justify-center p-0.5 shrink-0 shadow-sm overflow-hidden mt-1.5">
                        <img
                          src={exp.logo}
                          alt={`${exp.company} Logo`}
                          loading="lazy"
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

                <div className="flex items-center justify-between md:justify-end gap-6 font-mono text-xs text-text-secondary">
                    <div className="flex flex-col md:items-end gap-1">
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
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-border-muted bg-bg-secondary/60 space-y-6 animate-fadeIn">
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
                        // Deployment Stack
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
    </section>
  );
}
