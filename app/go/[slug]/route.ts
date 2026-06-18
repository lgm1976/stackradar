import { NextResponse } from "next/server";
import { tools, destinationUrl } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

// Pre-generate one redirect endpoint per tool so the route works on static
// hosting and is crawl-safe.
export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

// Bridge redirect: /go/[slug] -> the tool's destination (official URL today,
// affiliate URL once approved). 302 = temporary, so links aren't cached as
// permanent and we can swap destinations freely.
export function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const dest = destinationUrl(params.slug);
  if (!dest) {
    return NextResponse.redirect(new URL("/", SITE_URL), 302);
  }
  return NextResponse.redirect(dest, 302);
}
