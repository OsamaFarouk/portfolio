"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  getResumeProfile,
  getResumeExperience,
  getResumeSkills,
  getResumeCertifications,
  getResumeEducation,
  getResumeCourses,
  getResumeAwards,
  getResumeVolunteering,
  getResumeLanguages,
} from "@/utils/dataLoader";
import { ArrowLeft, Printer, Download, Mail, Phone, MapPin, Award as AwardIcon, BookOpen } from "lucide-react";
import { Github, Linkedin } from "@/components/SocialIcons";
import { ThemeProvider } from "@/components/ThemeContext";

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState("all");

  const resumeProfile = getResumeProfile();
  const resumeExperience = getResumeExperience();
  const resumeSkills = getResumeSkills();
  const resumeCertifications = getResumeCertifications();
  const resumeEducation = getResumeEducation();
  const resumeCourses = getResumeCourses();
  const resumeAwards = getResumeAwards();
  const resumeVolunteering = getResumeVolunteering();
  const resumeLanguages = getResumeLanguages();

  const printResume = () => {
    window.print();
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg-primary text-text-primary py-8 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:text-black print:py-0 print:px-0">
        {/* Navigation Action Header - Hidden during print */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-cyan hover:underline hover:shadow-[0_0_11px_rgba(6,182,212,0.2)]"
          >
            <ArrowLeft size={14} />
            <span>RETURN_TO_CONSOLE</span>
          </Link>

          <div className="flex gap-3">
            <button
              onClick={printResume}
              className="px-4 py-2 rounded bg-bg-secondary border border-border-muted font-mono text-xs text-text-primary hover:border-accent-cyan hover:text-accent-cyan transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>PRINT_RECORD</span>
            </button>
            <a
              href="/resume/Osama_Farouk_DevOps_Resume.pdf"
              download="Osama_Farouk_DevOps_Resume.pdf"
              className="px-4 py-2 rounded bg-accent-cyan text-bg-primary font-mono text-xs font-bold hover:bg-accent-cyan/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>DOWNLOAD_PDF</span>
            </a>
          </div>
        </div>

        {/* Print-Ready Resume Container */}
        <article className="max-w-4xl mx-auto bg-bg-secondary border border-border-muted rounded-lg shadow-xl p-8 sm:p-12 print:shadow-none print:border-none print:p-0 print:bg-white print:text-black">
          {/* Resume Header */}
          <header className="border-b border-border-muted pb-6 mb-8 print:border-black/20 print:pb-4 print:mb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary print:text-black">
                  {resumeProfile.name}
                </h1>
                <p className="text-lg font-mono text-accent-cyan font-semibold mt-1 print:text-black/80">
                  {resumeProfile.title}
                </p>
              </div>

              {/* Contact specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 font-mono text-xs text-text-secondary print:text-black/90">
                {resumeProfile.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-accent-cyan print:text-black" />
                    <a href={`mailto:${resumeProfile.email}`} className="hover:underline">
                      {resumeProfile.email}
                    </a>
                  </div>
                )}
                {resumeProfile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-accent-cyan print:text-black" />
                    <a href={`tel:${resumeProfile.phone}`} className="hover:underline">
                      {resumeProfile.phone}
                    </a>
                  </div>
                )}
                {resumeProfile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-accent-cyan print:text-black" />
                    <span>{resumeProfile.location}</span>
                  </div>
                )}
                {resumeProfile.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin size={12} className="text-accent-cyan print:text-black" />
                    <a
                      href={resumeProfile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      linkedin.com/in/{resumeProfile.linkedin.split("/").filter(Boolean).pop()}
                    </a>
                  </div>
                )}
                {resumeProfile.github && (
                  <div className="flex items-center gap-2">
                    <Github size={12} className="text-accent-cyan print:text-black" />
                    <a
                      href={resumeProfile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      github.com/{resumeProfile.github.split("/").filter(Boolean).pop()}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Navigation tabs - Hidden during print */}
          <div className="flex flex-wrap gap-2 border-b border-border-muted pb-4 mb-6 font-mono text-[11px] print:hidden">
            {[
              { id: "all", label: "Full Resume" },
              { id: "experience", label: "Experience" },
              { id: "skills", label: "Technical Stack" },
              { id: "education", label: "Education & Certs" },
              { id: "courses", label: "Courses & Awards" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded transition-all font-bold uppercase cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-bg-tertiary border border-accent-cyan text-accent-cyan"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Summary */}
          {activeTab === "all" && (
            <section className="mb-8 print:mb-6 print:break-inside-avoid">
              <h2 className="text-sm font-mono text-accent-cyan uppercase tracking-wider mb-3 print:text-black print:font-bold print:border-b print:border-black/20 print:pb-1">
                Professional Profile
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed print:text-black print:text-xs">
                {resumeProfile.summary}
              </p>
            </section>
          )}

          {/* Work History */}
          {(activeTab === "all" || activeTab === "experience") && (
            <section className="mb-8 print:mb-6">
              <h2 className="text-sm font-mono text-accent-cyan uppercase tracking-wider mb-4 print:text-black print:font-bold print:border-b print:border-black/20 print:pb-1">
                Professional Experience
              </h2>
              <div className="space-y-6 print:space-y-4">
                {resumeExperience.map((exp) => (
                  <div key={exp.id} className="group print:break-inside-avoid">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                      <h3 className="text-base font-bold text-text-primary print:text-black print:text-sm">
                        {exp.role}{" "}
                        <span className="font-normal text-text-secondary text-sm print:text-black/80">
                          at {exp.company}
                        </span>
                        {exp.current && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-accent-emerald-glow/20 border border-accent-emerald/60 font-mono text-[11px] text-accent-emerald font-bold print:border-black/30 print:text-black">
                            PRESENT
                          </span>
                        )}
                      </h3>
                      <span className="font-mono text-xs text-text-secondary print:text-black/70 print:text-[11px]">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>

                    {exp.project && (
                      <div className="font-mono text-xs text-accent-cyan mb-2 print:text-black/80 print:text-[11px] font-semibold">
                        Project Node: {exp.project}
                      </div>
                    )}

                    {exp.summary && (
                      <p className="text-xs text-text-secondary mb-2.5 italic print:text-black/90">
                        {exp.summary}
                      </p>
                    )}

                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc pl-5 text-xs text-text-secondary space-y-1 print:text-black print:space-y-0.5">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-2.5 pl-4 border-l-2 border-accent-emerald/40 py-0.5 print:border-black/20">
                        <span className="block font-mono text-[11px] text-accent-emerald uppercase font-bold mb-1 print:text-black/90">
                          Key Results:
                        </span>
                        <ul className="list-circle pl-4 text-xs text-text-secondary space-y-0.5 print:text-black">
                          {exp.achievements.map((ach, i) => (
                            <li key={i} className="text-text-primary print:text-black">
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="mt-2.5 font-mono text-[11px] text-text-secondary print:text-black/80 font-medium">
                        STACK: {exp.technologies.join(" | ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Stack & Skills */}
          {(activeTab === "all" || activeTab === "skills") && (
            <section className="mb-8 print:mb-6 print:break-inside-avoid">
              <h2 className="text-sm font-mono text-accent-cyan uppercase tracking-wider mb-4 print:text-black print:font-bold print:border-b print:border-black/20 print:pb-1">
                Core Tech Stack
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
                {resumeSkills.map((cat) => (
                  <div
                    key={cat.category}
                    className="bg-bg-tertiary/20 border border-border-muted p-4 rounded print:border-black/10 print:bg-white print:p-2"
                  >
                    <h3 className="font-mono text-xs font-bold text-text-primary mb-1.5 print:text-black">
                      {cat.category}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed print:text-black print:text-[11px]">
                      {cat.skills.map((s) => s.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education & Certs */}
          {(activeTab === "all" || activeTab === "education") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:gap-6 print:mb-6 print:break-inside-avoid">
              {/* Education */}
              {resumeEducation.length > 0 && (
                <section>
                  <h2 className="text-sm font-mono text-accent-cyan uppercase tracking-wider mb-4 print:text-black print:font-bold print:border-b print:border-black/20 print:pb-1">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {resumeEducation.map((deg) => (
                      <div key={deg.id}>
                        <h3 className="text-sm font-bold text-text-primary print:text-black">
                          {deg.degree}
                        </h3>
                        <p className="text-xs text-text-secondary print:text-black/80 font-medium">
                          {deg.institution}
                        </p>
                        <p className="font-mono text-[11px] text-text-secondary mt-0.5 print:text-black/70">
                          {deg.period} | {deg.location}
                        </p>
                        {deg.details && deg.details.length > 0 && (
                          <ul className="list-disc pl-4 text-[11px] text-text-secondary mt-2 space-y-1 print:text-black">
                            {deg.details.map((detail, idx) => (
                              <li key={idx}>{detail}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {resumeCertifications.length > 0 && (
                <section>
                  <h2 className="text-sm font-mono text-accent-cyan uppercase tracking-wider mb-4 print:text-black print:font-bold print:border-b print:border-black/20 print:pb-1">
                    Certifications
                  </h2>
                  <ul className="space-y-2.5 font-mono text-xs text-text-secondary print:text-black">
                    {resumeCertifications.map((cert) => (
                      <li
                        key={cert.id}
                        className="flex flex-col border-b border-border-muted/30 pb-2 print:border-black/10"
                      >
                        <span className="font-bold text-text-primary print:text-black">
                          {cert.name}
                        </span>
                        <span className="text-[11px] text-text-secondary/80 print:text-black/70">
                          {cert.issuer} {cert.code ? `(${cert.code})` : ""} | Issued: {cert.issueDate}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* Courses & Awards */}
          {(activeTab === "all" || activeTab === "courses") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-6 print:break-inside-avoid">
              {/* Professional Courses */}
              {resumeCourses.length > 0 && (
                <section>
                  <h2 className="text-sm font-mono text-accent-cyan uppercase tracking-wider mb-4 print:text-black print:font-bold print:border-b print:border-black/20 print:pb-1 flex items-center gap-1.5">
                    <BookOpen size={14} className="print:hidden" />
                    <span>Professional Courses ({resumeCourses.length})</span>
                  </h2>
                  <ul className="space-y-2 font-mono text-xs text-text-secondary print:text-black">
                    {resumeCourses.slice(0, 8).map((course) => (
                      <li key={course.id} className="flex justify-between items-baseline gap-2 border-b border-border-muted/20 pb-1.5 print:border-black/10">
                        <span className="font-medium text-text-primary print:text-black truncate">{course.title}</span>
                        <span className="text-[11px] text-text-secondary/70 print:text-black/60 shrink-0">{course.provider} · {course.year}</span>
                      </li>
                    ))}
                  </ul>
                  {resumeCourses.length > 8 && (
                    <Link
                      href="/courses"
                      className="inline-block mt-3 font-mono text-[11px] text-accent-cyan hover:underline print:hidden"
                    >
                      VIEW ALL {resumeCourses.length} COURSES →
                    </Link>
                  )}
                </section>
              )}

              {/* Honors & Awards */}
              {resumeAwards.length > 0 && (
                <section>
                  <h2 className="text-sm font-mono text-accent-cyan uppercase tracking-wider mb-4 print:text-black print:font-bold print:border-b print:border-black/20 print:pb-1 flex items-center gap-1.5">
                    <AwardIcon size={14} className="print:hidden" />
                    <span>Honors & Awards</span>
                  </h2>
                  <div className="space-y-3">
                    {resumeAwards.map((award, idx) => (
                      <div key={idx} className="border-b border-border-muted/30 pb-2 print:border-black/10">
                        <h3 className="text-xs font-bold text-text-primary print:text-black">
                          {award.name}
                        </h3>
                        <p className="font-mono text-[11px] text-text-secondary print:text-black/70">
                          {award.organization} · {award.year}
                        </p>
                        <p className="text-[11px] text-text-secondary mt-1 print:text-black/80">
                          {award.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Volunteering & Languages */}
          {(resumeVolunteering.length > 0 || resumeLanguages.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 print:gap-6 print:mt-6 print:break-inside-avoid">
              {resumeVolunteering.length > 0 && (
                <section>
                  <h2 className="text-sm font-mono text-accent-cyan uppercase tracking-wider mb-3 print:text-black print:font-bold print:border-b print:border-black/20 print:pb-1">
                    Volunteering
                  </h2>
                  <div className="space-y-3">
                    {resumeVolunteering.map((v, i) => (
                      <div key={i}>
                        <h3 className="text-xs font-bold text-text-primary print:text-black">{v.role}</h3>
                        <p className="font-mono text-[11px] text-text-secondary print:text-black/70">{v.organization} | {v.period}</p>
                        <p className="text-[11px] text-text-secondary mt-1 print:text-black">{v.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {resumeLanguages.length > 0 && (
                <section>
                  <h2 className="text-sm font-mono text-accent-cyan uppercase tracking-wider mb-3 print:text-black print:font-bold print:border-b print:border-black/20 print:pb-1">
                    Languages
                  </h2>
                  <ul className="space-y-1.5 font-mono text-xs text-text-secondary print:text-black">
                    {resumeLanguages.map((l, i) => (
                      <li key={i} className="flex justify-between border-b border-border-muted/20 pb-1 print:border-black/10">
                        <span className="font-bold text-text-primary print:text-black">{l.language}</span>
                        <span className="text-text-secondary print:text-black/70">{l.proficiency}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </article>
      </div>
    </ThemeProvider>
  );
}
