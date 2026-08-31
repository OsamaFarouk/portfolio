import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevOps & Cloud Infrastructure Engineer Résumé | Osama Farouk",
  description:
    "Official professional résumé and technical experience record for Osama Farouk, Certified DevOps & Cloud Infrastructure Engineer (CKA, AWS SAA-C03).",
  alternates: {
    canonical: "https://osamafarouk.com/resume",
  },
  openGraph: {
    title: "DevOps & Cloud Infrastructure Engineer Résumé | Osama Farouk",
    description:
      "Official professional résumé and technical experience record for Osama Farouk, Certified DevOps & Cloud Infrastructure Engineer (CKA, AWS SAA-C03).",
    url: "https://osamafarouk.com/resume",
    type: "website",
    images: [
      {
        url: "https://osamafarouk.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Osama Farouk DevOps Engineer Résumé",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOps & Cloud Infrastructure Engineer Résumé | Osama Farouk",
    description:
      "Official professional résumé and technical experience record for Osama Farouk, Certified DevOps & Cloud Infrastructure Engineer (CKA, AWS SAA-C03).",
    images: ["https://osamafarouk.com/og-image.png"],
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
