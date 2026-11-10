import coursesData from "../../content/courses.json";

export interface Course {
  /** Unique kebab-case identifier (used as HTML anchor id on /courses#<id>) */
  id: string;
  /** Full course or credential title */
  title: string;
  /** Training provider or issuing organization (e.g., "Udemy", "Amazon Web Services (AWS)") */
  provider: string;
  /** Completion year (e.g., 2026) — used for chronological sorting and year filter */
  year: number;
  /** Optional specific completion date if available on the credential */
  completionDate?: string | null;
  /** Public path to certificate or badge image under /public (e.g., "/assets/course-certificates/...") */
  certificateImage: string | null;
  /** Direct external certificate URL (e.g., Udemy certificate link or Google Drive PDF) */
  certificateUrl: string | null;
  /** Public credential verification URL (e.g., Credly badge URL, Udemy/Coursera verify URL) */
  verificationUrl: string | null;
  /** Optional link to the course curriculum/landing page */
  courseUrl?: string | null;
}

/**
 * Centralized list of completed professional courses, sorted chronologically
 * with the newest courses first (preserving relative order within the same year).
 */
export const courses: Course[] = [...(coursesData as Course[])].sort(
  (a, b) => Number(b.year) - Number(a.year)
);
