import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allComparisons,
  parseComparisonSlug,
  comparisonMeta,
  comparisonFaqs,
  affiliateLink,
  Tool,
} from "@/lib/data";
import { StarRating, AffiliateButton, ProsCons, JsonLd } from "@/components/Bits";

// Pre-render ALL comparison pages at build time (static, free, fast, SEO-ready).
export function generateStaticParams() {
  return allComparisons().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const parsed = parseComparisonSlug(params.slug);
  if (!parsed) return {};
  return comparisonMeta(parsed.toolA, parsed.toolB);
}

function Row({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-3 pr-4 font-medium text-slate-500 w-1/4">{label}</td>
      <td className="py-3 px-4">{a}</td>
      <td className="py-3 px-4">{b}</td>
    </tr>
  );
}

function verdict(a: Tool, b: Tool): string {
  const winner = a.rating >= b.rating ? a : b;
  const other = winner === a ? b : a;
  return `For most teams, ${winner.name} edges ahead thanks to its strength in ${winner.useCase.toLowerCase()}. That said, ${other.name} is the better pick if your priority is ${other.useCase.toLowerCase()} — choose based on the job you need done, not the brand.`;
}

export default function ComparisonPage({ params }: { params: { slug: string } }) {
  const parsed = parseComparisonSlug(params.slug);
  if (!parsed) notFound();
  const { toolA, toolB } = parsed;
  const meta = comparisonMeta(toolA, toolB);
  const faqs = comparisonFaqs(toolA, toolB);

  return (
    <article className="prose-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.title,
          description: meta.description,
        }}
      />
      {/* FAQPage structured data for rich results */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      <p className="text-sm text-slate-500 mb-2">Comparison</p>
      <h1 className="text-3xl font-bold text-ink mb-4">
        {toolA.name} vs {toolB.name}
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        A side-by-side look at <strong>{toolA.name}</strong> ({toolA.category})
        and <strong>{toolB.name}</strong> ({toolB.category}) — pricing, features,
        ideal users and our verdict.
      </p>

      {/* Quick comparison table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="py-3 pl-4"></th>
              <th className="py-3 px-4 font-bold text-ink">{toolA.name}</th>
              <th className="py-3 px-4 font-bold text-ink">{toolB.name}</th>
            </tr>
          </thead>
          <tbody>
            <Row label="Category" a={toolA.category} b={toolB.category} />
            <Row label="Best for" a={toolA.useCase} b={toolB.useCase} />
            <Row label="Pricing" a={toolA.pricing} b={toolB.pricing} />
            <Row
              label="Free tier"
              a={toolA.freeTier ? "Yes" : "No"}
              b={toolB.freeTier ? "Yes" : "No"}
            />
            <Row
              label="Rating"
              a={`${toolA.rating} / 5`}
              b={`${toolB.rating} / 5`}
            />
            <tr>
              <td className="py-3 pr-4 font-medium text-slate-500">Action</td>
              {[toolA, toolB].map((t) => (
                <td key={t.slug} className="py-3 px-4">
                  <a
                    href={affiliateLink(t)}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="inline-flex items-center gap-1 rounded-md bg-brand px-3 py-1.5 text-white text-xs font-semibold hover:bg-brand-dark transition-colors"
                  >
                    Visit {t.name} →
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Side-by-side cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {[toolA, toolB].map((t) => (
          <div key={t.slug} className="rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-ink">{t.name}</h2>
              <StarRating rating={t.rating} />
            </div>
            <p className="text-sm text-slate-600 mb-4">{t.description}</p>
            <ProsCons tool={t} />
            <div className="mt-5">
              <AffiliateButton tool={t} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-ink mb-3">Our verdict</h2>
      <p>{verdict(toolA, toolB)}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <AffiliateButton tool={toolA} label={`Get started with ${toolA.name}`} />
        <AffiliateButton tool={toolB} label={`Get started with ${toolB.name}`} />
      </div>

      {/* Dynamic FAQ block — cross-variable, prevents thin content */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-ink mb-5">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((f) => (
            <div key={f.q} className="py-5">
              <h3 className="font-semibold text-ink mb-2">{f.q}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
