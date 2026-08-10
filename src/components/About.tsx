"use client";

import React from "react";
import { profile, futureSections } from "@/utils/dataLoader";
import { User, Globe, Shield, Terminal, Landmark, Activity, GitBranch, Zap } from "lucide-react";

export default function About() {
  const specs = [
    { title: "CI/CD & Release Engineering", desc: "Building and optimizing GitLab CI/CD and Jenkins pipelines for consistent builds, container packaging, versioning, and automated deployments.", icon: GitBranch },
    { title: "Kubernetes & Containers", desc: "Deploying and operating containerized workloads with Docker, Kubernetes, and Helm, including configuration, health checks, scaling, and troubleshooting.", icon: Shield },
    { title: "Infrastructure Automation", desc: "Automating infrastructure and operational workflows using Terraform, Ansible, Bash, and Python to reduce manual effort and improve consistency.", icon: Terminal },
    { title: "Observability & Operations", desc: "Implementing monitoring and observability using Prometheus, Grafana, Loki, and related tools to improve system visibility, troubleshooting, and operational response.", icon: Activity },
  ];

  return (
    <section id="about" className="py-12 border-t border-border-muted scroll-mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider">{"// SYSTEM_PROFILE"}</h2>
          <h3 className="text-2xl font-bold tracking-tight mt-1">About Operator</h3>
        </div>
        <div className="font-mono text-[11px] text-text-secondary bg-bg-secondary px-3 py-1.5 rounded border border-border-muted self-start flex items-center gap-1.5">
          <User size={12} className="text-accent-cyan" />
          <span>NODE: PROFILE_INFO_LOADED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Biography & Specs - Left (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-bg-secondary border border-border-muted rounded-lg p-6">
            <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-3">{"// PROFESSIONAL_STORY"}</h4>
            <p className="text-text-primary text-sm leading-relaxed mb-4">
              {profile.aboutStoryParagraph1}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              {profile.aboutStoryParagraph2}
            </p>
          </div>

          {/* Specs grid */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-3r">// CORE_SPECIALIZATIONS</h4>
            <div className="grid grid-cols-1 gap-4">
              {specs.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="bg-bg-secondary border border-border-muted rounded-lg p-4 flex items-start gap-4 hover:border-accent-cyan/60 transition-colors">
                    <div className="p-2 rounded bg-bg-tertiary border border-border-muted text-accent-cyan">
                      <IconComponent size={16} />
                    </div>
                    <div>
                      <h5 className="font-mono text-xs font-bold text-text-primary">{item.title}</h5>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Highlights, Volunteering, Awards, Languages - Right (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Industries */}
          <div className="bg-bg-secondary border border-border-muted rounded-lg p-6">
            <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-4">{"// INDUSTRY_EXPERIENCE"}</h4>
            <div className="space-y-3 font-mono text-xs text-text-secondary">
              
              {/* Financial Services & Fintech */}
              <div className="flex items-center gap-3 bg-bg-tertiary px-3 py-2.5 rounded border border-border-muted hover:border-accent-cyan/60 transition-colors">
                <Landmark size={14} className="text-accent-cyan shrink-0" />
                <div>
                  <span className="block font-bold text-text-primary text-[12px] uppercase">Financial Services & Fintech</span>
                  <span className="text-[11px] text-text-secondary/99 leading-relaxed block mt-0.5">Supporting secure payment platforms, enterprise deployments, and operational reliability in regulated environments.</span>
                </div>
              </div>

              {/* Enterprise IT & Technology Services */}
              <div className="flex items-center gap-3 bg-bg-tertiary px-3 py-2.5 rounded border border-border-muted hover:border-accent-emerald/60 transition-colors">
                <Globe size={14} className="text-accent-emerald shrink-0" />
                <div>
                  <span className="block font-bold text-text-primary text-[12px] uppercase">Enterprise IT & Tech Services</span>
                  <span className="text-[11px] text-text-secondary/99 leading-relaxed block mt-0.5">Delivering application support, infrastructure operations, automation, and DevOps solutions across cloud and on-premises environments.</span>
                </div>
              </div>

              {/* Telecommunications */}
              <div className="flex items-center gap-3 bg-bg-tertiary px-3 py-2.5 rounded border border-border-muted hover:border-accent-orange/60 transition-colors">
                <Zap size={14} className="text-accent-orange shrink-0" />
                <div>
                  <span className="block font-bold text-text-primary text-[12px] uppercase">Telecommunications</span>
                  <span className="text-[11px] text-text-secondary/99 leading-relaxed block mt-0.5">Supporting large-scale infrastructure, high-availability services, NOC operations, and incident response.</span>
                </div>
              </div>

            </div>
          </div>

          {/* Awards & Volunteering */}
          {futureSections.volunteering.enabled && futureSections.volunteering.items.length > 0 && (
            <div className="bg-bg-secondary border border-border-muted rounded-lg p-6">
              <h4 className="font-mono text-xs text-accent-emerald uppercase tracking-wider mb-4">// COMMUNITY_INVOLVEMENT</h4>
              {futureSections.volunteering.items.map((vol, idx) => (
                <div key={idx} className="space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-bold text-text-primary">{vol.organization}</span>
                    <span className="text-[11px] text-text-secondary">{vol.period}</span>
                  </div>
                  <div className="text-accent-cyan text-[11px]">{vol.role}</div>
                  <p className="text-[12px] text-text-secondary/99 leading-relaxed mt-2 font-sans">
                    {vol.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {futureSections.languages.enabled && futureSections.languages.items.length > 0 && (
            <div className="bg-bg-secondary border border-border-muted rounded-lg p-6">
              <h4 className="font-mono text-xs text-accent-orange uppercase tracking-wider mb-4">// LANGUAGE_PROFICIENCY</h4>
              <div className="grid grid-cols-2 gap-4">
                {futureSections.languages.items.map((lang, idx) => (
                  <div key={idx} className="bg-bg-tertiary border border-border-muted rounded p-3 text-center hover:border-accent-orange/40 transition-colors">
                    <span className="font-mono text-[12px] font-bold text-text-primary block">{lang.language}</span>
                    <span className="font-mono text-[9.5px] text-accent-orange uppercase block mt-1">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
