"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeContext";
import Layout from "@/components/Layout";
import StickyBackButton from "@/components/StickyBackButton";
import { courses, Course } from "@/utils/dataLoader";
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  X,
  Maximize2,
  FileCheck,
  ShieldCheck,
  Search,
  RotateCcw,
} from "lucide-react";

export default function CoursesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<Course | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Extract unique Providers and Years dynamically from dataset
  const providers = useMemo(() => {
    return Array.from(new Set(courses.map((c) => c.provider))).sort();
  }, []);

  const years = useMemo(() => {
    return Array.from(new Set(courses.map((c) => Number(c.year)))).sort((a, b) => b - a);
  }, []);

  // Defined Technology/Topic categories
  const categories = [
    { id: "ALL", label: "All Topics & Stack" },
    { id: "kubernetes-cloud", label: "Kubernetes & Cloud" },
    { id: "devops-cicd", label: "DevOps & Observability" },
    { id: "linux-sysadmin", label: "Linux & System Admin" },
    { id: "networking", label: "Networking & Security" },
    { id: "virtualization", label: "Virtualization (vSphere)" },
    { id: "programming", label: "Python & Development" },
  ];

  // Filter Matching Engine (AND Logic across Search, Provider, Year, Category)
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // 1. Real-time Search Query Match
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesProvider = course.provider.toLowerCase().includes(query);
        const matchesYear = course.year.toString().includes(query);
        const matchesId = course.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesProvider && !matchesYear && !matchesId) {
          return false;
        }
      }

      // 2. Provider Filter Match
      if (selectedProvider !== "ALL" && course.provider !== selectedProvider) {
        return false;
      }

      // 3. Year Filter Match
      if (selectedYear !== "ALL" && course.year.toString() !== selectedYear) {
        return false;
      }

      // 4. Category/Topic Filter Match
      if (selectedCategory !== "ALL") {
        const titleLower = course.title.toLowerCase();
        const providerLower = course.provider.toLowerCase();

        if (selectedCategory === "kubernetes-cloud") {
          if (
            !titleLower.includes("kubernetes") &&
            !titleLower.includes("cloud") &&
            !titleLower.includes("cka") &&
            !titleLower.includes("aws")
          ) {
            return false;
          }
        } else if (selectedCategory === "devops-cicd") {
          if (
            !titleLower.includes("elastic") &&
            !titleLower.includes("elk") &&
            !titleLower.includes("logstash") &&
            !titleLower.includes("kibana") &&
            !titleLower.includes("devops") &&
            !titleLower.includes("ci/cd")
          ) {
            return false;
          }
        } else if (selectedCategory === "linux-sysadmin") {
          if (
            !titleLower.includes("red hat") &&
            !titleLower.includes("linux") &&
            !titleLower.includes("system administration")
          ) {
            return false;
          }
        } else if (selectedCategory === "networking") {
          if (
            !titleLower.includes("network") &&
            !titleLower.includes("ip") &&
            !titleLower.includes("transmission") &&
            !titleLower.includes("collaboration") &&
            !titleLower.includes("security") &&
            !providerLower.includes("huawei")
          ) {
            return false;
          }
        } else if (selectedCategory === "virtualization") {
          if (!titleLower.includes("vmware") && !titleLower.includes("vsphere")) {
            return false;
          }
        } else if (selectedCategory === "programming") {
          if (
            !titleLower.includes("python") &&
            !titleLower.includes("web") &&
            !titleLower.includes("data") &&
            !providerLower.includes("michigan")
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [searchQuery, selectedProvider, selectedYear, selectedCategory]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedProvider !== "ALL" ||
    selectedYear !== "ALL" ||
    selectedCategory !== "ALL";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedProvider("ALL");
    setSelectedYear("ALL");
    setSelectedCategory("ALL");
  };

  // Handle hash scrolling and highlight glow on navigation or direct deep-link
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlightedId(hash);

        const timer = setTimeout(() => {
          setHighlightedId((current) => (current === hash ? null : current));
        }, 2500);

        return () => clearTimeout(timer);
      }
    };

    const timer = setTimeout(handleHashChange, 150);

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCertificate(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ThemeProvider>
      <Layout>
        <div className="py-8 space-y-8 max-w-7xl mx-auto">
          {/* Top Bar: Back to Education & Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-muted pb-6">
            <StickyBackButton href="/#education" label="BACK_TO_EDUCATION" />

            <div className="font-mono text-[11px] text-text-secondary bg-bg-secondary px-3 py-1.5 rounded border border-border-muted self-start flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#32D74B]" />
              <span className="font-bold text-text-primary">
                {filteredCourses.length} / {courses.length} COURSES DISPLAYED
              </span>
            </div>
          </div>

          {/* Page Header */}
          <div>
            <span className="font-mono text-xs text-accent-cyan uppercase tracking-wider block">
              {"// TECHNICAL_TRAINING_MODULES"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mt-1">
              PROFESSIONAL COURSES
            </h1>
            <p className="text-sm text-text-secondary max-w-3xl mt-2 leading-relaxed">
              Completed technical courses and professional training across cloud, DevOps, infrastructure, networking, and software development.
            </p>
          </div>

          {/* Search & Dynamic Filter Console Bar */}
          <div className="bg-bg-secondary border border-border-muted rounded-lg p-4 sm:p-6 space-y-4 shadow-md">
            {/* Top Row: Search Input & Reset Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses by title, provider, or topic..."
                  className="w-full pl-10 pr-10 py-2.5 bg-bg-tertiary border border-border-muted rounded-md font-mono text-xs text-text-primary placeholder:text-text-secondary/50 focus:border-accent-cyan focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-1 cursor-pointer"
                    title="Clear Search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3.5 py-2.5 rounded bg-bg-tertiary border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary transition-all font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RotateCcw size={13} />
                  <span>RESET FILTERS</span>
                </button>
              )}
            </div>

            {/* Bottom Row: Select Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border-muted/60">
              {/* Provider Filter */}
              <div className="space-y-1">
                <label className="font-mono text-[11px] text-text-secondary uppercase font-semibold block">
                  Provider:
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full bg-bg-tertiary border border-border-muted rounded px-3 py-2 font-mono text-xs text-text-primary focus:border-accent-cyan focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Providers ({courses.length})</option>
                  {providers.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="space-y-1">
                <label className="font-mono text-[11px] text-text-secondary uppercase font-semibold block">
                  Year:
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-bg-tertiary border border-border-muted rounded px-3 py-2 font-mono text-xs text-text-primary focus:border-accent-cyan focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Years</option>
                  {years.map((y) => (
                    <option key={y} value={y.toString()}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Technology / Topic Filter */}
              <div className="space-y-1">
                <label className="font-mono text-[11px] text-text-secondary uppercase font-semibold block">
                  Topic / Stack:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-bg-tertiary border border-border-muted rounded px-3 py-2 font-mono text-xs text-text-primary focus:border-accent-cyan focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between font-mono text-xs text-text-secondary">
            <span>
              SHOWING <strong className="text-accent-cyan">{filteredCourses.length}</strong> OF{" "}
              <strong>{courses.length}</strong> COURSES
            </span>
            {hasActiveFilters && (
              <span className="text-[11px] text-accent-cyan italic hidden sm:inline">
                ● Filters Active
              </span>
            )}
          </div>

          {/* Empty State when no courses match filters */}
          {filteredCourses.length === 0 ? (
            <div className="bg-bg-secondary border border-dashed border-border-muted rounded-lg p-10 text-center space-y-4 my-8">
              <BookOpen size={36} className="mx-auto text-accent-cyan/60" />
              <h3 className="text-base font-mono font-bold text-text-primary">
                NO COURSES MATCH SELECTED FILTERS
              </h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                No course records found matching your active search query or provider/year selection.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded bg-accent-cyan text-bg-primary font-mono text-xs font-bold hover:bg-accent-cyan/90 transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw size={14} />
                <span>RESET ALL FILTERS</span>
              </button>
            </div>
          ) : (
            /* Courses Responsive Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const hasCertificate = !!(course.certificateImage || course.certificateUrl);
                const hasVerification = !!course.verificationUrl;
                const hasNeither = !hasCertificate && !hasVerification;
                const isHighlighted = highlightedId === course.id;

                return (
                  <div
                    key={course.id}
                    id={course.id}
                    className={`bg-bg-secondary border rounded-lg p-5 flex flex-col justify-between transition-all duration-500 scroll-mt-24 sm:scroll-mt-28 group focus-within:ring-1 focus-within:ring-accent-cyan ${
                      isHighlighted
                        ? "border-accent-cyan shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-[1.02]"
                        : "border-border-color hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1"
                    }`}
                  >
                    <div>
                      {/* Certificate Image Preview Area */}
                      {course.certificateImage ? (
                        <div
                          onClick={() => setSelectedCertificate(course)}
                          className="block h-52 sm:h-56 w-full flex items-center justify-center p-1 bg-bg-tertiary/70 rounded-md border border-border-muted mb-5 overflow-hidden group/img cursor-pointer relative"
                          title="Click to view full-screen certificate"
                        >
                          <img
                            src={course.certificateImage}
                            alt={`${course.title} Certificate - ${course.provider}`}
                            loading="lazy"
                            className="w-full h-full object-contain transition-transform duration-300 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-accent-cyan font-mono text-xs font-bold backdrop-blur-[2px]">
                            <Maximize2 size={16} />
                            <span>ENLARGE CERTIFICATE</span>
                          </div>
                        </div>
                      ) : (
                        /* Placeholder when certificate image is unavailable */
                        <div className="h-48 sm:h-52 w-full flex flex-col items-center justify-center p-4 bg-bg-tertiary/40 rounded-md border border-dashed border-border-muted mb-5 text-center">
                          <FileCheck size={28} className="text-text-secondary/40 mb-2" />
                          <span className="font-mono text-xs font-bold text-text-secondary/70 tracking-wider">
                            CERTIFICATE NOT AVAILABLE
                          </span>
                          <span className="font-mono text-[11px] text-text-secondary/40 mt-1">
                            Verified completion on file
                          </span>
                        </div>
                      )}

                      {/* Course Title, Provider & Year */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-accent-cyan font-semibold">
                            {course.provider}
                          </span>
                          <span className="font-mono text-[11px] text-text-secondary bg-bg-tertiary px-2 py-0.5 rounded border border-border-muted">
                            {course.year}
                          </span>
                        </div>

                        <h2 className="font-mono text-sm font-bold text-text-primary leading-snug break-words group-hover:text-accent-cyan transition-colors">
                          {course.title}
                        </h2>
                      </div>
                    </div>

                    {/* Footer & Conditional Actions */}
                    <div className="space-y-3 pt-3 border-t border-border-muted">
                      {/* Completion Status Pill */}
                      <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-[#32D74B]">
                        <CheckCircle2 size={13} className="shrink-0" />
                        <span className="font-bold tracking-wider">COURSE COMPLETED</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {/* VIEW CERTIFICATE */}
                        {course.certificateImage ? (
                          <button
                            type="button"
                            onClick={() => setSelectedCertificate(course)}
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent-cyan font-bold hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
                          >
                            <span>VIEW CERTIFICATE</span>
                            <Maximize2 size={12} className="shrink-0" />
                          </button>
                        ) : course.certificateUrl ? (
                          <a
                            href={course.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-accent-cyan font-bold hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
                          >
                            <span>VIEW CERTIFICATE</span>
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        ) : null}

                        {/* VERIFY COMPLETION */}
                        {course.verificationUrl && (
                          <a
                            href={course.verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#32D74B] font-bold hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#32D74B]"
                          >
                            <span>VERIFY COMPLETION</span>
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        )}

                        {/* Neither Certificate nor Verification Link */}
                        {hasNeither && (
                          <span className="font-mono text-[11px] text-text-secondary/70 italic">
                            COMPLETION RECORD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Full-Screen High-Resolution Certificate Lightbox Modal */}
        {selectedCertificate && selectedCertificate.certificateImage && (
          <div
            onClick={() => setSelectedCertificate(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-secondary border border-border-color rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="bg-bg-tertiary px-6 py-4 border-b border-border-muted flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-mono text-sm font-bold text-text-primary">
                    {selectedCertificate.title}
                  </h3>
                  <p className="font-mono text-xs text-text-secondary mt-0.5">
                    {selectedCertificate.provider} · {selectedCertificate.year}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={selectedCertificate.certificateImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-text-secondary hover:text-accent-cyan transition-colors"
                    title="Open Full Resolution Original Image"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedCertificate(null)}
                    className="p-2 text-text-secondary hover:text-red-400 transition-colors cursor-pointer"
                    title="Close (ESC)"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body: High Resolution Certificate View */}
              <div className="p-4 sm:p-6 overflow-auto flex-1 flex items-center justify-center bg-black/50">
                <img
                  src={selectedCertificate.certificateImage}
                  alt={`${selectedCertificate.title} Certificate`}
                  className="max-w-full max-h-[75vh] object-contain rounded border border-border-muted shadow-lg"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="bg-bg-tertiary px-6 py-3 border-t border-border-muted flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <span className="text-text-secondary text-[11px]">
                  Press ESC or click outside to close
                </span>

                <div className="flex items-center gap-3">
                  {selectedCertificate.verificationUrl && (
                    <a
                      href={selectedCertificate.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#32D74B] font-bold hover:underline"
                    >
                      <span>VERIFY COMPLETION</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <a
                    href={selectedCertificate.certificateImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent-cyan font-bold hover:underline"
                  >
                    <span>OPEN ORIGINAL HIGH-RES</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </ThemeProvider>
  );
}
