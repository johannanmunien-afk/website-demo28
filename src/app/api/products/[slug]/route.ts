import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const data = await getProductBySlug(slug);

    if (!data) {
      return NextResponse.json(
        { error: "Product not found in the Kingdom" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch product detail:", error);
    return NextResponse.json(
      { error: "Unable to load product details" },
      { status: 500 }
    );
  }
}
