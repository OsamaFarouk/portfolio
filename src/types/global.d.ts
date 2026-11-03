/// <reference types="next" />
/// <reference types="next/image-types/global" />

// GA4 gtag global type — avoids TypeScript errors when calling window.gtag
// from the analytics utility without importing a full @types/gtag.js package.
interface Window {
  gtag: (
    command: "config" | "event" | "js" | "set",
    targetIdOrEvent: string | Date,
    params?: Record<string, unknown>
  ) => void;
  dataLayer: unknown[];
}
