import toolsData from "@/data/tools.json";
import industriesData from "@/data/industries.json";
import themesData from "@/data/themes.json";

// ---------- Types ----------
export interface Tool {
  slug: string;
  name: string;
  category: string;
  useCase: string;
  description: string;
  pricing: string;
  freeTier: boolean;
  rating: number;
  affiliateUrl: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
}

export interface Industry {
  slug: string;
  name: string;
  blurb: string;
}

export interface Theme {
  slug: string;
  name: string;
  members: string[];
  intro: string;
}

export const tools = toolsData as Tool[];
export const industries = industriesData as Industry[];
export const themes = themesData as Theme[];

// ---------- Lookups ----------
export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const getIndustry = (slug: string) =>
  industries.find((i) => i.slug === slug);

export const categories = Array.from(new Set(tools.map((t) => t.category)));

// ---------- Bridge link architecture ----------
// Every outbound CTA on all 208 pages points to an INTERNAL /go/[slug] route,
// never to the destination directly. The actual destination lives in ONE place
// (tools.json -> affiliateUrl, resolved by destinationUrl below and used by
// app/go/[slug]/route.ts). When the affiliate networks approve, we only swap
// the URLs in tools.json — the 208 pages never change.
export function affiliateLink(tool: Tool): string {
  return `/go/${tool.slug}`;
}

const TAG = process.env.NEXT_PUBLIC_AFFILIATE_TAG || "stackradar";

// Resolves the final destination for a slug. Today: the official clean URL.
// Later: paste the affiliate network URL into tools.json affiliateUrl and,
// if the network uses a query param, it is preserved automatically.
export function destinationUrl(slug: string): string | null {
  const tool = getTool(slug);
  if (!tool) return null;
  // Append our tracking tag only if the URL doesn't already carry params from
  // an affiliate network (avoids double-tagging once real links are added).
  if (/[?&](ref|aff|partner|via|fpr|aid|pc|pap_ref|fp_ref)=/i.test(tool.affiliateUrl)) {
    return tool.affiliateUrl;
  }
  const join = tool.affiliateUrl.includes("?") ? "&" : "?";
  return `${tool.affiliateUrl}${join}ref=${TAG}`;
}

// ====================================================================
// ATOM 1 — "[A] vs [B]" comparison pages
// Generates every unique unordered pair of tools.
// 20 tools -> C(20,2) = 190 pages.
// ====================================================================
export interface ComparisonParams {
  a: string;
  b: string;
  slug: string;
}

export function allComparisons(): ComparisonParams[] {
  const out: ComparisonParams[] = [];
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const a = tools[i].slug;
      const b = tools[j].slug;
      out.push({ a, b, slug: `${a}-vs-${b}` });
    }
  }
  return out;
}

export function parseComparisonSlug(slug: string) {
  const [a, b] = slug.split("-vs-");
  const toolA = getTool(a);
  const toolB = getTool(b);
  if (!toolA || !toolB) return null;
  return { toolA, toolB };
}

export function comparisonMeta(a: Tool, b: Tool) {
  return {
    title: `${a.name} vs ${b.name}: Which Automation Tool Wins in ${new Date().getFullYear()}?`,
    description: `${a.name} vs ${b.name} compared on pricing, features, ease of use and best use cases. See which automation tool fits your team — full breakdown and verdict.`,
  };
}

// Heuristics that read as "coding required" from the dataset.
const TECHNICAL_CATEGORIES = [
  "Technical Automation",
  "AI Development",
  "Agentic AI Framework",
  "Generative AI Core",
  "Advanced Reasoning AI",
];
const needsCoding = (t: Tool) => TECHNICAL_CATEGORIES.includes(t.category);

