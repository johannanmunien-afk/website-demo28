"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import type { Product, Review } from "@/db/schema";
import { useCart } from "@/context/CartContext";
import {
  AUDIENCE_DISPLAY_MAP,
  CATEGORY_DISPLAY_MAP,
  formatPrice,
} from "@/lib/format";
import { ProductCard } from "./ProductCard";

interface ProductDetailClientProps {
  product: Product;
  initialReviews: Review[];
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  initialReviews,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const images =
    product.images.length > 0 ? product.images : ["/images/hero-kingdom.jpg"];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const variantOptions = product.variants?.options ?? [];
  const [selectedVariant, setSelectedVariant] = useState<string>(
    variantOptions[0] ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [openAccordion, setOpenAccordion] = useState<string>("details");

  // Reviews State
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [ratingAvg, setRatingAvg] = useState<number>(product.ratingAvg);
  const [reviewCount, setReviewCount] = useState<number>(
    initialReviews.length || product.reviewCount
  );
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review Form Fields
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [authorAudience, setAuthorAudience] = useState("Everyone");
  const [authorLocation, setAuthorLocation] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleAddToBag = (goCheckout = false) => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        category: product.category,
        image: images[0],
        variant: selectedVariant || undefined,
        priceCents: product.priceCents,
      },
      quantity,
      !goCheckout
    );

    if (goCheckout) {
      router.push("/checkout");
      return;
    }

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  // Compute 5-star to 1-star breakdown dynamically
  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    for (const r of reviewsList) {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] ?? 0) + 1;
    }
    const total = reviewsList.length || 1;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star] ?? 0,
      percent:
        reviewsList.length === 0
          ? 0
          : Math.round(((counts[star] ?? 0) / total) * 100),
    }));
  }, [reviewsList]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    setSubmittingReview(true);

    const tagParts = [authorAudience];
    if (authorLocation.trim()) {
      tagParts.push(authorLocation.trim());
    }

    try {
      const res = await fetch(`/api/products/${product.slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          authorTag: tagParts.join(" · "),
          rating: formRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to submit review.");
      }

      setReviewsList((prev) => [data.review, ...prev]);
      setRatingAvg(data.ratingAvg);
      setReviewCount(data.reviewCount);
      setAuthorName("");
      setAuthorLocation("");
      setReviewTitle("");
      setReviewComment("");
      setFormRating(5);
      setShowReviewForm(false);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4500);
    } catch (err) {
      setReviewError(
        err instanceof Error ? err.message : "Unable to publish review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const savingsCents =
    product.compareAtPriceCents &&
    product.compareAtPriceCents > product.priceCents
      ? product.compareAtPriceCents - product.priceCents
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Trail */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-xs text-[#635B54] mb-8"
      >
        <Link href="/" className="hover:text-[#1C1917] transition-colors">
          Kingdom Home
        </Link>
        <span>/</span>
        <Link
          href={`/?category=${product.category}#catalog`}
          className="hover:text-[#1C1917] transition-colors"
        >
          {CATEGORY_DISPLAY_MAP[product.category] ?? product.category}
        </Link>
        <span>/</span>
        <span className="text-[#1C1917] font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main 2-Column Product Detail Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* LEFT: Interactive Multi-Angle Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/4.6] w-full rounded-2xl overflow-hidden bg-[#F3EFEA] border border-[#E6E0D6]">
            <img
              key={images[activeImageIdx]}
              src={images[activeImageIdx]}
              alt={`${product.name} — view ${activeImageIdx + 1}`}
              className="w-full h-full object-cover animate-fade-in"
            />

            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#FAF8F5]/95 backdrop-blur-xs border border-[#E6E0D6] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7C2D12]">
                {product.badge}
              </span>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx(
                      (prev) => (prev - 1 + images.length) % images.length
                    )
                  }
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF8F5]/90 hover:bg-[#1C1917] text-[#1C1917] hover:text-[#FAF8F5] border border-[#E6E0D6] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  aria-label="Previous product image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx((prev) => (prev + 1) % images.length)
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF8F5]/90 hover:bg-[#1C1917] text-[#1C1917] hover:text-[#FAF8F5] border border-[#E6E0D6] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  aria-label="Next product image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Selector Strip */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5">
              {images.map((imgUrl, idx) => {
                const isSelected = idx === activeImageIdx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden bg-[#F3EFEA] border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#7C2D12] ring-2 ring-[#7C2D12]/20"
                        : "border-[#E6E0D6] opacity-75 hover:opacity-100"
                    }`}
                    aria-label={`Select angle ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Sticky Purchase & Ritual Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          {/* Audience & Subcategory Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#F3EFEA] border border-[#E6E0D6] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#635B54]">
              {product.subcategory}
            </span>
            {product.audiences.map((aud) => (
              <Link
                key={aud}
                href={`/?audience=${aud}#catalog`}
                className="px-2.5 py-1 rounded-full bg-[#7C2D12]/10 hover:bg-[#7C2D12] text-[#7C2D12] hover:text-[#FAF8F5] text-[11px] font-medium transition-colors"
              >
                {AUDIENCE_DISPLAY_MAP[aud] ?? aud}
              </Link>
            ))}
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#1C1917] leading-[1.12]">
              {product.name}
            </h1>
            <p className="text-sm text-[#635B54] mt-2">{product.subtitle}</p>
          </div>

          {/* Rating & Price Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E6E0D6]">
            <div className="flex items-baseline gap-3 font-mono-num">
              <span className="text-2xl font-semibold text-[#1C1917]">
                {formatPrice(product.priceCents)}
              </span>
              {product.compareAtPriceCents && (
                <span className="text-sm text-[#635B54]/75 line-through">
                  {formatPrice(product.compareAtPriceCents)}
                </span>
              )}
              {savingsCents > 0 && (
                <span className="px-2 py-0.5 rounded bg-[#2D5A3D]/12 text-[#2D5A3D] text-xs font-semibold">
                  Save {formatPrice(savingsCents)}
                </span>
              )}
            </div>

            <a
              href="#reviews"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1C1917] hover:text-[#7C2D12] transition-colors"
            >
              <div className="flex items-center text-[#B48A3E]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(ratingAvg)
                        ? "fill-[#B48A3E] text-[#B48A3E]"
                        : "text-[#E6E0D6]"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono-num font-semibold">
                {ratingAvg.toFixed(1)}
              </span>
              <span className="text-[#635B54] underline underline-offset-2">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </a>
          </div>

          {/* Editorial Description */}
          <p className="text-sm sm:text-[15px] text-[#1C1917]/90 leading-relaxed">
            {product.description}
          </p>

          {/* Key Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <ul className="space-y-2 py-1">
              {product.highlights.map((hl, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#635B54]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B48A3E] shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Variant Selector */}
          {variantOptions.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-[0.12em] text-[#635B54]">
                  {product.variants.label}
                </span>
                <span className="font-medium text-[#1C1917]">
                  {selectedVariant}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {variantOptions.map((option) => {
                  const active = selectedVariant === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedVariant(option)}
                      className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-[#1C1917] text-[#FAF8F5] border border-[#1C1917] shadow-xs"
                          : "bg-[#F3EFEA] text-[#1C1917] border border-[#E6E0D6] hover:border-[#7C2D12]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Kingdom Bag Controls */}
          <div className="pt-3 space-y-3">
            <div className="flex items-stretch gap-3">
              {/* Quantity Stepper */}
              <div className="inline-flex items-center rounded-lg border border-[#E6E0D6] bg-[#F3EFEA] px-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-[#1C1917] hover:text-[#7C2D12] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono-num text-sm font-semibold w-8 text-center text-[#1C1917]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-12 flex items-center justify-center text-[#1C1917] hover:text-[#7C2D12] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Add to Bag CTA */}
              <button
                type="button"
                onClick={() => handleAddToBag(false)}
                className={`flex-1 py-4 px-6 rounded-lg text-xs font-semibold uppercase tracking-[0.12em] flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer ${
                  addedFeedback
                    ? "bg-[#2D5A3D] text-[#FAF8F5]"
                    : "bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5]"
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Kingdom Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add to Bag ·{" "}
                      <span className="font-mono-num">
                        {formatPrice(product.priceCents * quantity)}
                      </span>
                    </span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAddToBag(true)}
              className="w-full py-3.5 px-6 rounded-lg bg-[#F3EFEA] hover:bg-[#1C1917] text-[#1C1917] hover:text-[#FAF8F5] border border-[#E6E0D6] text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
            >
              Buy Now · Express Royal Checkout
            </button>
          </div>

          {/* Fulfillment Assurance Row */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#635B54]">
            <div className="p-3 rounded-xl bg-[#F3EFEA]/75 border border-[#E6E0D6] flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#7C2D12] shrink-0" />
              <span>Free courier shipping $75+</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F3EFEA]/75 border border-[#E6E0D6] flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#2D5A3D] shrink-0" />
              <span>In stock · Ships in 24h</span>
            </div>
          </div>

          {/* Expandable Details, Ritual & Shipping Accordions */}
          <div className="divide-y divide-[#E6E0D6] border-t border-b border-[#E6E0D6] pt-1">
            {[
              {
                id: "details",
                title:
                  product.category === "beauty"
                    ? "Ingredients, Actives & Vessel"
                    : "Materials, Dimensions & Care",
                body: product.detailsAndCare,
              },
              {
                id: "ritual",
                title: "The Daily Kingdom Ritual",
                body: product.ritualNotes,
              },
              {
                id: "shipping",
                title: "Courier Delivery & 30-Day Guarantee",
                body: "Orders placed before 2:00 PM dispatch same-day from our studio in plastic-free protective packaging. Complimentary Kingdom Courier shipping is automatically applied to all bags of $75 or more. Unopened or gently tested items are eligible for effortless returns within 30 days.",
              },
            ].map((section) => {
              const isOpen = openAccordion === section.id;
              return (
                <div key={section.id} className="py-4">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion(isOpen ? "" : section.id)
                    }
                    className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1917] hover:text-[#7C2D12] transition-colors cursor-pointer"
                  >
                    <span>{section.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#635B54] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-[#635B54] leading-relaxed animate-fade-in">
                      {section.body}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CUSTOMER REVIEWS & RATING BREAKDOWN SECTION */}
      <section
        id="reviews"
        className="scroll-mt-24 mt-24 pt-16 border-t border-[#E6E0D6]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Summary & Distribution */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C2D12]">
                Verified Reflections
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-medium text-[#1C1917] mt-1.5">
                Community Reviews
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-[#F3EFEA] border border-[#E6E0D6] space-y-5">
              <div className="flex items-center gap-4">
                <span className="font-serif-display text-5xl font-semibold text-[#1C1917]">
                  {ratingAvg.toFixed(1)}
                </span>
                <div>
                  <div className="flex items-center gap-1 text-[#B48A3E]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(ratingAvg)
                            ? "fill-[#B48A3E] text-[#B48A3E]"
                            : "text-[#D6CFC8]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#635B54] mt-1">
                    Based on{" "}
                    <strong className="font-mono-num text-[#1C1917]">
                      {reviewCount}
                    </strong>{" "}
                    verified {reviewCount === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>

              {/* 5-star to 1-star bar chart */}
              <div className="space-y-2">
                {ratingBreakdown.map((row) => (
                  <div
                    key={row.star}
                    className="flex items-center gap-3 text-xs"
                  >
                    <span className="font-mono-num w-10 text-[#1C1917] font-medium">
                      {row.star} ★
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-[#E6E0D6] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#B48A3E] transition-all duration-500"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="font-mono-num w-8 text-right text-[#635B54]">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm((prev) => !prev)}
                className="w-full py-3 px-4 rounded-lg bg-[#1C1917] hover:bg-[#7C2D12] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer"
              >
                {showReviewForm ? "Close Review Form" : "Write a Review"}
              </button>
            </div>
          </div>

          {/* Right: Review Submission Form + Review Cards Feed */}
          <div className="lg:col-span-8 space-y-6">
            {reviewSuccess && (
              <div className="p-4 rounded-xl bg-[#2D5A3D]/12 border border-[#2D5A3D]/30 text-[#2D5A3D] text-sm flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Thank you for sharing your reflection with Esther&rsquo;s
                  Kingdom! Your review is now live.
                </span>
              </div>
            )}

            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="p-6 sm:p-8 rounded-2xl bg-[#F3EFEA] border border-[#E6E0D6] space-y-5 animate-fade-up"
              >
                <h3 className="font-serif-display text-2xl font-medium text-[#1C1917]">
                  Share Your Experience
                </h3>

                {/* Star Rating Picker */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#635B54] mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const active = (hoverRating ?? formRating) >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setFormRating(starVal)}
                          className="p-1 cursor-pointer"
                          aria-label={`Rate ${starVal} stars`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              active
                                ? "fill-[#B48A3E] text-[#B48A3E]"
                                : "text-[#D6CFC8]"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-xs font-medium text-[#635B54]">
                      {formRating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g., Naomi Clarke"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                      Shopper Profile
                    </label>
                    <select
                      value={authorAudience}
                      onChange={(e) => setAuthorAudience(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                    >
                      <option value="Verified Buyer">Verified Buyer</option>
                      <option value="Young Adult">Young Adult</option>
                      <option value="Adult">Adult</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Everyone">Everyone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                      City / State
                    </label>
                    <input
                      type="text"
                      value={authorLocation}
                      onChange={(e) => setAuthorLocation(e.target.value)}
                      placeholder="e.g., Austin, TX"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your impression in a few words"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                    Your Reflection *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="How does this piece fit into your home or beauty routine?"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                  />
                </div>

                {reviewError && (
                  <p className="text-xs text-[#991B1B] font-medium">
                    {reviewError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] hover:text-[#1C1917] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-3 rounded-lg bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {submittingReview ? "Publishing..." : "Publish Review"}
                  </button>
                </div>
              </form>
            )}

            {/* Review Cards */}
            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <article
                  key={rev.id}
                  className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D6] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[#B48A3E]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-[#B48A3E] text-[#B48A3E]"
                              : "text-[#E6E0D6]"
                          }`}
                        />
                      ))}
                    </div>

                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D5A3D]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Kingdom Buyer</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-display text-xl font-medium text-[#1C1917]">
                    {rev.title}
                  </h3>

                  <p className="text-sm text-[#635B54] leading-relaxed">
                    {rev.comment}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#635B54]">
                    <div>
                      <span className="font-semibold text-[#1C1917]">
                        {rev.authorName}
                      </span>{" "}
                      <span>· {rev.authorTag}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETE THE SANCTUARY: RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-16 border-t border-[#E6E0D6]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C2D12]">
                Curated Pairings
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-medium text-[#1C1917] mt-1.5">
                Complete Your Sanctuary
              </h2>
            </div>
            <Link
              href="/#catalog"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7C2D12] hover:text-[#1C1917]"
            >
              Explore Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-10">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
