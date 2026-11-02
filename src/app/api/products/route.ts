import { NextRequest, NextResponse } from "next/server";
import { getFilteredProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const audience = searchParams.get("audience") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    const minPriceCents =
      minPriceParam !== null && minPriceParam !== ""
        ? Math.round(Number(minPriceParam) * 100)
        : undefined;
    const maxPriceCents =
      maxPriceParam !== null && maxPriceParam !== ""
        ? Math.round(Number(maxPriceParam) * 100)
        : undefined;

    const items = await getFilteredProducts({
      category,
      audience,
      search,
      minPriceCents,
      maxPriceCents,
      sort,
    });

    return NextResponse.json({ products: items });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Unable to load catalog offerings" },
      { status: 500 }
    );
  }
}
