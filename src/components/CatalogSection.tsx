"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/db/schema";
import { AUDIENCE_OPTIONS, CATEGORY_OPTIONS } from "@/lib/format";
import { ProductCard } from "./ProductCard";

type PriceRangeKey = "all" | "under-50" | "50-100" | "over-100";

const PRICE_RANGE_OPTIONS: Array<{ value: PriceRangeKey; label: string }> = [
  { value: "all", label: "All Prices" },
  { value: "under-50", label: "Under $50" },
  { value: "50-100", label: "$50 – $100" },
  { value: "over-100", label: "$100+" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured Curation" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest Arrivals" },
] as const;

export function CatalogSection({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState<string>(
    searchParams.get("category") ?? "all"
  );
  const [audience, setAudience] = useState<string>(
    searchParams.get("audience") ?? "all"
  );
  const [search, setSearch] = useState<string>(
    searchParams.get("search") ?? ""
  );
  const [sort, setSort] = useState<string>(
    searchParams.get("sort") ?? "featured"
  );
  const [priceRange, setPriceRange] = useState<PriceRangeKey>("all");

  // Sync local filter state whenever URL query params change from Navbar/Collection links
  useEffect(() => {
    setCategory(searchParams.get("category") ?? "all");
    setAudience(searchParams.get("audience") ?? "all");
    setSearch(searchParams.get("search") ?? "");
    setSort(searchParams.get("sort") ?? "featured");
  }, [searchParams]);

  const updateUrlParams = (updates: {
    category?: string;
    audience?: string;
    search?: string;
    sort?: string;
  }) => {
    const nextCategory = updates.category ?? category;
    const nextAudience = updates.audience ?? audience;
    const nextSearch = updates.search ?? search;
    const nextSort = updates.sort ?? sort;

    const params = new URLSearchParams();
    if (nextCategory && nextCategory !== "all") {
      params.set("category", nextCategory);
    }
    if (nextAudience && nextAudience !== "all") {
      params.set("audience", nextAudience);
    }
    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    }
    if (nextSort && nextSort !== "featured") {
      params.set("sort", nextSort);
    }

    const qs = params.toString();
    router.replace(qs ? `/?${qs}#catalog` : "/#catalog", { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (audience !== "all") {
      list = list.filter((p) => p.audiences.includes(audience));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    if (priceRange === "under-50") {
      list = list.filter((p) => p.priceCents < 5000);
    } else if (priceRange === "50-100") {
      list = list.filter((p) => p.priceCents >= 5000 && p.priceCents <= 10000);
    } else if (priceRange === "over-100") {
      list = list.filter((p) => p.priceCents > 10000);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case "price-desc":
        list.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case "rating":
        list.sort(
          (a, b) =>
            b.ratingAvg - a.ratingAvg || b.reviewCount - a.reviewCount
        );
        break;
      case "newest":
        list.sort((a, b) => b.id - a.id);
        break;
      case "featured":
      default:
        list.sort((a, b) => {
          if (audience !== "all") {
            const aPri = a.audience === audience ? 1 : 0;
            const bPri = b.audience === audience ? 1 : 0;
            if (aPri !== bPri) return bPri - aPri;
          }
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return b.ratingAvg - a.ratingAvg;
        });
        break;
    }

    return list;
  }, [initialProducts, category, audience, search, priceRange, sort]);

  const hasActiveFilters =
    category !== "all" ||
    audience !== "all" ||
    search.trim() !== "" ||
    priceRange !== "all";

  const handleResetAll = () => {
    setCategory("all");
    setAudience("all");
    setSearch("");
    setPriceRange("all");
    setSort("featured");
    router.replace("/#catalog", { scroll: false });
  };

  return (
    <section
      id="catalog"
      className="scroll-mt-24 py-20 sm:py-24 border-t border-[#E6E0D6]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#E6E0D6]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C2D12]">
              The Complete Atelier Catalog
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl font-medium text-[#1C1917] mt-2">
              Household &amp; Beauty Offerings
            </h2>
            <p className="text-sm sm:text-base text-[#635B54] mt-2 max-w-2xl">
              Thoughtfully curated home sanctuary pieces and clean botanical
              formulations for young adults, adults, females, males, and
              everyone under one kingdom.
            </p>
          </div>

          {/* Primary Department Switcher */}
          <div
            role="tablist"
            aria-label="Filter by department"
            className="inline-flex p-1 rounded-xl bg-[#F3EFEA] border border-[#E6E0D6] self-start md:self-auto"
          >
            {CATEGORY_OPTIONS.map((opt) => {
              const isActive = category === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setCategory(opt.value);
                    updateUrlParams({ category: opt.value });
                  }}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#1C1917] text-[#FAF8F5] shadow-xs"
                      : "text-[#635B54] hover:text-[#1C1917]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audience Filter Strip & Utility Bar */}
        <div className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#E6E0D6]/80">
          {/* Inclusive Audience Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#635B54] mr-1 shrink-0">
              For:
            </span>
            {AUDIENCE_OPTIONS.map((aud) => {
              const active = audience === aud.value;
              return (
                <button
                  key={aud.value}
                  type="button"
                  onClick={() => {
                    setAudience(aud.value);
                    updateUrlParams({ audience: aud.value });
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-[0.04em] transition-all shrink-0 cursor-pointer ${
                    active
                      ? "bg-[#7C2D12] text-[#FAF8F5] border border-[#7C2D12] shadow-xs"
                      : "bg-[#F3EFEA] text-[#1C1917] hover:border-[#7C2D12]/50 border border-[#E6E0D6]"
                  }`}
                >
                  {aud.label}
                </button>
              );
            })}
          </div>

          {/* Search, Price Filter & Sort */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Inline Filter Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#635B54] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearch(val);
                  updateUrlParams({ search: val });
                }}
                placeholder="Filter by keyword..."
                aria-label="Filter products by keyword"
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#F3EFEA] border border-[#E6E0D6] text-xs text-[#1C1917] placeholder:text-[#635B54]/80 focus:outline-none focus:border-[#7C2D12]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    updateUrlParams({ search: "" });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#635B54] hover:text-[#1C1917]"
                  aria-label="Clear keyword filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Price Range Selector */}
            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) =>
                  setPriceRange(e.target.value as PriceRangeKey)
                }
                aria-label="Filter by price range"
                className="px-3.5 py-2 rounded-lg bg-[#F3EFEA] border border-[#E6E0D6] text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#7C2D12] cursor-pointer"
              >
                {PRICE_RANGE_OPTIONS.map((pr) => (
                  <option key={pr.value} value={pr.value}>
                    {pr.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="inline-flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#635B54] hidden sm:block" />
              <select
                value={sort}
                onChange={(e) => {
                  const val = e.target.value;
                  setSort(val);
                  updateUrlParams({ sort: val });
                }}
                aria-label="Sort products"
                className="px-3.5 py-2 rounded-lg bg-[#F3EFEA] border border-[#E6E0D6] text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#7C2D12] cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result Count & Active Filter Reset Row */}
        <div className="pt-6 pb-8 flex items-center justify-between text-xs text-[#635B54]">
          <p>
            Showing{" "}
            <strong className="font-mono-num text-[#1C1917]">
              {filteredProducts.length}
            </strong>{" "}
            {filteredProducts.length === 1 ? "curated piece" : "curated pieces"}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C2D12] hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 px-6 rounded-2xl bg-[#F3EFEA] border border-[#E6E0D6] text-center max-w-xl mx-auto">
            <h3 className="font-serif-display text-3xl text-[#1C1917]">
              No Offerings Match Your Filter
            </h3>
            <p className="text-sm text-[#635B54] mt-2 leading-relaxed">
              Try broadening your audience selection, clearing the keyword
              search, or exploring our full Household and Beauty collection.
            </p>
            <button
              type="button"
              onClick={handleResetAll}
              className="mt-6 px-6 py-3 rounded-lg bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer"
            >
              Show Complete Kingdom Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7 gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
