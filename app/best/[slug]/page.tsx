import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allBestFor,
  parseBestForSlug,
  bestForMeta,
} from "@/lib/data";
import { StarRating, AffiliateButton, Badge, JsonLd } from "@/components/Bits";

export function generateStaticParams() {
  return allBestFor().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const parsed = parseBestForSlug(params.slug);
  if (!parsed) return {};
  return bestForMeta(parsed.theme, parsed.industry, parsed.tools.length);
}

export default function BestForPage({ params }: { params: { slug: string } }) {
  const parsed = parseBestForSlug(params.slug);
  if (!parsed) notFound();
  const { theme, industry, tools } = parsed;
  const meta = bestForMeta(theme, industry, tools.length);

  return (
    <article className="prose-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: tools.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.name,
          })),
        }}
      />

      <p className="text-sm text-slate-500 mb-2">Buyer’s guide</p>
      <h1 className="text-3xl font-bold text-ink mb-4">
        {tools.length} Best {theme.name} Tools for {industry.name}
      </h1>
      <p className="text-lg text-slate-600 mb-6">{industry.blurb}</p>
      <p className="mb-10">
        {theme.intro} We ranked the top picks suited to{" "}
        {industry.name.toLowerCase()} on value, features and ease of adoption.
        Here’s how they stack up.
      </p>

      <ol className="space-y-6">
        {tools.map((t, i) => (
          <li
            key={t.slug}
            className={
              i === 0
                ? "rounded-xl border-2 border-brand p-6 relative shadow-sm"
                : "rounded-xl border border-slate-200 p-6"
            }
          >
            {i === 0 && (
              <span className="absolute -top-3 left-6 inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                ★ Top Pick
              </span>
            )}
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-xl font-bold text-ink">
                {i + 1}. {t.name}
              </h2>
              <StarRating rating={t.rating} />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge>{t.category}</Badge>
              <Badge>{t.pricing}</Badge>
              {t.freeTier && <Badge>Free tier</Badge>}
            </div>
            <p className="text-sm text-slate-600 mb-4">{t.description}</p>
            <p className="text-sm text-slate-700 mb-4">
              <strong>Why it fits {industry.name.toLowerCase()}:</strong>{" "}
              {t.pros[0]}.
            </p>
            <AffiliateButton tool={t} />
          </li>
        ))}
      </ol>

      <h2 className="text-2xl font-bold text-ink mt-12 mb-3">
        How to choose
      </h2>
      <p>
        For {industry.name.toLowerCase()}, the right {theme.name.toLowerCase()} tool
        comes down to budget, technical depth and how much you need to scale.
        {tools[0] ? ` Our top pick, ${tools[0].name}, is the safest starting point for most teams.` : ""}
      </p>
    </article>
  );
}
