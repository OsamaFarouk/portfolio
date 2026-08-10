"use client";

import React, { useEffect, useState, useRef } from "react";

export default function Mermaid({ chart }: { chart: string }) {
  const [isClient, setIsClient] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && elementRef.current) {
      // Dynamically load mermaid to prevent server-side crash
      import("mermaid").then((mermaidModule) => {
        const mermaid = mermaidModule.default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          themeVariables: {
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            background: "#0a0d16",
            primaryColor: "#06b6d4",
            lineColor: "#06b6d4"
          }
        });

        // Generate a random ID for rendering
        const uniqueId = `mermaid-svg-${Math.floor(Math.random() * 1000000)}`;
        
        try {
          mermaid.render(uniqueId, chart).then(({ svg }) => {
            if (elementRef.current) {
              elementRef.current.innerHTML = svg;
            }
          }).catch((err) => {
            console.error("Mermaid rendering failed:", err);
            if (elementRef.current) {
              elementRef.current.innerHTML = `<div class="text-xs text-accent-orange font-mono p-4">ERR_DIAGRAM_RENDER_FAIL</div>`;
            }
          });
        } catch (e) {
          console.error("Mermaid parser error:", e);
          if (elementRef.current) {
            elementRef.current.innerHTML = `<div class="text-xs text-accent-orange font-mono p-4">ERR_DIAGRAM_SYNTAX</div>`;
          }
        }
      });
    }
  }, [isClient, chart]);

  return (
    <div 
      ref={elementRef}
      className="w-full bg-bg-primary rounded border border-border-muted p-4 overflow-x-auto flex items-center justify-center min-h-[160px]"
    >
      <div className="font-mono text-[11px] text-text-secondary animate-pulse uppercase">
        {"// LOADING_MERMAID_DIAGRAM..."}
      </div>
    </div>
  );
}
