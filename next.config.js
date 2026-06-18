/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Hosting stays at 0€ on Vercel's free tier. The 208 content pages are
  // statically pre-rendered (generateStaticParams) for perfect SEO, while the
  // /go/[slug] bridge runs as a tiny serverless redirect.
  // NOTE: do NOT set `output: 'export'` — it would disable the /go redirect.
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
