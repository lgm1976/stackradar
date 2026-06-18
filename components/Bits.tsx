import { Tool, affiliateLink } from "@/lib/data";

export function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="text-amber-500" aria-label={`${rating} out of 5`}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      <span className="text-slate-400 ml-1 text-sm">{rating.toFixed(1)}</span>
    </span>
  );
}

export function AffiliateButton({ tool, label }: { tool: Tool; label?: string }) {
  return (
    <a
      href={affiliateLink(tool)}
      target="_blank"
      rel="sponsored nofollow noopener"
      className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
    >
      {label || `Try ${tool.name} →`}
    </a>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-slate-100 text-slate-600 text-xs px-2.5 py-1">
      {children}
    </span>
  );
}

export function ProsCons({ tool }: { tool: Tool }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold text-emerald-700 mb-2">Pros</h4>
        <ul className="space-y-1 text-sm text-slate-700">
          {tool.pros.map((p) => (
            <li key={p}>✓ {p}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-rose-700 mb-2">Cons</h4>
        <ul className="space-y-1 text-sm text-slate-700">
          {tool.cons.map((c) => (
            <li key={c}>✕ {c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// JSON-LD structured data improves SEO rich results.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
