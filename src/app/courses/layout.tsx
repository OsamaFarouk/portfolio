import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Technical Courses & Training | Osama Farouk",
  description:
    "Completed technical courses and professional training across AWS Cloud, Kubernetes, DevOps, CI/CD, Infrastructure, and Systems Engineering.",
  alternates: {
    canonical: "https://osamafarouk.com/courses",
  },
  openGraph: {
    title: "Professional Technical Courses & Training | Osama Farouk",
    description:
      "Completed technical courses and professional training across AWS Cloud, Kubernetes, DevOps, CI/CD, Infrastructure, and Systems Engineering.",
    url: "https://osamafarouk.com/courses",
    type: "website",
    images: [
      {
        url: "https://osamafarouk.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Osama Farouk Technical Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Technical Courses & Training | Osama Farouk",
    description:
      "Completed technical courses and professional training across AWS Cloud, Kubernetes, DevOps, CI/CD, Infrastructure, and Systems Engineering.",
    images: ["https://osamafarouk.com/og-image.png"],
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
