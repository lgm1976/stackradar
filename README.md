# StackRadar — Programmatic SEO Platform

Independent comparisons and buyer's guides for B2B automation, workflow & agentic AI tools.
Built to grow organic traffic on autopilot and monetise via B2B affiliate commissions.

**Stack (100% free tier):** Next.js 14 (App Router) · Supabase (Postgres) · Vercel/Netlify/Cloudflare Pages · Tailwind CSS

## How it works — the "atom" engine

The whole site is generated from one small dataset by multiplying templates against data:

| Atom | Template | Source | Pages today |
|------|----------|--------|-------------|
| `[A] vs [B]` comparison | `app/compare/[slug]/page.tsx` | every unique tool pair | **190** |
| `Best [Theme] Tools for [Industry]` | `app/best/[slug]/page.tsx` | theme × industry (≥2 matching tools) | **18** |
| | | **TOTAL** | **208** |

Add tools to `data/tools.json` and the page count grows combinatorially:
comparisons scale as C(n,2) — 30 tools = 435 pages, 50 tools = 1,225 pages.

All pages are **statically pre-rendered** at build time (`generateStaticParams`), so hosting
is free, pages are fast, and every URL is crawlable with its own `<title>`, meta description,
JSON-LD structured data, and an entry in `sitemap.xml`.

## Data model

- `data/tools.json` — the 20 seed tools (name, category, pricing, pros/cons, rating, affiliate URL, best-for industries)
- `data/industries.json` — 8 target industries/roles
- `data/themes.json` — 6 use-case themes that group tools into useful listicles
- `lib/data.ts` — the combinatorial engine (pairs, theme×industry, affiliate links, SEO meta)
- `supabase/schema.sql` — optional Supabase tables (the build reads local JSON until you wire Supabase)

## Monetisation (0€ marketing)

- **Bridge links** — every CTA on all 208 pages points to an internal `/go/[slug]`
  route, never to the destination directly. The real destination lives in ONE
  place: `data/tools.json → affiliateUrl`, resolved by `app/go/[slug]/route.ts`.
  Today they 302-redirect to each tool's official URL (+`?ref` tag). When the
  affiliate networks (PartnerStack, etc.) approve, paste the affiliate URLs into
  `tools.json` — **the 208 pages never change**.
- **Distribution = the content itself** — SEO long-tail capture, no ad spend.
- Display ads (Ezoic/AdSense) and lead-gen can layer on once traffic matures.

### Swapping in real affiliate links later (single point of change)

1. Open `data/tools.json`.
2. Replace each tool's `affiliateUrl` with its affiliate-network URL.
3. Commit + push. Vercel redeploys; every CTA now points to the new destination.
   (If the URL already contains a `ref`/`aff`/`partner`/`via`/`fpr`/`aid` param,
   it is used as-is and not double-tagged.)

## Run locally

```bash
npm install
npm run count      # prints the programmatic page inventory (208)
npm run dev        # http://localhost:3000
npm run build      # static build -> ./out (or .next)
```

## Deploy (free, 0€ — no domain purchase) — exact steps

The base URL is **env-driven** (`lib/site.ts`). With no env var set it defaults
to the free Vercel subdomain `https://stackradar.vercel.app`, so the site is
100% functional on day one with zero cost.

```bash
# 1. From the project folder
cd stackradar
git init
git add .
git commit -m "StackRadar: 208-page programmatic SEO platform"

# 2. Create an empty repo on github.com (no README), then:
git remote add origin https://github.com/<you>/stackradar.git
git branch -M main
git push -u origin main
```

3. **Vercel:** vercel.com → Add New → Project → Import the GitHub repo →
   it auto-detects Next.js → **Deploy**. You get a live `*.vercel.app` URL —
   that's your home, free, no domain needed.
4. **(Optional, later) align the URL:** if your Vercel subdomain isn't exactly
   `stackradar.vercel.app`, add an env var in Vercel → Settings → Environment
   Variables: `NEXT_PUBLIC_SITE_URL = https://<your-project>.vercel.app`, then
   redeploy. Sitemap, robots and metadata update automatically.
5. **Google Search Console:** add the `*.vercel.app` URL as a property, verify
   with the HTML-tag method, then **Sitemaps → submit** `sitemap.xml`.
6. **Custom domain (whenever you want one):** set `NEXT_PUBLIC_SITE_URL` to it
   and add it under Vercel → Domains. Nothing else in code changes.

## Wire Supabase (optional, later)

1. Create a free Supabase project, run `supabase/schema.sql`.
2. Copy `.env.example` → `.env.local`, fill the URL + anon key.
3. `npm run seed` to push the JSON into Supabase.
4. Switch `lib/data.ts` reads from JSON to Supabase when you want a CMS-style backend.

## Previews

`previews/` holds two standalone HTML renders (no build needed) to eyeball the design:
`n8n-vs-make.html` and `best-data-enrichment-for-agencies.html`.
