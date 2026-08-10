import React from "react";
import Link from "next/link";
import { allProjects, Project } from "@/utils/dataLoader";
import { ArrowLeft, Calendar, User, Briefcase, Landmark, ExternalLink, Cpu, Lightbulb, AlertTriangle, ShieldCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/components/ThemeContext";
import Mermaid from "@/components/Mermaid";
import { Github } from "@/components/SocialIcons";

// Generate static parameters for static site generation support
export async function generateStaticParams() {
  return allProjects.map((p) => ({
    slug: p.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <ThemeProvider>
        <Layout>
          <div className="max-w-xl mx-auto py-16 text-center font-mono border border-dashed border-accent-orange/40 rounded-lg p-8">
            <AlertTriangle className="mx-auto text-accent-orange h-10 w-10 mb-4 animate-bounce" />
            <h1 className="text-lg font-bold text-accent-orange">NODE_NOT_FOUND: 404</h1>
            <p className="text-xs text-text-secondary mt-2">Requested project container could not be found in inventory.</p>
            <Link href="/" className="inline-block mt-6 px-4 py-2 bg-bg-secondary border border-border-muted rounded text-xs text-text-primary hover:border-accent-cyan hover:text-accent-cyan">
              RETURN_TO_CONSOLE
            </Link>
          </div>
        </Layout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back link */}
          <Link 
            href="/#projects" 
            className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-cyan hover:underline print:hidden"
          >
            <ArrowLeft size={14} />
            <span>RETURN_TO_PROJECT_INVENTORY</span>
          </Link>

          {/* Project header card */}
          <header className="bg-bg-secondary border border-border-color rounded-lg p-6 sm:p-8 shadow-[0_4px_25px_rgba(6,182,212,0.06)] relative overflow-hidden">
            {/* Status node glow */}
            <div className="absolute top-0 right-0 bg-bg-tertiary border-l border-b border-border-color px-4 py-2 font-mono text-[10px] text-text-secondary uppercase">
              STATUS: {project.status}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-bg-tertiary border border-border-muted font-mono text-[10px] text-text-secondary">
                  {project.type}
                </span>
                {project.confidential && (
                  <span className="px-2 py-0.5 rounded bg-accent-orange-glow/10 border border-accent-orange/30 font-mono text-[10px] text-accent-orange font-bold">
                    CONFIDENTIAL / SANITIZED
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                {project.title}
              </h1>
              
              <p className="text-sm font-mono text-accent-cyan font-semibold">
                &gt; {project.tagline}
              </p>

              {/* Quick specs grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs text-text-secondary border-t border-border-muted pt-6 mt-6">
                <div>
                  <span className="block text-[11px] uppercase text-text-secondary/50">PERIOD</span>
                  <div className="flex items-center gap-1.5 mt-1 text-text-primary">
                    <Calendar size={12} className="text-accent-cyan" />
                    <span>{project.date}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] uppercase text-text-secondary/50">ROLE</span>
                  <div className="flex items-center gap-1.5 mt-1 text-text-primary">
                    <User size={12} className="text-accent-cyan" />
                    <span>{project.role}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] uppercase text-text-secondary/50">EMPLOYER</span>
                  <div className="flex items-center gap-1.5 mt-1 text-text-primary">
                    <Landmark size={12} className="text-accent-cyan" />
                    <span>{project.employer || "Personal Task"}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] uppercase text-text-secondary/50">ENVIRONMENTS</span>
                  {project.environments && project.environments.length > 0 ? (
                    project.environments.map((env, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 mt-1 text-accent-emerald">
                        <ShieldCheck size={12} />
                        <span>{env}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-1.5 mt-1 text-accent-emerald">
                      <ShieldCheck size={12} />
                      <span>PRODUCTION / STAGING</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Architecture Diagram (Mermaid) */}
          {project.architecture && (
            <section className="bg-bg-secondary border border-border-muted rounded-lg p-6">
              <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-4">// ARCHITECTURE_TOPOLOGY</h2>
              <Mermaid chart={project.architecture} />
            </section>
          )}

          {/* Details sections */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Core details - Left (8 Cols) */}
            <div className="md:col-span-8 space-y-6">
              {/* Background */}
              <div className="bg-bg-secondary border border-border-muted rounded-lg p-6">
                <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Cpu size={12} />
                  <span>Problem Statement & Context</span>
                </h2>
                <p className="text-sm text-text-primary leading-relaxed">{project.background}</p>
              </div>

              {/* Solution */}
              <div className="bg-bg-secondary border border-border-muted rounded-lg p-6">
                <h2 className="font-mono text-xs text-accent-emerald uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Lightbulb size={12} />
                  <span>Solution & Delivery Approach</span>
                </h2>
                <p className="text-sm text-text-primary leading-relaxed">{project.solution}</p>
              </div>

              {/* Challenges */}
              <div className="bg-bg-secondary border border-border-muted rounded-lg p-6">
                <h2 className="font-mono text-xs text-accent-orange uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle size={12} />
                  <span>Engineering Challenges & Resolution</span>
                </h2>
                <p className="text-sm text-text-primary leading-relaxed">{project.challenges}</p>
              </div>
            </div>

            {/* Side specifications - Right (4 Cols) */}
            <div className="md:col-span-4 space-y-6">
              {/* Outcomes */}
              <div className="bg-bg-secondary border border-border-color rounded-lg p-6 shadow-[0_4px_15px_rgba(16,185,129,0.03)]">
                <h2 className="font-mono text-xs text-accent-emerald uppercase tracking-wider mb-3">// Key_OUTCOMES</h2>
                <ul className="space-y-2 font-mono text-[11px] text-text-primary bg-bg-primary/50 border border-border-muted rounded p-4 list-none">
                  {project.results.map((res, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-accent-emerald shrink-0">✓</span>
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsibilities list */}
              <div className="bg-bg-secondary border border-border-muted rounded-lg p-6">
                <h2 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-3">// RESPONSIBILITIES</h2>
                <ul className="list-none space-y-2.5 font-mono text-[11px] text-text-secondary">
                  {project.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-accent-cyan">&gt;</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stack & Links */}
              <div className="bg-bg-secondary border border-border-muted rounded-lg p-6 font-mono text-xs">
                <h2 className="text-[11px] text-text-secondary uppercase tracking-wider mb-4">// TECHNOLOGY_STACK</h2>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-0.5 rounded bg-bg-tertiary border border-border-muted text-[11px] text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* External links */}
                <div className="space-y-3 pt-4 border-t border-border-muted">
                  {project.githubLink && project.githubLink !== "[ADD GITHUB URL]" ? (
                    <a 
                      href={project.githubLink}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded bg-bg-tertiary border border-border-muted hover:border-accent-cyan hover:text-accent-cyan flex items-center justify-center gap-1.5 transition-all text-[11px]"
                    >
                      <Github size={12} />
                      <span>CLONE_REPOSITORY</span>
                    </a>
                  ) : (
                    <div className="w-full py-2 rounded bg-bg-tertiary/20 border border-border-muted/40 text-text-secondary/40 flex items-center justify-center gap-1.5 text-[11px] cursor-not-allowed">
                      <Github size={12} />
                      <span>SOURCE: CONFIDENTIAL</span>
                    </div>
                  )}

                  {project.liveLink && (
                    <a 
                      href={project.liveLink}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded bg-accent-cyan text-bg-primary hover:bg-accent-cyan/95 flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold"
                    >
                      <ExternalLink size={12} />
                      <span>LAUNCH_DEPLOYMENT</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
}
