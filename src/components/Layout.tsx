"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Terminal as TerminalIcon, Menu, X, ArrowUp, ChevronDown, ExternalLink } from "lucide-react";
import { profile } from "@/utils/dataLoader";
import { scrollToSection } from "@/utils/scrollHelper";
import { APP_VERSION } from "@/utils/version";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [mobileCredentialsOpen, setMobileCredentialsOpen] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isFooterDocked, setIsFooterDocked] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dockingSentinelRef = useRef<HTMLDivElement>(null);

  // Centralized Navigation Handler for main-bar section links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();

    setMobileMenuOpen(false);
    setCredentialsOpen(false);

    // If currently on a separate route (e.g. /courses or /resume), navigate to main page with hash
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      return;
    }

    // Perform slow, smooth cubic-eased scroll animation on current page
    scrollToSection(sectionId);
  };

  // Check initial hash on load or cross-route navigation (e.g., coming from /courses to /#experience)
  useEffect(() => {
    if (typeof window === "undefined" || pathname !== "/") return;

    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.replace(/^#/, "");
      const timer = setTimeout(() => {
        scrollToSection(targetId, { updateHash: false });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Scroll listener for Back To Top button and ScrollSpy active section tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      // Back to top visibility
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // ScrollSpy active section detection
      if (window.location.pathname.startsWith("/courses")) {
        setActiveSection("credentials");
        return;
      }
      if (window.location.pathname.startsWith("/resume")) {
        setActiveSection("resume");
        return;
      }
      if (window.location.pathname.startsWith("/projects")) {
        setActiveSection("projects");
        return;
      }

      const sections = ["home", "experience", "projects", "skills", "certifications", "education", "terminal", "contact"];
      const scrollPosition = window.scrollY + 120; // navbar offset

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCredentialsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCredentialsOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // IntersectionObserver observing dedicated docking sentinel to dock mobile Top Up button before footer overlap
  useEffect(() => {
    if (typeof window === "undefined" || !dockingSentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterDocked(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px 0px 80px 0px",
        threshold: 0,
      }
    );

    observer.observe(dockingSentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Hover handlers for desktop dropdown with buffer timeout
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setCredentialsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setCredentialsOpen(false);
    }, 150);
  };

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    if (pathname === "/") {
      scrollToSection("home", { updateHash: false });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-bg-primary/90 backdrop-blur-md border-b border-border-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo / Operator Identity */}
          <a
            href="/#home"
            onClick={(e) => handleNavClick(e, "home")}
            className="flex items-center gap-2 font-mono text-sm tracking-widest text-accent-cyan font-bold hover:opacity-80 transition-opacity shrink-0"
          >
            <TerminalIcon size={18} className="animate-pulse" />
            <span>OSAMA@CONSOLE:~$</span>
          </a>

          {/* Desktop Navigation Row */}
          <nav className="hidden lg:flex items-center gap-7 font-mono text-xs uppercase tracking-wider">
            {/* OVERVIEW */}
            <a
              href="/#home"
              onClick={(e) => handleNavClick(e, "home")}
              className={`px-1 py-1 transition-all flex items-center gap-1 hover:text-accent-cyan ${
                activeSection === "home"
                  ? "text-accent-cyan font-bold border-b-2 border-accent-cyan"
                  : "text-text-secondary"
              }`}
            >
              OVERVIEW
            </a>

            {/* EXPERIENCE */}
            <a
              href="/#experience"
              onClick={(e) => handleNavClick(e, "experience")}
              className={`px-1 py-1 transition-all flex items-center gap-1 hover:text-accent-cyan ${
                activeSection === "experience"
                  ? "text-accent-cyan font-bold border-b-2 border-accent-cyan"
                  : "text-text-secondary"
              }`}
            >
              EXPERIENCE
            </a>

            {/* PROJECTS */}
            <a
              href="/#projects"
              onClick={(e) => handleNavClick(e, "projects")}
              className={`px-1 py-1 transition-all flex items-center gap-1 hover:text-accent-cyan ${
                activeSection === "projects"
                  ? "text-accent-cyan font-bold border-b-2 border-accent-cyan"
                  : "text-text-secondary"
              }`}
            >
              PROJECTS
            </a>

            {/* SKILLS */}
            <a
              href="/#skills"
              onClick={(e) => handleNavClick(e, "skills")}
              className={`px-1 py-1 transition-all flex items-center gap-1 hover:text-accent-cyan ${
                activeSection === "skills"
                  ? "text-accent-cyan font-bold border-b-2 border-accent-cyan"
                  : "text-text-secondary"
              }`}
            >
              SKILLS
            </a>

            {/* CREDENTIALS DROPDOWN */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setCredentialsOpen(!credentialsOpen)}
                aria-expanded={credentialsOpen}
                aria-haspopup="true"
                className={`px-1 py-1 transition-all flex items-center gap-1 hover:text-accent-cyan cursor-pointer ${
                  activeSection === "credentials" ||
                  activeSection === "certifications" ||
                  activeSection === "education"
                    ? "text-accent-cyan font-bold border-b-2 border-accent-cyan"
                    : "text-text-secondary"
                }`}
              >
                <span>CREDENTIALS</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    credentialsOpen ? "rotate-180 text-accent-cyan" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {credentialsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-md bg-bg-secondary border border-border-muted shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <a
                    href="/#certifications"
                    onClick={(e) => handleNavClick(e, "certifications")}
                    className="block px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-cyan hover:bg-bg-tertiary/40 transition-colors"
                  >
                    CERTIFICATIONS
                  </a>
                  <Link
                    href="/courses"
                    onClick={() => setCredentialsOpen(false)}
                    className="block px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-cyan hover:bg-bg-tertiary/40 transition-colors"
                  >
                    PROFESSIONAL COURSES
                  </Link>
                  <a
                    href="/#education"
                    onClick={(e) => handleNavClick(e, "education")}
                    className="block px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-cyan hover:bg-bg-tertiary/40 transition-colors"
                  >
                    EDUCATION &amp; AWARD
                  </a>
                </div>
              )}
            </div>

            {/* CONTACT */}
            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className={`px-1 py-1 transition-all flex items-center gap-1 hover:text-accent-cyan ${
                activeSection === "contact"
                  ? "text-accent-cyan font-bold border-b-2 border-accent-cyan"
                  : "text-text-secondary"
              }`}
            >
              CONTACT
            </a>

            {/* RESUME CTA BUTTON */}
            <Link
              href="/resume"
              className="border border-accent-cyan/80 bg-accent-cyan/10 hover:bg-accent-cyan hover:text-bg-primary text-accent-cyan font-mono text-xs font-bold rounded px-3 py-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)] flex items-center gap-1.5"
            >
              <span>RESUME</span>
              <ExternalLink size={12} className="shrink-0" />
            </Link>
          </nav>

          {/* Right Controls: Terminal Section Link & Mobile Menu Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Terminal Section Link */}
            <a
              href="/#terminal"
              onClick={(e) => handleNavClick(e, "terminal")}
              className={`p-2 rounded-md border text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeSection === "terminal"
                  ? "border-accent-cyan text-accent-cyan bg-accent-cyan/20 shadow-[0_0_15px_rgba(6,182,212,0.35)] font-bold"
                  : "border-border-muted text-text-secondary hover:border-accent-cyan hover:text-accent-cyan"
              }`}
              title="Navigate to Terminal Section"
              aria-label="Navigate to Terminal Section"
            >
              <TerminalIcon size={14} className={activeSection === "terminal" ? "animate-pulse" : ""} />
              <span className="text-[11px] hidden xl:inline">Terminal</span>
            </a>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md border border-border-muted text-text-secondary hover:border-accent-cyan hover:text-accent-cyan lg:hidden transition-all"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-lg flex flex-col lg:hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-4 h-16 border-b border-border-muted">
            <a
              href="/#home"
              onClick={(e) => handleNavClick(e, "home")}
              className="flex items-center gap-2 font-mono text-sm tracking-widest text-accent-cyan font-bold"
            >
              <TerminalIcon size={18} />
              <span>OSAMA@CONSOLE:~$</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-text-secondary hover:text-accent-cyan"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
            <nav className="flex flex-col gap-5 font-mono text-sm">
              <a
                href="/#home"
                onClick={(e) => handleNavClick(e, "home")}
                className="text-text-secondary hover:text-accent-cyan pb-1 border-b border-border-muted/50 transition-colors"
              >
                OVERVIEW
              </a>
              <a
                href="/#experience"
                onClick={(e) => handleNavClick(e, "experience")}
                className="text-text-secondary hover:text-accent-cyan pb-1 border-b border-border-muted/50 transition-colors"
              >
                EXPERIENCE
              </a>
              <a
                href="/#projects"
                onClick={(e) => handleNavClick(e, "projects")}
                className="text-text-secondary hover:text-accent-cyan pb-1 border-b border-border-muted/50 transition-colors"
              >
                PROJECTS
              </a>
              <a
                href="/#skills"
                onClick={(e) => handleNavClick(e, "skills")}
                className="text-text-secondary hover:text-accent-cyan pb-1 border-b border-border-muted/50 transition-colors"
              >
                SKILLS
              </a>

              {/* Mobile Submenu: CREDENTIALS */}
              <div className="border-b border-border-muted/50 pb-2">
                <button
                  type="button"
                  onClick={() => setMobileCredentialsOpen(!mobileCredentialsOpen)}
                  className="w-full flex items-center justify-between text-text-primary font-bold py-1 text-left"
                >
                  <span>CREDENTIALS</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      mobileCredentialsOpen ? "rotate-180 text-accent-cyan" : ""
                    }`}
                  />
                </button>

                {mobileCredentialsOpen && (
                  <div className="pl-4 mt-2 flex flex-col gap-2 font-mono text-xs">
                    <a
                      href="/#certifications"
                      onClick={(e) => handleNavClick(e, "certifications")}
                      className="text-text-secondary hover:text-accent-cyan py-1 transition-colors"
                    >
                      • CERTIFICATIONS
                    </a>
                    <Link
                      href="/courses"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-text-secondary hover:text-accent-cyan py-1 transition-colors"
                    >
                      • PROFESSIONAL COURSES
                    </Link>
                    <a
                      href="/#education"
                      onClick={(e) => handleNavClick(e, "education")}
                      className="text-text-secondary hover:text-accent-cyan py-1 transition-colors"
                    >
                      • EDUCATION &amp; AWARD
                    </a>
                  </div>
                )}
              </div>

              <a
                href="/#terminal"
                onClick={(e) => handleNavClick(e, "terminal")}
                className="text-text-secondary hover:text-accent-cyan pb-1 border-b border-border-muted/50 transition-colors"
              >
                TERMINAL
              </a>

              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="text-text-secondary hover:text-accent-cyan pb-1 border-b border-border-muted/50 transition-colors"
              >
                CONTACT
              </a>

              <div className="pt-2">
                <Link
                  href="/resume"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full border border-accent-cyan bg-accent-cyan/15 text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary font-mono text-xs font-bold rounded py-2.5 px-4 transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                >
                  <span>RESUME</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </nav>

            <div className="border-t border-border-muted pt-4 font-mono text-[11px] text-text-secondary space-y-1">
              <div className="flex items-center justify-between">
                <span>STATUS: ONLINE</span>
                <span className="text-[#32D74B]">● READY</span>
              </div>
              <div className="text-text-secondary/70">OPERATOR: {profile.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Floating Mobile Back To Top Button (when NOT docked in footer) */}
      {showBackToTop && !isFooterDocked && (
        <button
          type="button"
          onClick={scrollToTop}
          title="Back to top"
          aria-label="Back to top"
          className="flex sm:hidden fixed bottom-5 right-5 z-20 w-12 h-12 rounded-lg bg-bg-secondary/90 backdrop-blur-md border border-accent-cyan/70 text-accent-cyan hover:border-accent-cyan hover:bg-bg-tertiary hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] active:scale-95 transition-all duration-200 items-center justify-center cursor-pointer shadow-lg group mb-[env(safe-area-inset-bottom)] sm:mb-0"
        >
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Desktop Fixed Back To Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          title="Back to top"
          aria-label="Back to top"
          className="hidden sm:flex fixed sm:bottom-10 sm:right-10 z-20 w-12 h-12 rounded-lg bg-bg-secondary/90 backdrop-blur-md border border-accent-cyan/70 text-accent-cyan hover:border-accent-cyan hover:bg-bg-tertiary hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] active:scale-95 transition-all duration-200 items-center justify-center cursor-pointer shadow-lg group"
        >
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-border-muted bg-bg-secondary/40 py-6 font-mono text-[11px] text-text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
          {/* Docking Sentinel (Triggers docking 80px before floating button overlaps footer) */}
          <div ref={dockingSentinelRef} className="w-full h-0 pointer-events-none" />

          {/* Mobile Docked Top Up Button (when docking sentinel IS in viewport) */}
          {showBackToTop && isFooterDocked && (
            <div className="flex sm:hidden justify-center mb-1">
              <button
                type="button"
                onClick={scrollToTop}
                title="Back to top"
                aria-label="Back to top"
                className="w-12 h-12 rounded-lg bg-bg-secondary/90 backdrop-blur-md border border-accent-cyan/70 text-accent-cyan hover:border-accent-cyan hover:bg-bg-tertiary hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-lg group"
              >
                <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              &copy; {new Date().getFullYear()} Osama Ahmed Farouk. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>SECURE CONSOLE V{APP_VERSION}</span>
              <span>
                <span className="text-[#32D74B] font-bold animate-pulse">● </span> PORTAL HEALTH: <span className="text-[#32D74B] font-bold animate-pulse">OK</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
