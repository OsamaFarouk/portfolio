"use client";

import React from "react";
import Link from "next/link";
import { education, courses } from "@/utils/dataLoader";
import { GraduationCap, BookOpen, Calendar, MapPin, Trophy, ArrowRight } from "lucide-react";

export default function Education() {
  const { degrees, awards } = education;

  return (
    <section id="education" className="py-12 border-t border-border-muted scroll-mt-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider">// ACADEMIC_RECORD</h2>
          <h3 className="text-2xl font-bold tracking-tight mt-1">Education &amp; Training</h3>
          <p className="font-mono text-xs text-text-secondary mt-1">
            Academic qualifications, specialized technical courses, and engineering honors.
          </p>
        </div>
        <div className="font-mono text-[11px] text-text-secondary bg-bg-secondary px-3 py-1.5 rounded border border-border-muted self-start flex items-center gap-1.5">
          <GraduationCap size={14} className="text-accent-cyan" />
          <span>DEGREE: BACHELOR OF ENGINEERING</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Degree & Honors - Left (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Degree */}
          {degrees.map((deg) => (
            <div key={deg.id} className="bg-bg-secondary border border-border-color rounded-lg p-6 hover:border-accent-cyan transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-bg-tertiary border border-border-muted text-accent-cyan shrink-0 mt-1">
                  <GraduationCap size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[11px] text-accent-cyan uppercase tracking-wider block">BACHELOR’S DEGREE</span>
                  <h4 className="font-mono text-base font-bold text-text-primary mt-0.5">{deg.degree}</h4>
                  <p className="text-xs text-text-secondary mt-1 font-medium">{deg.institution}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 font-mono text-[11px] text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-accent-cyan" />
                      {deg.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-accent-cyan" />
                      {deg.location}
                    </span>
                  </div>

                  {deg.details && deg.details.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border-muted space-y-2">
                      {deg.details.map((detail, idx) => (
                        <p key={idx} className="text-xs text-text-secondary leading-relaxed flex items-start gap-2">
                          <span className="text-accent-cyan font-bold">•</span>
                          <span>{detail}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Awards & Honors */}
          {awards && awards.length > 0 && (
            <div className="bg-bg-secondary border border-border-color rounded-lg p-6 hover:border-[#32D74B] transition-colors">
              <h4 className="font-mono text-xs text-[#32D74B] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Trophy size={14} />
                <span>// HONORS_AND_AWARDS</span>
              </h4>

              <div className="space-y-4">
                {awards.map((award, idx) => (
                  <div key={idx} className="bg-bg-tertiary/60 border border-border-muted rounded-md p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-mono text-xs font-bold text-text-primary">{award.name}</h5>
                      <span className="font-mono text-[11px] text-[#32D74B] bg-[#32D74B]/10 px-2 py-0.5 rounded border border-[#32D74B]/30 shrink-0">
                        {award.year}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-accent-cyan">{award.organization}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{award.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Technical Courses & Training - Right (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-bg-secondary border border-border-color rounded-lg p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider flex items-center gap-2">
                  <BookOpen size={14} />
                  <span>{"// PROFESSIONAL_COURSES"} ({courses.length})</span>
                </h4>
              </div>

              <div className="space-y-3">
                {courses.slice(0, 5).map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses#${course.id}`}
                    aria-label={`Open ${course.title} course details`}
                    className="bg-bg-tertiary/60 border border-border-muted rounded p-3.5 flex items-start justify-between gap-3 hover:border-accent-cyan hover:bg-bg-tertiary transition-all cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan block"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-xs font-bold text-text-primary group-hover:text-accent-cyan transition-colors block leading-snug break-words">
                        {course.title}
                      </span>
                      <span className="font-mono text-[11px] text-text-secondary block mt-1">
                        {course.provider}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded border border-accent-cyan/20 shrink-0 mt-0.5">
                      {course.year}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border-muted">
              <Link
                href="/courses"
                className="w-full py-2.5 px-4 rounded bg-bg-tertiary border border-border-muted hover:border-accent-cyan text-accent-cyan font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>VIEW ALL {courses.length} COURSES</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
