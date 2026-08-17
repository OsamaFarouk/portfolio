"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { projects, Project } from "@/utils/dataLoader";
import { Search, SlidersHorizontal, ArrowRight, Cpu, Cloud, Box, GitBranch } from "lucide-react";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filterOptions = [
    { label: "All Projects", id: "ALL" },
    { label: "Professional", id: "PROFESSIONAL" },
    { label: "Personal Labs", id: "PERSONAL" },
    { label: "Training Projects", id: "TRAINING" },
    { label: "AWS / Cloud", id: "AWS" },
    { label: "Kubernetes", id: "KUBERNETES" },
    { label: "CI/CD", id: "CI/CD" },
    { label: "Observability", id: "OBSERVABILITY" },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Search Query Match
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Filter Match
      if (activeFilter === "ALL") return true;
      if (activeFilter === "PROFESSIONAL") return project.type === "Professional Work";
      if (activeFilter === "PERSONAL") {
        return (project.type === "Personal Lab" || project.type === "Personal / Training Project") && 
          !project.employer?.includes("ITI") && 
          !project.employer?.includes("ALX");
      }
      if (activeFilter === "TRAINING") {
        return project.type === "Scholarship Project" || 
          (project.employer?.includes("ITI") || false) || 
          (project.employer?.includes("ALX") || false);
      }
      
      // Tag-based filtering
      const tagsLower = project.tags.map(t => t.toLowerCase());
      if (activeFilter === "AWS") {
        return tagsLower.some(t => t.includes("aws") || t.includes("cloud") || t.includes("load balancing"));
      }
      if (activeFilter === "KUBERNETES") {
        return tagsLower.some(t => t.includes("kubernetes") || t.includes("helm") || t.includes("k8s"));
      }
      if (activeFilter === "CI/CD") {
        return tagsLower.some(t => t.includes("ci/cd") || t.includes("jenkins") || t.includes("gitlab") || t.includes("pipeline"));
      }
      if (activeFilter === "OBSERVABILITY") {
        return tagsLower.some(t => t.includes("observability") || t.includes("prometheus") || t.includes("grafana") || t.includes("loki"));
      }
      return false;
    });
  }, [searchQuery, activeFilter]);

  const getProjectClassification = (project: Project) => {
    if (project.type === "Professional Work") {
      return project.confidential ? "PROFESSIONAL · SANITIZED" : "PROFESSIONAL";
    }
    if (project.employer?.includes("ITI") || project.employer?.includes("Information Technology Institute")) {
      return "TRAINING PROJECT · ITI";
    }
    if (project.employer?.includes("ALX")) {
      return "TRAINING PROJECT · ALX";
    }
    return "PERSONAL LAB";
  };

  const getClassificationStyles = (classification: string) => {
    if (classification.startsWith("PROFESSIONAL")) {
      return "text-accent-orange bg-accent-orange-glow/10 border-accent-orange/30";
    }
    if (classification.includes("ITI")) {
      return "text-accent-emerald bg-accent-emerald-glow/10 border-accent-emerald/30";
    }
    if (classification.includes("ALX")) {
      return "text-indigo-400 bg-indigo-500/10 border-indigo-500/30";
    }
    return "text-accent-cyan bg-accent-cyan-glow/10 border-accent-cyan/30";
  };

  const getCategoryIcon = (project: Project) => {
    const tagsLower = project.tags.map(t => t.toLowerCase());
    if (tagsLower.includes("kubernetes") || tagsLower.includes("helm") || tagsLower.includes("k8s")) {
      return Box;
    }
    if (tagsLower.includes("aws") || tagsLower.includes("cloud")) {
      return Cloud;
    }
    if (tagsLower.includes("jenkins") || tagsLower.includes("gitlab ci") || tagsLower.includes("ci/cd")) {
      return GitBranch;
    }
    return Cpu;
  };

  return (
    <section id="projects" className="py-12 border-t border-border-muted scroll-mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider">// PROJECT_INVENTORY</h2>
          <h3 className="text-2xl font-bold tracking-tight mt-1">Projects & Labs</h3>
        </div>
        <div className="font-mono text-[11px] text-text-secondary bg-bg-secondary px-3 py-1.5 rounded border border-border-muted self-start">
          INVENTORY_NODES: {filteredProjects.length} / {projects.length} MATCHED
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="space-y-4 mb-8 font-mono">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-text-secondary h-4 w-4" />
            <input
              type="text"
              placeholder="Query project inventory by title, technology, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary border border-border-muted rounded text-xs text-text-primary focus:outline-none focus:border-accent-cyan transition-colors placeholder:text-text-secondary/50"
            />
          </div>

          {/* Label indicating filtering action */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-text-secondary uppercase">
            <SlidersHorizontal size={12} />
            <span>Filters:</span>
          </div>
        </div>

        {/* Filter tags buttons - Horizontally scrollable on mobile */}
        <div className="flex overflow-x-auto pb-2 flex-nowrap md:flex-wrap gap-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`px-3 py-1.5 rounded text-[11px] uppercase font-bold tracking-wider transition-all duration-200 border shrink-0 ${
                activeFilter === opt.id
                  ? "bg-accent-cyan-glow/10 border-accent-cyan text-accent-cyan shadow-[0_0_11px_rgba(6,182,212,0.2)]"
                  : "bg-bg-secondary border-border-muted text-text-secondary hover:border-text-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project: Project) => {
            const Classification = getProjectClassification(project);
            const classStyles = getClassificationStyles(Classification);
            const IconComponent = getCategoryIcon(project);

            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={`flex flex-col bg-bg-secondary border rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent-cyan/80 hover:shadow-[0_4px_25px_rgba(6,182,212,0.08)] group focus-within:ring-2 focus-within:ring-accent-cyan focus-within:ring-offset-2 focus-within:ring-offset-bg-primary outline-none ${
                  project.featured ? "border-accent-cyan/60" : "border-border-muted"
                }`}
              >
                {/* Card Console Header */}
                <div className="bg-bg-tertiary px-4 py-2 border-b border-border-muted flex items-center justify-between font-mono text-[11px] text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <IconComponent size={12} className="text-accent-cyan group-hover:scale-110 transition-transform duration-200" />
                    <span>NODE_ID: {project.slug.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold border px-1.5 py-0.5 rounded ${classStyles}`}>
                      {Classification}
                    </span>
                    <span>{project.date}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="text-base font-bold text-text-primary group-hover:text-accent-cyan transition-colors duration-200">
                        {project.title}
                      </h4>
                    </div>
                    <p className="text-xs text-text-secondary font-mono mb-4">{project.tagline}</p>
                    {/* Summary outcome / results */}
                    <div className="bg-bg-primary/40 border border-border-muted/30 rounded p-3 mb-4 text-xs">
                      <span className="font-mono text-[11.5px] text-accent-cyan font-bold block mb-1.5">OUTCOME_METRICS:</span>
                      <ul className="space-y-1 text-text-secondary leading-relaxed font-mono text-[11.5px] list-none">
                        {project.results.map((res, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-accent-cyan shrink-0">•</span>
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer and tags */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-bg-tertiary border border-border-muted/50 font-mono text-[11px] text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border-muted/50 font-mono text-xs">
                      <span className="text-[11px] text-text-secondary">
                        ROLE: {project.role.toUpperCase()}
                      </span>
                      <div className="text-accent-cyan group-hover:text-accent-cyan/85 flex items-center gap-1 font-bold">
                        <span>INSPECT_CASE</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border-muted rounded-lg font-mono text-xs text-text-secondary">
          No records match active filters in the deployment database.
        </div>
      )}
    </section>
  );
}




