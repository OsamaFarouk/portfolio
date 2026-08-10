import React from "react";
import Link from "next/link";
import { allProjects } from "@/utils/dataLoader";
import { ArrowLeft, Calendar, User, Landmark, ExternalLink, Cpu, Lightbulb, AlertTriangle } from "lucide-react";
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
          <div className="py-20 text-center space-y-4">
            <h1 className="text-2xl font-mono text-accent-red font-bold">PROJECT_NOT_FOUND</h1>
            <p className="text-text-secondary text-sm">Requested project slug &apos;{slug}&apos; does not exist in dataset.</p>
            <Link href="/#projects" className="inline-block font-mono text-xs text-accent-cyan underline">
              &larr; BACK_TO_INVENTORY
            </Link>
          </div>
        </Layout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Layout>
        <div className="py-8 space-y-8 max-w-5xl mx-auto">
          {/* Top Bar Navigation & Actions */}
          <div className="flex items-center justify-between border-b border-border-muted pb-6">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-xs text-accent-cyan font-bold hover:underline group"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span>BACK_TO_PROJECTS</span>
            </Link>

            <div className="font-mono text-xs text-text-secondary flex items-center gap-2">
              <span className="text-text-secondary/70">TYPE:</span>
              <span className="text-accent-cyan font-semibold">{project.type}</span>
            </div>
          </div>

          {/* Project Title Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
                {project.type}
              </span>
              <span className="font-mono text-xs text-text-secondary bg-bg-secondary px-2.5 py-0.5 rounded border border-border-muted">
                {project.date}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              {project.title}
            </h1>

            <p className="text-base text-text-secondary leading-relaxed max-w-3xl">
              {project.tagline}
            </p>

            {/* Meta stats bar */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border-muted/50 font-mono text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <User size={14} className="text-accent-cyan" />
                <span>ROLE: <strong className="text-text-primary">{project.role}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Landmark size={14} className="text-accent-cyan" />
                <span>ORGANIZATION: <strong className="text-text-primary">{project.employer || "Personal"}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-accent-cyan" />
                <span>PERIOD: <strong className="text-text-primary">{project.date}</strong></span>
              </div>
            </div>
          </header>

          {/* Dynamic Architecture Diagram (Mermaid) */}
          {project.architecture && (
            <section className="bg-bg-secondary border border-border-muted rounded-lg p-6">
              <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-4">{"// ARCHITECTURE_TOPOLOGY"}</h2>
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
                <h2 className="font-mono text-xs text-accent-emerald uppercase tracking-wider mb-3">{"// Key_OUTCOMES"}</h2>
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
                <h2 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-3">{"// RESPONSIBILITIES"}</h2>
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
                <h2 className="text-[11px] text-text-secondary uppercase tracking-wider mb-4">{"// TECHNOLOGY_STACK"}</h2>
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
