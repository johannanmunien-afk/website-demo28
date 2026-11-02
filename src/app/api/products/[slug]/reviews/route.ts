import { NextRequest, NextResponse } from "next/server";
import { createProductReview } from "@/lib/queries";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const authorName = String(body.authorName ?? "").trim();
    const authorTag = String(body.authorTag ?? "Verified Kingdom Guest").trim();
    const title = String(body.title ?? "").trim();
    const comment = String(body.comment ?? "").trim();
    const rating = Number(body.rating ?? 5);

    if (!authorName || !title || !comment) {
      return NextResponse.json(
        { error: "Please provide your name, review headline, and reflections." },
        { status: 400 }
      );
    }

    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5 stars." },
        { status: 400 }
      );
    }

    const result = await createProductReview({
      slug,
      authorName,
      authorTag,
      rating,
      title,
      comment,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Failed to submit review:", error);
    return NextResponse.json(
      { error: "Unable to publish review right now." },
      { status: 500 }
    );
  }
}
