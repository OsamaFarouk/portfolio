import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://osamafarouk.com"),
  title: "Osama Farouk | DevOps & Cloud Infrastructure Engineer",
  description:
    "Certified DevOps and Cloud Infrastructure Engineer with 5+ years of experience in AWS, Kubernetes, CI/CD, automation, observability, and production infrastructure.",
  keywords: [
    "Osama Farouk",
    "DevOps Engineer",
    "Cloud Infrastructure Engineer",
    "Kubernetes Specialist",
    "CKA Certified",
    "AWS Solutions Architect",
    "Terraform IaC",
    "CI/CD Automation",
    "Site Reliability Engineer",
  ],
  authors: [{ name: "Osama Ahmed Farouk", url: "https://osamafarouk.com" }],
  creator: "Osama Ahmed Farouk",
  publisher: "Osama Farouk Portfolio",
  alternates: {
    canonical: "https://osamafarouk.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Osama Farouk | DevOps & Cloud Infrastructure Engineer",
    description:
      "Certified DevOps and Cloud Infrastructure Engineer with 5+ years of experience in AWS, Kubernetes, CI/CD, automation, observability, and production infrastructure.",
    type: "website",
    locale: "en_US",
    url: "https://osamafarouk.com",
    siteName: "Osama Farouk Portfolio",
    images: [
      {
        url: "https://osamafarouk.com/og-image.png",
        secureUrl: "https://osamafarouk.com/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Osama Farouk | DevOps & Cloud Infrastructure Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Osama Farouk | DevOps & Cloud Infrastructure Engineer",
    description:
      "Certified DevOps and Cloud Infrastructure Engineer with 5+ years of experience in AWS, Kubernetes, CI/CD, automation, observability, and production infrastructure.",
    images: ["https://osamafarouk.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://osamafarouk.com/#person",
      "name": "Osama Ahmed Farouk",
      "alternateName": "Osama Farouk",
      "jobTitle": "DevOps & Cloud Infrastructure Engineer",
      "description":
        "Certified DevOps and Cloud Infrastructure Engineer with 5+ years of experience in AWS, Kubernetes, CI/CD, automation, observability, and production infrastructure.",
      "url": "https://osamafarouk.com",
      "image": "https://osamafarouk.com/images/osama-pic2.png",
      "sameAs": [
        "https://github.com/OsamaFarouk",
        "https://linkedin.com/in/osamafaroukk"
      ],
      "knowsAbout": [
        "DevOps",
        "Cloud Infrastructure",
        "Amazon Web Services (AWS)",
        "Kubernetes (CKA)",
        "Docker Containerization",
        "Terraform Infrastructure as Code",
        "CI/CD Automation",
        "Jenkins & GitLab CI",
        "Prometheus & Grafana Observability",
        "Linux System Administration"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://osamafarouk.com/#website",
      "url": "https://osamafarouk.com",
      "name": "Osama Farouk Portfolio",
      "description": "Certified DevOps and Cloud Infrastructure Engineer Portfolio",
      "publisher": {
        "@id": "https://osamafarouk.com/#person"
      },
      "inLanguage": "en-US"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary antialiased" suppressHydrationWarning>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