// Pull the first numeric price found in a pricing string, for rough comparison.
function priceSignal(t: Tool): number {
  if (t.pricing.toLowerCase().includes("free") && !/\$\d/.test(t.pricing)) return 0;
  const m = t.pricing.match(/\$(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : Number.POSITIVE_INFINITY; // "custom/enterprise" -> treat as high
}

export interface Faq {
  q: string;
  a: string;
}

// 3 dynamic FAQs that cross the two tools' variables. Keeps secondary
// combinations from being thin content and powers FAQPage rich results.
export function comparisonFaqs(a: Tool, b: Tool): Faq[] {
  const pa = priceSignal(a);
  const pb = priceSignal(b);
  const cheaper =
    pa === pb ? null : pa < pb ? a : b;

  const priceAnswer = cheaper
    ? `On entry pricing, ${cheaper.name} is generally the cheaper option (${cheaper === a ? a.pricing : b.pricing}) versus ${(cheaper === a ? b : a).name} (${(cheaper === a ? b : a).pricing}). Final cost depends on your usage volume, so check how each tool meters operations or seats.`
    : `${a.name} and ${b.name} sit at a similar entry price point (${a.pricing} vs ${b.pricing}), so the real cost difference comes down to how each meters usage at your volume.`;

  const codingAnswer =
    needsCoding(a) && needsCoding(b)
      ? `Both ${a.name} and ${b.name} are aimed at technical users and benefit from coding or developer skills to get the most out of them.`
      : needsCoding(a)
      ? `${a.name} is more technical and rewards some coding/developer skill, while ${b.name} is designed to be used with little or no code.`
      : needsCoding(b)
      ? `${b.name} is more technical and rewards some coding/developer skill, while ${a.name} is designed to be used with little or no code.`
      : `Neither ${a.name} nor ${b.name} requires coding for everyday use — both are built for no-code or low-code workflows.`;

  const freeAnswer =
    a.freeTier && b.freeTier
      ? `Yes — both ${a.name} and ${b.name} offer a free tier, so you can trial each before committing.`
      : a.freeTier
      ? `${a.name} offers a free tier; ${b.name} does not, though it may offer a trial. So you can start with ${a.name} at no cost.`
      : b.freeTier
      ? `${b.name} offers a free tier; ${a.name} does not, though it may offer a trial. So you can start with ${b.name} at no cost.`
      : `Neither ${a.name} nor ${b.name} has a permanent free tier, though both typically offer a trial or demo to evaluate them.`;

  return [
    { q: `Is ${a.name} cheaper than ${b.name}?`, a: priceAnswer },
    { q: `Do I need coding skills for ${a.name} or ${b.name}?`, a: codingAnswer },
    { q: `Does ${a.name} or ${b.name} have a free plan?`, a: freeAnswer },
  ];
}

// ====================================================================
// ATOM 2 — "Best [Theme] Tools for [Industry]" listicle pages
// We group tools by use-case THEME (not raw category) so each listicle has a
// useful set of 2-7 tools. A page is generated for every theme/industry combo
// where >= 2 of the theme's tools fit that industry — no thin pages.
// Themes (6) x Industries (8), filtered -> a few dozen rich listicle pages.
// ====================================================================
export interface BestForParams {
  theme: string;
  industry: string;
  slug: string;
}

export const getTheme = (slug: string) => themes.find((t) => t.slug === slug);

export function toolsForBestFor(themeSlug: string, industrySlug: string): Tool[] {
  const theme = getTheme(themeSlug);
  if (!theme) return [];
  return tools
    .filter(
      (t) => theme.members.includes(t.slug) && t.bestFor.includes(industrySlug)
    )
    .sort((x, y) => y.rating - x.rating);
}

export function allBestFor(): BestForParams[] {
  const out: BestForParams[] = [];
  for (const theme of themes) {
    for (const ind of industries) {
      const list = toolsForBestFor(theme.slug, ind.slug);
      if (list.length >= 2) {
        out.push({
          theme: theme.slug,
          industry: ind.slug,
          slug: `best-${theme.slug}-tools-for-${ind.slug}`,
        });
      }
    }
  }
  return out;
}

export function parseBestForSlug(slug: string) {
  const m = slug.match(/^best-(.+)-tools-for-(.+)$/);
  if (!m) return null;
  const theme = getTheme(m[1]);
  const industry = getIndustry(m[2]);
  if (!theme || !industry) return null;
  const list = toolsForBestFor(theme.slug, industry.slug);
  if (list.length < 2) return null;
  return { theme, industry, tools: list };
}

export function bestForMeta(theme: Theme, industry: Industry, count: number) {
  return {
    title: `${count} Best ${theme.name} Tools for ${industry.name} (${new Date().getFullYear()})`,
    description: `The best ${theme.name.toLowerCase()} tools for ${industry.name.toLowerCase()}, ranked and compared on price, features and fit. Hand-picked for ${industry.name.toLowerCase()}.`,
  };
}

// ---------- Build-time stats (used by scripts/count-pages.ts) ----------
export function pageStats() {
  return {
    tools: tools.length,
    industries: industries.length,
    themes: themes.length,
    categories: categories.length,
    comparisonPages: allComparisons().length,
    bestForPages: allBestFor().length,
    get total() {
      return this.comparisonPages + this.bestForPages;
    },
  };
}
