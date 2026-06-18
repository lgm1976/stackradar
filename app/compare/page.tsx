import Link from "next/link";
import { allComparisons } from "@/lib/data";

export const metadata = {
  title: "All Automation Tool Comparisons",
  description: "Every head-to-head automation and AI tool comparison on StackRadar.",
};

export default function CompareIndex() {
  const comparisons = allComparisons();
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink mb-6">
        All comparisons ({comparisons.length})
      </h1>
      <ul className="grid sm:grid-cols-2 gap-2">
        {comparisons.map((c) => (
          <li key={c.slug}>
            <Link href={`/compare/${c.slug}/`} className="text-brand hover:underline">
              {c.a} vs {c.b}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
