"use client";

import React, { useState, useEffect } from "react";
import { certifications } from "@/utils/dataLoader";
import { ExternalLink, ShieldCheck } from "lucide-react";

export default function Certifications() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const awsCcp = certifications.find((c) => c.id === "aws-ccp");
  const awsSaa = certifications.find((c) => c.id === "aws-saa");
  const cka = certifications.find((c) => c.id === "cka");
  const rhcsa = certifications.find((c) => c.id === "rhcsa");
  const hcia = certifications.find((c) => c.id === "hcia-datacom");

  // Handle hash scrolling & temporary cyan highlight glow on direct link / badge click
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlightedId(hash);

        const timer = setTimeout(() => {
          setHighlightedId((curr) => (curr === hash ? null : curr));
        }, 1800);

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

  return (
    <section id="certifications" className="py-12 border-t border-border-muted scroll-mt-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider">{"// CREDENTIALS"}</h2>
          <h3 className="text-2xl font-bold tracking-tight mt-1">Certifications</h3>
          <p className="font-mono text-xs text-text-secondary mt-1">
            Verified professional credentials and technical certifications.
          </p>
        </div>
        <div className="font-mono text-[11px] text-text-secondary bg-bg-secondary px-3 py-1.5 rounded border border-border-muted self-start flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#32D74B]" />
          <span>VERIFIED_CREDENTIALS: {certifications.length}</span>
        </div>
      </div>

      {/* Grid Layout: Desktop (3 cols), Tablet (2 cols), Mobile (1 col) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. AWS Certified Cloud Practitioner */}
        {awsCcp && (
          <div
            id="aws-certified-cloud-practitioner"
            className={`bg-bg-secondary border rounded-lg p-6 flex flex-col justify-between transition-all duration-500 scroll-mt-24 sm:scroll-mt-28 group focus-within:ring-1 focus-within:ring-accent-cyan ${
              highlightedId === "aws-certified-cloud-practitioner" || highlightedId === "aws-cloud-practitioner" || highlightedId === "aws-ccp"
                ? "border-accent-cyan shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-[1.02]"
                : "border-border-color hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            }`}
          >
            <div>
              {/* Badge Container 1: AWS Cloud Practitioner */}
              <a
                href={awsCcp.verificationLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${awsCcp.name} credential`}
                className="block h-48 sm:h-52 flex items-center justify-center p-1 bg-bg-tertiary/60 rounded-md border border-border-muted mb-5 overflow-hidden focus:outline-none cursor-pointer"
              >
                <img
                  src={awsCcp.badgeUrl || ""}
                  alt={`${awsCcp.name} Badge`}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </a>

              <h4 className="font-mono text-sm font-bold text-text-primary mb-1 group-hover:text-accent-cyan transition-colors leading-snug">
                {awsCcp.name}
              </h4>
              <p className="font-mono text-xs text-text-secondary mb-4">{awsCcp.issuer}</p>
            </div>

            {awsCcp.verificationLink && (
              <a
                href={awsCcp.verificationLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${awsCcp.name} credential`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-cyan font-semibold hover:underline mt-2 cursor-pointer self-start"
              >
                <span>VERIFY CREDENTIAL</span>
                <ExternalLink size={13} className="shrink-0" />
              </a>
            )}
          </div>
        )}

        {/* 2. AWS Certified Solutions Architect – Associate */}
        {awsSaa && (
          <div
            id="aws-solutions-architect-associate"
            className={`bg-bg-secondary border rounded-lg p-6 flex flex-col justify-between transition-all duration-500 scroll-mt-24 sm:scroll-mt-28 group focus-within:ring-1 focus-within:ring-accent-cyan ${
              highlightedId === "aws-solutions-architect-associate" || highlightedId === "aws-saa"
                ? "border-accent-cyan shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-[1.02]"
                : "border-border-color hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            }`}
          >
            <div>
              {/* Badge Container 2: AWS Solutions Architect */}
              <a
                href={awsSaa.verificationLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${awsSaa.name} credential`}
                className="block h-48 sm:h-52 flex items-center justify-center p-1 bg-bg-tertiary/60 rounded-md border border-border-muted mb-5 overflow-hidden focus:outline-none cursor-pointer"
              >
                <img
                  src={awsSaa.badgeUrl || ""}
                  alt={`${awsSaa.name} Badge`}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </a>

              <h4 className="font-mono text-sm font-bold text-text-primary mb-1 group-hover:text-accent-cyan transition-colors leading-snug">
                {awsSaa.name}
              </h4>
              <p className="font-mono text-xs text-text-secondary mb-4">{awsSaa.issuer}</p>
            </div>

            {awsSaa.verificationLink && (
              <a
                href={awsSaa.verificationLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${awsSaa.name} credential`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-cyan font-semibold hover:underline mt-2 cursor-pointer self-start"
              >
                <span>VERIFY CREDENTIAL</span>
                <ExternalLink size={13} className="shrink-0" />
              </a>
            )}
          </div>
        )}

        {/* 3. CKA: Certified Kubernetes Administrator */}
        {cka && (
          <div
            id="certified-kubernetes-administrator"
            className={`bg-bg-secondary border rounded-lg p-6 flex flex-col justify-between transition-all duration-500 scroll-mt-24 sm:scroll-mt-28 group focus-within:ring-1 focus-within:ring-accent-cyan ${
              highlightedId === "certified-kubernetes-administrator" || highlightedId === "cka"
                ? "border-accent-cyan shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-[1.02]"
                : "border-border-color hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            }`}
          >
            <div>
              {/* Badge Container 3: CKA */}
              <a
                href={cka.verificationLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${cka.name} credential`}
                className="block h-48 sm:h-52 flex items-center justify-center p-0 bg-bg-tertiary/60 rounded-md border border-border-muted mb-5 overflow-hidden focus:outline-none cursor-pointer"
              >
                <img
                  src={cka.badgeUrl || ""}
                  alt={`${cka.name} Badge`}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </a>

              <h4 className="font-mono text-sm font-bold text-text-primary mb-1 group-hover:text-accent-cyan transition-colors leading-snug">
                {cka.name}
              </h4>
              <p className="font-mono text-xs text-text-secondary mb-4">{cka.issuer}</p>
            </div>

            {cka.verificationLink && (
              <a
                href={cka.verificationLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${cka.name} credential`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-cyan font-semibold hover:underline mt-2 cursor-pointer self-start"
              >
                <span>VERIFY CREDENTIAL</span>
                <ExternalLink size={13} className="shrink-0" />
              </a>
            )}
          </div>
        )}

        {/* 4. Red Hat Certified System Administrator (RHCSA) */}
        {rhcsa && (
          <div
            id="red-hat-certified-system-administrator"
            className={`bg-bg-secondary border rounded-lg p-6 flex flex-col justify-between transition-all duration-500 scroll-mt-24 sm:scroll-mt-28 group focus-within:ring-1 focus-within:ring-accent-cyan ${
              highlightedId === "red-hat-certified-system-administrator" || highlightedId === "rhcsa"
                ? "border-accent-cyan shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-[1.02]"
                : "border-border-color hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            }`}
          >
            <div>
              {/* Badge Container 4: Red Hat RHCSA */}
              <a
                href={rhcsa.verificationLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${rhcsa.name} credential`}
                className="block h-48 sm:h-52 flex items-center justify-center p-0 bg-bg-tertiary/60 rounded-md border border-border-muted mb-5 overflow-hidden focus:outline-none cursor-pointer"
              >
                <img
                  src={rhcsa.badgeUrl || ""}
                  alt={`${rhcsa.name} Badge`}
                  loading="lazy"
                  className="w-full h-full object-contain scale-125 transition-transform duration-300 group-hover:scale-135"
                />
              </a>

              <h4 className="font-mono text-sm font-bold text-text-primary mb-1 group-hover:text-accent-cyan transition-colors leading-snug">
                {rhcsa.name}
              </h4>
              <p className="font-mono text-xs text-text-secondary mb-4">{rhcsa.issuer}</p>
            </div>

            {rhcsa.verificationLink && (
              <a
                href={rhcsa.verificationLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${rhcsa.name} credential`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-cyan font-semibold hover:underline mt-2 cursor-pointer self-start"
              >
                <span>VERIFY CREDENTIAL</span>
                <ExternalLink size={13} className="shrink-0" />
              </a>
            )}
          </div>
        )}

        {/* 5. HCIA – Datacom, Huawei Certified (Routing & Switching) */}
        {hcia && (
          <div
            id="huawei-hcia-datacom"
            className={`bg-bg-secondary border rounded-lg p-6 flex flex-col justify-between transition-all duration-500 scroll-mt-24 sm:scroll-mt-28 group focus-within:ring-1 focus-within:ring-accent-cyan ${
              highlightedId === "huawei-hcia-datacom" || highlightedId === "hcia-datacom"
                ? "border-accent-cyan shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-[1.02]"
                : "border-border-color hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            }`}
          >
            <div>
              {/* Badge Container 5: Huawei HCIA Datacom (High-Resolution Expanded Container) */}
              <a
                href={hcia.verificationLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${hcia.name} credential`}
                className="block h-48 sm:h-52 flex items-center justify-center p-0 bg-white rounded-md border border-border-muted mb-5 overflow-hidden focus:outline-none cursor-pointer group/huawei shadow-md"
              >
                <img
                  src={hcia.badgeUrl || ""}
                  alt={`${hcia.name} Badge`}
                  loading="lazy"
                  className="w-full h-full object-contain p-0 max-h-full max-w-full scale-105 transition-transform duration-300 group-hover/huawei:scale-110"
                />
              </a>

              <h4 className="font-mono text-sm font-bold text-text-primary mb-1 group-hover:text-accent-cyan transition-colors leading-snug">
                {hcia.name}
              </h4>
              <p className="font-mono text-xs text-text-secondary mb-4">{hcia.issuer}</p>
            </div>

            {hcia.verificationLink && (
              <a
                href={hcia.verificationLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${hcia.name} credential`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-cyan font-semibold hover:underline mt-2 cursor-pointer self-start"
              >
                <span>VERIFY CREDENTIAL</span>
                <ExternalLink size={13} className="shrink-0" />
              </a>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
