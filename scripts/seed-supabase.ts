// One-time seed: pushes local JSON into Supabase.
// Usage: set env vars in .env.local, then `npm run seed`.
import { createClient } from "@supabase/supabase-js";
import tools from "../data/tools.json";
import industries from "../data/industries.json";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function main() {
  if (!url || !key) throw new Error("Missing Supabase env vars");
  const db = createClient(url, key);

  const toolRows = (tools as any[]).map((t) => ({
    slug: t.slug,
    name: t.name,
    category: t.category,
    use_case: t.useCase,
    description: t.description,
    pricing: t.pricing,
    free_tier: t.freeTier,
    rating: t.rating,
    affiliate_url: t.affiliateUrl,
    pros: t.pros,
    cons: t.cons,
    best_for: t.bestFor,
  }));

  const { error: e1 } = await db.from("tools").upsert(toolRows, { onConflict: "slug" });
  if (e1) throw e1;
  const { error: e2 } = await db.from("industries").upsert(industries as any[], { onConflict: "slug" });
  if (e2) throw e2;

  console.log(`Seeded ${toolRows.length} tools and ${(industries as any[]).length} industries.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
