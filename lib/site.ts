// Single source of truth for the site's base URL.
// Defaults to the free Vercel subdomain; override with NEXT_PUBLIC_SITE_URL
// (set it in Vercel project settings) when you add a custom domain later.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://stackradar.vercel.app";
