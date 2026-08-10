import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Osama Ahmed Farouk | Certified DevOps & Cloud Infrastructure Engineer",
  description: "Professional portfolio of Osama Ahmed Farouk, a Certified DevOps Engineer (CKA, AWS SAA-C03) specializing in Kubernetes, GitLab/Jenkins CI/CD automation, and Terraform Infrastructure as Code.",
  keywords: ["DevOps Engineer", "Cloud Infrastructure", "Kubernetes Specialist", "CKA", "AWS Solutions Architect", "Terraform IaC", "CI/CD Automation", "Osama Ahmed Farouk"],
  authors: [{ name: "Osama Ahmed Farouk" }],
  openGraph: {
    title: "Osama Ahmed Farouk | DevOps & Cloud Engineer Portfolio",
    description: " DevOps Engineer (CKA, AWS SAA-C03) designing scalable cloud infrastructure and managing Kubernetes clusters.",
    type: "website",
    locale: "en_US",
    url: "https://osamafarouk.dev", // Replace with custom domain later
    siteName: "Osama Farouk Portfolio",
  },
  robots: {
    index: true,
    follow: true,
  }
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
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
