"use client";

import { useEffect } from "react";
import { analytics } from "@/utils/analytics";

interface ProjectAnalyticsTrackerProps {
  projectName: string;
  projectSlug: string;
}

/**
 * Fires a single `project_view` GA4 event on mount.
 * Renders nothing — purely a side-effect component.
 */
export default function ProjectAnalyticsTracker({
  projectName,
  projectSlug,
}: ProjectAnalyticsTrackerProps) {
  useEffect(() => {
    analytics.projectView(projectName, projectSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
