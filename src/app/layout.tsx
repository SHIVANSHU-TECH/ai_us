import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shivanshu's AI Resume | Conversational Portfolio",
  description:
    "Talk to Shivanshu Shukla's AI Resume Assistant about his full-stack, AI, RAG, and cloud engineering experience — grounded in verified resume data.",
  keywords: [
    "Shivanshu Shukla",
    "AI Resume",
    "Full Stack Engineer",
    "RAG",
    "Next.js",
    "CompanyBrain",
    "ClientScout AI",
  ],
  authors: [{ name: "Shivanshu Shukla" }],
  metadataBase: new URL("https://shivanshushukla.vercel.app"),
  openGraph: {
    title: "Shivanshu's AI Resume",
    description:
      "Conversational AI resume for Shivanshu Shukla — explore projects, architecture, and experience.",
    type: "website",
    images: [{ url: "/images/shivanshu.jpeg", width: 800, height: 800, alt: "Shivanshu Shukla" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivanshu's AI Resume",
    description:
      "Ask an AI assistant about Shivanshu Shukla's verified engineering profile.",
    images: ["/images/shivanshu.jpeg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
