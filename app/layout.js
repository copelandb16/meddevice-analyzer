import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import NavAuth from "./components/NavAuth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "AlertIQ",
    template: "%s | AlertIQ",
  },
  description:
    "Instant violation analysis, resolution pathways, and ready-to-submit response letters for importers, brokers and compliance teams.",
  applicationName: "AlertIQ",
  openGraph: {
    title: "AlertIQ",
    description:
      "Instant violation analysis, resolution pathways, and ready-to-submit response letters for importers, brokers and compliance teams.",
    siteName: "AlertIQ",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "AlertIQ",
    description:
      "Instant violation analysis, resolution pathways, and ready-to-submit response letters for importers, brokers and compliance teams.",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className} bg-white text-neutral-950 antialiased`}
        >
          <div className="flex min-h-screen flex-col bg-white">
            <header className="border-b border-neutral-200 bg-white">
              <nav className="mx-auto flex h-14 max-w-6xl items-center px-6">
                <Link
                  href="/"
                  className="text-[15px] font-semibold tracking-tight text-neutral-950"
                >
                  AlertIQ
                </Link>
                <NavAuth />
              </nav>
            </header>

            <div className="flex-1">{children}</div>

            <footer className="border-t border-neutral-200 bg-white">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-6 py-10 text-[13px] text-neutral-600">
                <span className="font-medium text-neutral-900">AlertIQ</span>
                <span aria-hidden className="text-neutral-300">
                  ·
                </span>
                <Link href="/privacy" className="text-neutral-900 underline underline-offset-4">
                  Privacy policy
                </Link>
                <span aria-hidden className="text-neutral-300">
                  ·
                </span>
                <a href="mailto:hello@alertiq.com" className="text-neutral-900 underline underline-offset-4">
                  hello@alertiq.com
                </a>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
