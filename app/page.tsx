import Link from "next/link";
import { tools, allComparisons, allBestFor, pageStats } from "@/lib/data";

export default function Home() {
  const stats = pageStats();
  const featuredComparisons = allComparisons().slice(0, 9);
  const featuredGuides = allBestFor().slice(0, 9);

  return (
    <div>
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold text-ink mb-4">
          Find the right automation stack — without the guesswork
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Independent, side-by-side comparisons of {stats.tools} leading B2B
          automation, workflow and agentic AI tools. {stats.total}+ guides and
          counting.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-ink mb-4">Popular comparisons</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {featuredComparisons.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}/`}
              className="rounded-lg border border-slate-200 p-4 hover:border-brand hover:shadow-sm transition"
            >
              {c.a} vs {c.b}
            </Link>
          ))}
        </div>
        <Link href="/compare/" className="inline-block mt-4 text-brand font-medium">
          See all comparisons →
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-ink mb-4">Best-for guides</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {featuredGuides.map((g) => (
            <Link
              key={g.slug}
              href={`/best/${g.slug}/`}
              className="rounded-lg border border-slate-200 p-4 hover:border-brand hover:shadow-sm transition capitalize"
            >
              {g.slug.replace(/-/g, " ")}
            </Link>
          ))}
        </div>
        <Link href="/best/" className="inline-block mt-4 text-brand font-medium">
          See all guides →
        </Link>
      </section>
    </div>
  );
}
