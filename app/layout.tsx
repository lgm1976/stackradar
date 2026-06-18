import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "StackRadar — Compare B2B Automation & AI Tools",
    template: "%s | StackRadar",
  },
  description:
    "Independent comparisons and rankings of B2B automation, workflow and agentic AI tools. Find the right stack for your team.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  // Google Search Console verification — hardcoded so the meta tag is ALWAYS
  // baked into the build, independent of env vars or build cache. An env var
  // overrides it if you ever rotate the token.
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ||
      "_R05oWwYuQvU6qjKdQAS3W9DlRh2P4aSM9Z3nAvrLxU",
    // Bing Webmaster Tools — renders <meta name="msvalidate.01" content="...">
    other: {
      "msvalidate.01": "9D2B15C25148CF3260597873BB86B6A3",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-ink">
              Stack<span className="text-brand">Radar</span>
            </Link>
            <nav className="text-sm text-slate-600 flex gap-5">
              <Link href="/compare/" className="hover:text-brand">Comparisons</Link>
              <Link href="/best/" className="hover:text-brand">Best-for guides</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 mt-16">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500">
            <p className="mb-2">
              StackRadar may earn an affiliate commission when you sign up
              through links on this site, at no extra cost to you. This never
              affects our rankings.
            </p>
            <p>© {new Date().getFullYear()} StackRadar. Independent tool research.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
