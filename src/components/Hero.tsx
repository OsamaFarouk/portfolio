"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { profile, portfolioStats, socialLinks } from "@/utils/dataLoader";
import { Download, Mail, FileText, MapPin, Clock, Calendar, ChevronRight, ChevronDown, GitBranch, Cpu, Cloud, Box, Activity } from "lucide-react";
import { Github, Linkedin } from "@/components/SocialIcons";

export default function Hero() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const roles = profile.roles.filter((r) => r && r.trim() !== "");

  useEffect(() => {
    if (roles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section id="home" className="pt-4 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Profile Card & Info - Left (4 Cols) */}
      <div className="lg:col-span-4 bg-bg-secondary border border-border-color rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(6,182,212,0.05)]">
        {/* Console Header Bar */}
        <div className="bg-bg-tertiary px-4 py-2 border-b border-border-color flex items-center justify-between font-mono text-[11px] text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-pulse"></span>
            <span>SYSTEM_NODE: ONLINE</span>
          </div>
          <span>ID: OS-DEVOPS</span>
        </div>

        {/* Photo Container */}
        <div className="p-6 flex flex-col items-center text-center">
          <div className="relative w-40 h-40 rounded-full p-1 border-2 border-dashed border-accent-cyan/40 hover:border-accent-cyan transition-all duration-500 mb-4 group">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-bg-primary">
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                priority
                sizes="(max-width: 768px) 160px, 160px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            {/* Status badge */}
            <span className="absolute bottom-2 right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-emerald"></span>
            </span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-text-primary mb-1">{profile.name}</h1>
          
          {/* Rotating Role Cycling Effect */}
          {roles.length > 0 && (
            <div className="h-6 overflow-hidden mb-4">
              <p className="text-sm font-mono text-accent-cyan font-semibold transition-all duration-300">
                &gt; {roles[currentRoleIndex]}
              </p>
            </div>
          )}

          {/* Two Short Status Indicators */}
          <div className="flex flex-wrap gap-2.5 justify-center mb-6 max-w-sm mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald-glow/10 border border-accent-emerald/70 font-mono text-[11px] leading-none tracking-wide text-accent-emerald font-semibold whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
              <span>Open to Selected Roles</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald-glow/10 border border-accent-emerald/70 font-mono text-[11px] leading-none tracking-wide text-accent-emerald font-semibold whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
              <span>Freelance Consulting Available</span>
            </div>
          </div>

          {/* Quick Contact Specs */}
          <div className="w-full space-y-3 font-mono text-xs text-text-secondary border-t border-border-muted pt-6 text-left">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-accent-cyan" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-accent-cyan" />
              <span>{profile.timezone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-accent-cyan" />
              <span>Experience: {portfolioStats.yearsOfExperience}+ Years</span>
            </div>
          </div>

          {/* Social icons with custom Tooltips */}
          <div className="flex gap-4 mt-6 border-t border-border-muted pt-6 w-full justify-center">
            {/* Email */}
            <a
              href={`mailto:${socialLinks.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-bg-tertiary border border-border-muted hover:border-accent-cyan hover:text-accent-cyan transition-all relative group"
              title="Send Email"
              aria-label="Send Email"
            >
              <Mail size={16} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 border border-slate-700 text-slate-200 text-[9px] font-mono py-1 px-2 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                Send Email
              </span>
            </a>

            {/* LinkedIn */}
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-bg-tertiary border border-border-muted hover:border-accent-cyan hover:text-accent-cyan transition-all relative group"
              title="Visit LinkedIn"
              aria-label="Visit LinkedIn"
            >
              <Linkedin size={16} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 border border-slate-700 text-slate-200 text-[9px] font-mono py-1 px-2 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                Visit LinkedIn
              </span>
            </a>

            {/* GitHub */}
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-bg-tertiary border border-border-muted hover:border-accent-cyan hover:text-accent-cyan transition-all relative group"
              title="Visit GitHub"
              aria-label="Visit GitHub"
            >
              <Github size={16} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 border border-slate-700 text-slate-200 text-[9px] font-mono py-1 px-2 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                Visit GitHub
              </span>
            </a>

            {/* Resume PDF (Replaces phone call link) */}
            <a
              href="/resume/Osama_Farouk_DevOps_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-bg-tertiary border border-border-muted hover:border-accent-cyan hover:text-accent-cyan transition-all relative group"
              title="View Resume"
              aria-label="View Resume"
            >
              <FileText size={16} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 border border-slate-700 text-slate-200 text-[9px] font-mono py-1 px-2 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                View Resume
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Terminal Overview & Statistics - Right (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Main Console Board */}
        <div className="bg-bg-secondary border border-border-color rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(6,182,212,0.05)] p-6">
          <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-2">{"// PROFESSIONAL_SUMMARY"}</h2>
          <p className="text-text-primary text-base leading-relaxed mb-6">{profile.summary}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 font-mono">
            {/* Stat 1: YEARS_EXPERIENCE -> Experience */}
            <a
              href="/#experience"
              aria-label="View professional experience"
              className="bg-bg-tertiary border border-border-muted rounded p-3 flex flex-col justify-between group hover:border-accent-cyan hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:-translate-y-1 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
            >
              <div className="flex flex-col">
                <span className="text-[11px] text-text-secondary uppercase">YEARS_EXPERIENCE</span>
                <span className="text-2xl font-bold text-accent-cyan mt-1">{portfolioStats.yearsOfExperience}+</span>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-text-secondary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all duration-200 text-xs">
                  →
                </span>
              </div>
            </a>

            {/* Stat 2: CERTIFICATIONS -> Certifications */}
            <a
              href="/#certifications"
              aria-label="View certifications"
              className="bg-bg-tertiary border border-border-muted rounded p-3 flex flex-col justify-between group hover:border-accent-cyan hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:-translate-y-1 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
            >
              <div className="flex flex-col">
                <span className="text-[11px] text-text-secondary uppercase">CERTIFICATIONS</span>
                <span className="text-2xl font-bold text-accent-emerald mt-1">{portfolioStats.totalCertifications}</span>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-text-secondary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all duration-200 text-xs">
                  →
                </span>
              </div>
            </a>

            {/* Stat 3: PROJECTS -> Projects */}
            <a
              href="/#projects"
              aria-label="View projects"
              className="bg-bg-tertiary border border-border-muted rounded p-3 flex flex-col justify-between group hover:border-accent-cyan hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:-translate-y-1 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
            >
              <div className="flex flex-col">
                <span className="text-[11px] text-text-secondary uppercase">PROJECTS</span>
                <span className="text-2xl font-bold text-accent-orange mt-1">{portfolioStats.totalProjects}</span>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-text-secondary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all duration-200 text-xs">
                  →
                </span>
              </div>
            </a>

            {/* Stat 4: ORGANIZATIONS -> Experience */}
            <a
              href="/#experience"
              aria-label="View organizations and work experience"
              className="bg-bg-tertiary border border-border-muted rounded p-3 flex flex-col justify-between group hover:border-accent-cyan hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:-translate-y-1 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
            >
              <div className="flex flex-col">
                <span className="text-[11px] text-text-secondary uppercase">ORGANIZATIONS</span>
                <span className="text-2xl font-bold text-text-primary mt-1">{portfolioStats.totalEmployers}</span>
              </div>
              <div className="flex justify-end mt-1">
        <span className="text-text-secondary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all duration-200 text-xs">
                  →
                </span>
              </div>
            </a>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 mt-8 pt-6 border-t border-border-muted">
            <a
              href="#contact"
              className="px-5 py-2.5 rounded bg-accent-cyan text-bg-primary font-mono text-xs font-bold hover:bg-accent-cyan/95 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-1.5"
            >
              <span>CONTACT ME</span>
              <ChevronRight size={14} />
            </a>
            <a
              href="#projects"
              className="px-5 py-2.5 rounded bg-bg-tertiary border border-border-muted font-mono text-xs text-text-primary hover:border-accent-cyan hover:text-accent-cyan transition-all flex items-center justify-center"
            >
              VIEW PROJECTS
            </a>
            <div className="w-full sm:w-auto flex justify-center">
              <a
                href="/resume/Osama_Farouk_DevOps_Resume.pdf"
                download="Osama_Farouk_DevOps_Resume.pdf"
                className="px-5 py-2.5 rounded border font-bold bg-accent-emerald-glow/5 font-mono text-xs text-accent-emerald hover:bg-accent-emerald-glow/20 hover:border-accent-emerald transition-all flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                <span>DOWNLOAD RESUME</span>
              </a>
            </div>
          </div>
        </div>

        {/* Real-time Cluster Node Visualizer Grid */}
        <div className="bg-bg-secondary border border-border-muted rounded-lg p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:text-left gap-1.5 sm:gap-4 mb-6">
            <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider">{"// PLATFORM_DELIVERY_LIFECYCLE"}</h2>
            <span className="font-mono text-[11px] text-emerald-100 dark:text-accent-emerald font-bold animate-pulse">● PIPELINE_ONLINE: 05/05</span>
          </div>

          {/* 5-Column Responsive Grid Layout (Prevents Overflow) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 py-2">
            {/* Stage 1 */}
            <div className="bg-bg-tertiary border border-border-muted hover:border-accent-cyan hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] rounded-lg p-3 sm:p-4 transition-all duration-300 relative group flex flex-col justify-between min-h-0 sm:min-h-[145px]">
              <div className="absolute top-2 right-3 font-mono text-[11px] text-cyan-700 dark:text-accent-cyan/99 group-hover:text-accent-cyan font-bold transition-colors">
                01/PLAN
              </div>
              <div className="mt-0.5 sm:mt-2">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 rounded bg-bg-primary text-accent-cyan border border-border-muted group-hover:border-accent-cyan/30 transition-colors">
                    <GitBranch size={14} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-bold text-[11px] tracking-wider text-slate-800 dark:text-slate-100 uppercase group-hover:text-accent-cyan transition-colors">PLAN & COLLAB</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-auto">
                {["Git", "GitHub", "GitLab"].map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-bg-secondary border border-border-muted font-mono text-[9px] text-slate-700 dark:text-slate-300 font-bold">
                    {tech}
                  </span>
                ))}
              </div>
              {/* Subtle Right Arrow Connector (Desktop) */}
              <div className="hidden lg:flex absolute -right-[18px] top-1/2 -translate-y-1/2 z-10 text-cyan-600/60 group-hover:text-accent-cyan/80 transition-colors pointer-events-none">
                <ChevronRight size={18} />
              </div>
              {/* Subtle Down Arrow Connector (Mobile 1-Column) */}
              <div className="flex sm:hidden absolute left-1/2 -translate-x-1/2 -bottom-[12px] z-10 text-cyan-600/40 group-hover:text-accent-cyan/80 transition-colors pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
 
            {/* Stage 2 */}
            <div className="bg-bg-tertiary border border-border-muted hover:border-accent-emerald hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] rounded-lg p-3 sm:p-4 transition-all duration-300 relative group flex flex-col justify-between min-h-0 sm:min-h-[145px]">
              <div className="absolute top-2 right-3 font-mono text-[11px] text-emerald-700 dark:text-accent-emerald/99 group-hover:text-accent-emerald font-bold transition-colors">
                02/BUILD
              </div>
              <div className="mt-0.5 sm:mt-2">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 rounded bg-bg-primary text-accent-emerald border border-border-muted group-hover:border-accent-emerald/30 transition-colors">
                    <Cpu size={14} className="group-hover:rotate-12 transition-transform" />
                  </div>
                  <span className="font-bold text-[11px] tracking-wider text-slate-800 dark:text-slate-100 uppercase group-hover:text-accent-emerald transition-colors">BUILD & VALIDATE</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-auto">
                {["Jenkins", "GitLab CI", "SonarQube"].map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-bg-secondary border border-border-muted font-mono text-[9px] text-slate-700 dark:text-slate-300 font-bold">
                    {tech}
                  </span>
                ))}
              </div>
              {/* Subtle Right Arrow Connector (Desktop) */}
              <div className="hidden lg:flex absolute -right-[18px] top-1/2 -translate-y-1/2 z-10 text-emerald-600/40 group-hover:text-accent-emerald/80 transition-colors pointer-events-none">
                <ChevronRight size={18} />
              </div>
              {/* Subtle Down Arrow Connector (Mobile 1-Column) */}
              <div className="flex sm:hidden absolute left-1/2 -translate-x-1/2 -bottom-[12px] z-10 text-emerald-600/40 group-hover:text-accent-emerald/80 transition-colors pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
 
            {/* Stage 3 */}
            <div className="bg-bg-tertiary border border-border-muted hover:border-accent-orange hover:shadow-[0_0_15px_rgba(249,115,22,0.1)] rounded-lg p-3 sm:p-4 transition-all duration-300 relative group flex flex-col justify-between min-h-0 sm:min-h-[145px]">
              <div className="absolute top-2 right-3 font-mono text-[11px] text-orange-700 dark:text-accent-orange/99 group-hover:text-accent-orange font-bold transition-colors">
                03/INFRA
              </div>
              <div className="mt-0.5 sm:mt-2">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 rounded bg-bg-primary text-accent-orange border border-border-muted group-hover:border-accent-orange/30 transition-colors">
                    <Cloud size={14} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-bold text-[11px] tracking-wider text-slate-800 dark:text-slate-100 uppercase group-hover:text-accent-orange transition-colors">PROVISION & CONF</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-auto">
                {["Terraform", "Ansible", "Bash"].map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-bg-secondary border border-border-muted font-mono text-[9px] text-slate-700 dark:text-slate-300 font-bold">
                    {tech}
                  </span>
                ))}
              </div>
              {/* Subtle Right Arrow Connector (Desktop) */}
              <div className="hidden lg:flex absolute -right-[18px] top-1/2 -translate-y-1/2 z-10 text-orange-600/40 group-hover:text-accent-orange/80 transition-colors pointer-events-none">
                <ChevronRight size={18} />
              </div>
              {/* Subtle Down Arrow Connector (Mobile 1-Column) */}
              <div className="flex sm:hidden absolute left-1/2 -translate-x-1/2 -bottom-[12px] z-10 text-orange-600/40 group-hover:text-accent-orange/80 transition-colors pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
 
            {/* Stage 4 */}
            <div className="bg-bg-tertiary border border-border-muted hover:border-accent-cyan hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] rounded-lg p-3 sm:p-4 transition-all duration-300 relative group flex flex-col justify-between min-h-0 sm:min-h-[145px]">
              <div className="absolute top-2 right-3 font-mono text-[11px] text-cyan-700 dark:text-accent-cyan/99 group-hover:text-accent-cyan font-bold transition-colors">
                04/DEPLOY
              </div>
              <div className="mt-0.5 sm:mt-2">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 rounded bg-bg-primary text-accent-cyan border border-border-muted group-hover:border-accent-cyan/30 transition-colors">
                    <Box size={14} className="group-hover:rotate-12 transition-transform" />
                  </div>
                  <span className="font-bold text-[11px] tracking-wider text-slate-800 dark:text-slate-100 uppercase group-hover:text-accent-cyan transition-colors">PACKAGE & DEPLOY</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-auto">
                {["Docker", "Helm", "Kubernetes"].map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-bg-secondary border border-border-muted font-mono text-[9px] text-slate-700 dark:text-slate-300 font-bold">
                    {tech}
                  </span>
                ))}
              </div>
              {/* Subtle Right Arrow Connector (Desktop) */}
              <div className="hidden lg:flex absolute -right-[18px] top-1/2 -translate-y-1/2 z-10 text-cyan-600/40 group-hover:text-accent-cyan/80 transition-colors pointer-events-none">
                <ChevronRight size={18} />
              </div>
              {/* Subtle Down Arrow Connector (Mobile 1-Column) */}
              <div className="flex sm:hidden absolute left-1/2 -translate-x-1/2 -bottom-[12px] z-10 text-cyan-600/40 group-hover:text-accent-cyan/80 transition-colors pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>

            {/* Stage 5 */}
            <div className="bg-bg-tertiary border border-accent-cyan/30 rounded-lg p-3 sm:p-4 transition-all duration-300 relative group flex flex-col justify-between min-h-0 sm:min-h-[145px] pipeline-glow-cyan">
              <div className="absolute top-2 right-3 font-mono text-[11px] text-accent-cyan/99 font-bold">
                05/MONITOR
              </div>
              <div className="mt-0.5 sm:mt-2">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 rounded bg-bg-primary text-accent-cyan border border-accent-cyan/30">
                    <Activity size={14} className="animate-pulse" />
                  </div>
                  <span className="font-bold text-[11px] tracking-wider text-accent-cyan uppercase">OPERATE & OBSERVE</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-auto">
                {["Prometheus", "Grafana", "ELK"].map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-bg-secondary border border-accent-cyan/20 font-mono text-[9px] text-accent-cyan font-bold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
