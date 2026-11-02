"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/db/schema";
import { useCart } from "@/context/CartContext";
import { AUDIENCE_DISPLAY_MAP, formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const primaryImage = product.images[0] ?? "/images/hero-kingdom.jpg";
  const defaultVariant = product.variants?.options?.[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        category: product.category,
        image: primaryImage,
        variant: defaultVariant,
        priceCents: product.priceCents,
      },
      1,
      true
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className="group flex flex-col h-full">
      {/* 4:5 Editorial Image Container */}
      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#F3EFEA] border border-[#E6E0D6]">
        <Link
          href={`/products/${product.slug}`}
          className="block w-full h-full"
          aria-label={product.name}
        >
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          {product.badge ? (
            <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5]/92 backdrop-blur-xs border border-[#E6E0D6] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7C2D12]">
              {product.badge}
            </span>
          ) : (
            <span />
          )}

          <span className="px-2.5 py-1 rounded-full bg-[#1C1917]/75 backdrop-blur-xs text-[10px] font-medium uppercase tracking-[0.1em] text-[#FAF8F5]">
            {AUDIENCE_DISPLAY_MAP[product.audience] ?? "For Everyone"}
          </span>
        </div>

        {/* Hover Quick-Add Overlay (Desktop) + Touch Action */}
        <div className="absolute inset-x-3 bottom-3 opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-[0.1em] flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer ${
              justAdded
                ? "bg-[#2D5A3D] text-[#FAF8F5]"
                : "bg-[#FAF8F5]/95 hover:bg-[#7C2D12] text-[#1C1917] hover:text-[#FAF8F5] border border-[#E6E0D6]"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="pt-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-[#635B54]">
            <span className="uppercase tracking-[0.08em] text-[11px]">
              {product.subcategory}
            </span>
            <span className="inline-flex items-center gap-1 font-mono-num text-[11px] text-[#1C1917]">
              <Star className="w-3.5 h-3.5 fill-[#B48A3E] text-[#B48A3E]" />
              <span>{product.ratingAvg.toFixed(1)}</span>
              <span className="text-[#635B54]">({product.reviewCount})</span>
            </span>
          </div>

          <Link href={`/products/${product.slug}`} className="block mt-1.5">
            <h3 className="font-serif-display text-[21px] font-medium text-[#1C1917] group-hover:text-[#7C2D12] leading-snug transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#635B54] mt-1 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#E6E0D6]/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2 font-mono-num">
            <span className="text-sm font-semibold text-[#1C1917]">
              {formatPrice(product.priceCents)}
            </span>
            {product.compareAtPriceCents && (
              <span className="text-xs text-[#635B54]/75 line-through">
                {formatPrice(product.compareAtPriceCents)}
              </span>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7C2D12] hover:text-[#1C1917] transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
