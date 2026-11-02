/**
 * GA4 custom event tracking utility.
 *
 * All portfolio interaction events flow through this single function so that:
 *  - There is one place to add consent guards in the future.
 *  - Every call is a no-op when GA4 is not initialised (dev / preview).
 *  - No personal or sensitive information is ever forwarded.
 *
 * Usage:
 *   import { trackEvent } from "@/utils/analytics";
 *   trackEvent("resume_download", { file_name: "Osama_Farouk_DevOps_Resume.pdf" });
 */

type GtagEventParams = Record<string, string | number | boolean | undefined>;

/**
 * Fire a GA4 custom event.
 * Silently skips when `window.gtag` is not available (dev / Clarity-only builds).
 */
export function trackEvent(eventName: string, params?: GtagEventParams): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params ?? {});
}

// ─── Typed event helpers ────────────────────────────────────────────────────

export const analytics = {
  /** Visitor opens a project detail page. Fired once per page mount. */
  projectView(projectName: string, projectSlug: string) {
    trackEvent("project_view", { project_name: projectName, project_slug: projectSlug });
  },

  /** Visitor navigates to /resume. Fired once per page mount. */
  resumeView(pagePath: string) {
    trackEvent("resume_view", { page_path: pagePath });
  },

  /** Visitor clicks the download‑attribute PDF link. */
  resumeDownload(fileName: string) {
    trackEvent("resume_download", { file_name: fileName });
  },

  /** Visitor opens the full‑resolution architecture diagram. */
  architectureView(projectName: string) {
    trackEvent("architecture_view", { project_name: projectName });
  },

  /** Visitor clicks a LinkedIn profile link. */
  linkedinClick(linkLocation: string) {
    trackEvent("linkedin_click", { link_location: linkLocation });
  },

  /**
   * Visitor clicks a GitHub profile or repository link.
   * `projectName` is optional — omit it for profile-level clicks.
   */
  githubClick(linkLocation: string, projectName?: string) {
    trackEvent("github_click", { link_location: linkLocation, project_name: projectName });
  },

  /**
   * Visitor initiates a contact action.
   * `contactMethod` must be a generic label only — never an email address.
   * Examples: "email_link", "form_submit", "linkedin_link", "github_link",
   *           "phone_copy", "email_copy"
   */
  contactClick(contactMethod: string) {
    trackEvent("contact_click", { contact_method: contactMethod });
  },

  /**
   * Visitor executes a meaningful terminal command.
   * `actionType` is the sanitised command category — never raw input.
   * Examples: "navigate_project", "navigate_experience", "view_skills",
   *           "run_help", "clear_terminal", "autocomplete"
   */
  terminalInteraction(actionType: string) {
    trackEvent("terminal_interaction", { action_type: actionType });
  },
} as const;
