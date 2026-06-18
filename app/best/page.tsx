import Link from "next/link";
import { allBestFor } from "@/lib/data";

export const metadata = {
  title: "All Best-for Buyer’s Guides",
  description: "Every 'best tools for' buyer's guide on StackRadar, by category and industry.",
};

export default function BestIndex() {
  const guides = allBestFor();
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink mb-6">
        All buyer’s guides ({guides.length})
      </h1>
      <ul className="grid sm:grid-cols-2 gap-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/best/${g.slug}/`} className="text-brand hover:underline capitalize">
              {g.slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
