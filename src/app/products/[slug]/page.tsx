import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data) {
    return {
      title: "Offering Not Found | Esther's Kingdom",
    };
  }

  return {
    title: `${data.product.name} | Esther's Kingdom`,
    description: data.product.subtitle,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <ProductDetailClient
      product={data.product}
      initialReviews={data.reviews}
      relatedProducts={data.relatedProducts}
    />
  );
}
