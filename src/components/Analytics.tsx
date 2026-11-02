"use client";

import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID as string;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID as string;
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";

/**
 * Loads Google Analytics 4, Microsoft Clarity, and Vercel Web Analytics.
 *
 * All three tools are omitted entirely from the DOM unless
 * NEXT_PUBLIC_ANALYTICS_ENABLED is set to "true" in the environment,
 * which ensures development and local testing traffic is never tracked.
 *
 * GA4 pageview tracking for client-side navigations is handled
 * automatically by gtag.js Enhanced Measurement (no manual router
 * instrumentation required).
 *
 * Clarity session recordings and heatmaps begin automatically after the
 * script loads.
 *
 * Vercel Analytics automatically tracks page views and client-side
 * navigation via the App Router without additional configuration.
 * It requires the "Analytics" feature to be enabled from the Vercel
 * dashboard: Project → Analytics → Enable.
 *
 * NOTE: Vercel Analytics on the Hobby plan provides 2,500 events/month.
 * No extra environment variable is needed — it is activated at the
 * project level in the Vercel dashboard.
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
       * Vercel Web Analytics — tracks page views and navigation automatically.
       * mode="auto" activates only in Vercel production deployments;
       * it is inert in all other environments.
       */}
      <VercelAnalytics mode="auto" />
    </>
  );
}
