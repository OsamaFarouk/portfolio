"use client";

import React from "react";
import { skills, SkillCategory, portfolioStats } from "@/utils/dataLoader";
import { Wrench, ShieldCheck } from "lucide-react";

export default function Skills() {
  // Get color depending on proficiency level
  const getProficiencyStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case "expert":
        return {
          bg: "bg-accent-emerald-glow/5 border-accent-emerald/30",
          text: "text-accent-emerald",
          indicator: "bg-accent-emerald",
        };
      case "advanced":
        return {
          bg: "bg-accent-cyan-glow/5 border-accent-cyan/30",
          text: "text-accent-cyan",
          indicator: "bg-accent-cyan",
        };
      default: // Intermediate / Beginner
        return {
          bg: "bg-accent-orange-glow/5 border-accent-orange/30",
          text: "text-accent-orange",
          indicator: "bg-accent-orange",
        };
    }
  };

  return (
    <section id="skills" className="py-12 border-t border-border-muted scroll-mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider">{"// SYSTEM_STACK"}</h2>
          <h3 className="text-2xl font-bold tracking-tight mt-1">Skills & Technologies</h3>
        </div>
        <div className="font-mono text-[11px] text-text-secondary bg-bg-secondary px-3 py-1.5 rounded border border-border-muted self-start flex items-center gap-2">
          <Wrench size={10} />
          <span>INVENTORY_TOTAL: {portfolioStats.totalSkillsCount} SKILLS LOADED</span>
        </div>
      </div>

      {/* Legend / Key */}
      <div className="flex flex-wrap gap-4 mb-6 font-mono text-[11px] text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-orange"></span>
          <span>INTERMEDIATE (1-2 YRS) - PRACTICAL EXPERIENCE</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-cyan"></span>
          <span>ADVANCED (2+ YRS) - EXTENSIVE HANDS-ON EXPERIENCE</span>
        </span>
        
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((cat: SkillCategory) => (
          <div 
            key={cat.category}
            className="bg-bg-secondary border border-border-muted rounded-lg overflow-hidden flex flex-col justify-between"
          >
            {/* Header */}
            <div className="bg-bg-tertiary px-4 py-2.5 border-b border-border-muted flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-text-primary tracking-wide">
                {cat.category}
              </span>
              <span className="font-mono text-[9px] text-text-secondary">
                NODES: {cat.skills.length}
              </span>
            </div>

            {/* List */}
            <div className="p-4 space-y-3 flex-1">
              {cat.skills.map((skill) => {
                const style = getProficiencyStyle(skill.proficiency);
                return (
                  <div 
                    key={skill.name}
                    className={`flex items-center justify-between p-2 rounded border font-mono text-xs transition-colors duration-150 hover:bg-bg-primary/30 ${style.bg}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${style.indicator}`}></span>
                      <span className="text-text-primary font-semibold">{skill.name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      {skill.certified && (skill.certifications || skill.certification) ? (
                        <div className="flex items-center gap-1.5">
                          {(skill.certifications || (skill.certification ? [skill.certification] : [])).map((cert) => (
                            <a
                              key={cert.targetId}
                              href={`/#${cert.targetId}`}
                              onClick={(e) => e.stopPropagation()}
                              title="View certification"
                              aria-label={`View ${cert.fullName} certification`}
                              className="px-2 py-0.5 rounded bg-accent-emerald-glow/20 border border-accent-emerald/80 text-accent-emerald hover:border-accent-cyan hover:text-accent-cyan hover:bg-accent-cyan/10 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer font-bold text-[11px] flex items-center gap-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
                            >
                              <ShieldCheck size={12} className="shrink-0" />
                              <span>{cert.shortName}</span>
                            </a>
                          ))}
                        </div>
                      ) : skill.certified ? (
                        <span 
                          className="px-2 py-0.5 rounded bg-accent-emerald-glow/20 border border-accent-emerald/80 text-accent-emerald font-bold text-[11px] flex items-center gap-1" 
                          title={`Professional Certification: ${skill.certBadge || "Certified"}`}
                        >
                          <ShieldCheck size={12} className="text-accent-emerald" />
                          <span>{skill.certBadge || "CERT"}</span>
                        </span>
                      ) : null}
                      <span className={style.text}>{skill.proficiency}</span>
                      <span className="text-text-secondary/50">|</span>
                      <span className="text-text-secondary">{skill.years} Y</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
