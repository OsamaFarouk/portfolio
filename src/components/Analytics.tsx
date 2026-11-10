"use client";

import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID as string;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID as string;
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Loads Google Analytics 4, Microsoft Clarity, Vercel Web Analytics, and
 * Vercel Speed Insights.
 *
 * All analytics tools are omitted entirely from the DOM unless
 * NEXT_PUBLIC_ANALYTICS_ENABLED is set to "true" in the environment,
 * which ensures development and local testing traffic is never tracked.
 *
 * Additionally, Vercel Web Analytics and Vercel Speed Insights are strictly
 * gated to production builds (NODE_ENV === "production") with debug={false}
 * so their external debug scripts (va.vercel-scripts.com) are never injected
 * during local development.
 */
export default function Analytics() {
  if (!ANALYTICS_ENABLED) return null;

  return (
    <>
      {/* Google Analytics 4 — afterInteractive keeps it off the critical path */}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}

      {/* Microsoft Clarity — inline IIFE loaded after hydration */}
      {CLARITY_ID && (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${CLARITY_ID}");`,
          }}
        />
      )}

      {/*
       * Vercel Web Analytics & Speed Insights — rendered only in production
       * when analytics is enabled so debug scripts never load in local dev.
       */}
      {IS_PRODUCTION && (
        <>
          <VercelAnalytics mode="production" debug={false} />
          <SpeedInsights debug={false} />
        </>
      )}
    </>
  );
}
