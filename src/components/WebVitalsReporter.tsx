"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Forwards Core Web Vitals metrics to Google Analytics 4.
 *
 * Metrics reported: FCP, LCP, CLS, FID, INP, TTFB.
 *
 * Each event is sent as non_interaction so it does not skew bounce rate.
 * CLS values are multiplied by 1000 to convert the float to an integer,
 * as GA4 requires integer values for the `value` parameter.
 *
 * This component is a no-op when GA4 has not been initialised (i.e. when
 * NEXT_PUBLIC_ANALYTICS_ENABLED is not "true").
 */
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", metric.name, {
      // GA4 requires integer values; CLS is a decimal — scale it up.
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      // Unique ID for the current page load — useful for percentile analysis.
      event_label: metric.id,
      // non_interaction prevents these events from affecting bounce rate.
      non_interaction: true,
    });
  });

  return null;
}
