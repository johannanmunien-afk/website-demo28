import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles, Star } from "lucide-react";
import { getFilteredProducts } from "@/lib/queries";
import { CatalogSection } from "@/components/CatalogSection";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allProducts = await getFilteredProducts();
  const spotlightProduct =
    allProducts.find((p) => p.slug === "sovereign-terracotta-diffuser") ??
    allProducts[0];

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#E6E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Editorial Narrative */}
            <div className="lg:col-span-6 space-y-7 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFEA] border border-[#E6E0D6] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7C2D12]">
                <Sparkles className="w-3.5 h-3.5 text-[#B48A3E]" />
                <span>Household &amp; Beauty · Modern Sovereign Atelier</span>
              </div>

              <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-[66px] font-medium text-[#1C1917] leading-[1.05] tracking-[-0.02em]">
                Everything You Need,{" "}
                <span className="italic text-[#7C2D12] font-normal">
                  Under One Kingdom.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#635B54] leading-relaxed max-w-xl">
                Welcome to <strong className="text-[#1C1917] font-medium">Esther&rsquo;s Kingdom</strong>
                —where tactile household sanctuary objects meet clean botanical
                beauty rituals. Thoughtfully crafted for young adults, adults,
                females, males, and everyone.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#catalog"
                  className="px-7 py-4 rounded-lg bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.12em] inline-flex items-center gap-2.5 transition-all shadow-sm"
                >
                  <span>Explore the Kingdom</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#collections"
                  className="px-7 py-4 rounded-lg bg-[#F3EFEA] hover:bg-[#1C1917] text-[#1C1917] hover:text-[#FAF8F5] border border-[#E6E0D6] text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
                >
                  Featured Collections
                </a>
              </div>

              {/* Quick Audience Curation Links */}
              <div className="pt-5 border-t border-[#E6E0D6]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#635B54] mb-3">
                  Shop By Audience Edit
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Everyone", slug: "everyone" },
                    { label: "Young Adults", slug: "young-adults" },
                    { label: "Adults", slug: "adults" },
                    { label: "Females", slug: "females" },
                    { label: "Males", slug: "males" },
                  ].map((aud) => (
                    <Link
                      key={aud.slug}
                      href={`/?audience=${aud.slug}#catalog`}
                      className="px-3.5 py-1.5 rounded-full bg-[#F3EFEA] hover:bg-[#7C2D12] text-[#1C1917] hover:text-[#FAF8F5] border border-[#E6E0D6] text-xs font-medium transition-colors"
                    >
                      {aud.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Editorial Still-Life Frame */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden bg-[#F3EFEA] border border-[#E6E0D6] aspect-[4/4.4] shadow-lg">
                <img
                  src="/images/hero-kingdom.jpg"
                  alt="Esther's Kingdom sunlit travertine table with terracotta diffuser, botanical serums, soy candle, and Belgian linen"
                  className="w-full h-full object-cover"
                />

                {/* Subtle Gradient Scrim at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#1C1917]/55 via-[#1C1917]/15 to-transparent pointer-events-none" />

                {/* Floating Atelier Spotlight Card */}
                {spotlightProduct && (
                  <Link
                    href={`/products/${spotlightProduct.slug}`}
                    className="group absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-4 rounded-xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#E6E0D6] shadow-md flex items-center justify-between gap-4 hover:border-[#7C2D12] transition-all"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7C2D12]">
                        Atelier Spotlight
                      </span>
                      <p className="font-serif-display text-lg font-medium text-[#1C1917] truncate group-hover:text-[#7C2D12] transition-colors">
                        {spotlightProduct.name}
                      </p>
                      <p className="font-mono-num text-xs font-semibold text-[#635B54] mt-0.5">
                        {formatPrice(spotlightProduct.priceCents)} ·{" "}
                        <span className="text-[#2D5A3D]">In Stock</span>
                      </p>
                    </div>
                    <span className="w-9 h-9 rounded-full bg-[#F3EFEA] group-hover:bg-[#7C2D12] text-[#1C1917] group-hover:text-[#FAF8F5] flex items-center justify-center shrink-0 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTIONS SECTION */}
      <section id="collections" className="scroll-mt-24 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C2D12]">
                Two Worlds, One Crown
              </span>
              <h2 className="font-serif-display text-4xl sm:text-5xl font-medium text-[#1C1917] mt-2">
                Featured Kingdom Collections
              </h2>
            </div>
            <p className="text-sm text-[#635B54] max-w-md">
              Elevate the spaces you inhabit and the daily rituals that restore
              your skin, body, and spirit.
            </p>
          </div>

          {/* Dual Editorial Collection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Household Sanctuary Card */}
            <Link
              href="/?category=household#catalog"
              className="group relative rounded-2xl overflow-hidden bg-[#F3EFEA] border border-[#E6E0D6] aspect-[16/11] flex flex-col justify-end p-7 sm:p-10"
            >
              <img
                src="/images/collection-household.jpg"
                alt="Household Items Collection — Stoneware ceramics, Belgian flax linen throw, and brass home decor"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/85 via-[#1C1917]/30 to-transparent" />

              <div className="relative z-10 text-[#FAF8F5]">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FAF8F5]/20 backdrop-blur-xs text-[10px] font-semibold uppercase tracking-[0.16em] mb-3">
                  Collection 01 · 6 Curated Pieces
                </span>
                <h3 className="font-serif-display text-3xl sm:text-4xl font-medium">
                  The Household Sanctuary
                </h3>
                <p className="text-sm text-[#E6E0D6] mt-2 max-w-md leading-relaxed">
                  Terracotta diffusers, organic Belgian waffle-weave linens,
                  wheel-thrown hydration carafes, solid oak valets, and fig
                  botanical candles.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#FAF8F5] group-hover:text-[#E5C17B] transition-colors">
                  <span>Shop Household Items</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Beauty & Apothecary Card */}
            <Link
              href="/?category=beauty#catalog"
              className="group relative rounded-2xl overflow-hidden bg-[#F3EFEA] border border-[#E6E0D6] aspect-[16/11] flex flex-col justify-end p-7 sm:p-10"
            >
              <img
                src="/images/collection-beauty.jpg"
                alt="Beauty Items Collection — Botanical facial serums, oat cream cleanser, whipped body butter, and grooming oils"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/85 via-[#1C1917]/30 to-transparent" />

              <div className="relative z-10 text-[#FAF8F5]">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FAF8F5]/20 backdrop-blur-xs text-[10px] font-semibold uppercase tracking-[0.16em] mb-3">
                  Collection 02 · 6 Curated Pieces
                </span>
                <h3 className="font-serif-display text-3xl sm:text-4xl font-medium">
                  Beauty &amp; Botanical Apothecary
                </h3>
                <p className="text-sm text-[#E6E0D6] mt-2 max-w-md leading-relaxed">
                  Bakuchiol radiance serums, barrier-soothing oat cleansers,
                  whipped Hinoki body balms, niacinamide clarity gels, and
                  cedarwood grooming elixirs.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#FAF8F5] group-hover:text-[#E5C17B] transition-colors">
                  <span>Shop Beauty Items</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>

          {/* Inclusive Audience Showcase Strip */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#F3EFEA] border border-[#E6E0D6]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#1C1917]">
                  Welcoming Every Member of the Kingdom
                </h3>
                <p className="text-xs sm:text-sm text-[#635B54] mt-1">
                  Select an audience edit below to filter household &amp; beauty
                  essentials tailored to every lifestyle.
                </p>
              </div>
              <Link
                href="/#catalog"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7C2D12] hover:text-[#1C1917] inline-flex items-center gap-1.5"
              >
                <span>View All 12 Pieces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {[
                {
                  title: "Everyone",
                  desc: "Universal home & gentle daily skin staples",
                  slug: "everyone",
                },
                {
                  title: "Young Adults",
                  desc: "Apartment scents & active clarity serums",
                  slug: "young-adults",
                },
                {
                  title: "Adults",
                  desc: "Heirloom flax textiles & restorative balms",
                  slug: "adults",
                },
                {
                  title: "Females",
                  desc: "Neroli elixirs & wheel-thrown stoneware",
                  slug: "females",
                },
                {
                  title: "Males",
                  desc: "Smoked oak valets & Atlas cedar grooming",
                  slug: "males",
                },
              ].map((card) => (
                <Link
                  key={card.slug}
                  href={`/?audience=${card.slug}#catalog`}
                  className="group p-4 rounded-xl bg-[#FAF8F5] hover:bg-[#1C1917] border border-[#E6E0D6] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif-display text-xl font-medium text-[#1C1917] group-hover:text-[#FAF8F5] transition-colors">
                        {card.title}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#7C2D12] group-hover:text-[#B48A3E] transition-colors" />
                    </div>
                    <p className="text-xs text-[#635B54] group-hover:text-[#D6CFC8] mt-1.5 leading-relaxed transition-colors">
                      {card.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PRODUCT CATALOG WITH FILTERS & SORTING */}
      <Suspense
        fallback={
          <div className="py-24 text-center text-sm text-[#635B54]">
            Loading Kingdom Catalog...
          </div>
        }
      >
        <CatalogSection initialProducts={allProducts} />
      </Suspense>

      {/* VOICES FROM THE KINGDOM (VERIFIED REVIEWS BAND) */}
      <section className="py-20 bg-[#F3EFEA] border-t border-[#E6E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C2D12]">
              Community Reflections
            </span>
            <h2 className="font-serif-display text-4xl font-medium text-[#1C1917] mt-2">
              Loved Across Every Household
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                quote:
                  "I hid plastic diffusers in corners for years. This terracotta piece sits front and center on our travertine table and guests always ask which studio made it.",
                author: "Camille Laurent",
                tag: "Verified Buyer · Sovereign Terracotta Diffuser",
                slug: "sovereign-terracotta-diffuser",
              },
              {
                quote:
                  "Started a simple two-step routine with the Velvet Oat Cleanser and Dewdrop Niacinamide Serum. My skin hasn't looked this calm and balanced in years.",
                author: "Ethan Brooks",
                tag: "Young Adult · Dewdrop Clarity Gel-Serum",
                slug: "dewdrop-niacinamide-clarity-serum",
              },
              {
                quote:
                  "Softens stubble immediately without making my collar greasy, and pairing it with the Smoked Oak Valet Tray transformed my morning dresser setup.",
                author: "Harrison Cole",
                tag: "Male · Crown Atlas Cedar Grooming Elixir",
                slug: "crown-atlas-cedar-grooming-elixir",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D6] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#B48A3E] mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#B48A3E] text-[#B48A3E]"
                      />
                    ))}
                  </div>
                  <p className="font-serif-display text-xl text-[#1C1917] leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6E0D6] flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-[#1C1917]">
                      {item.author}
                    </p>
                    <p className="text-[11px] text-[#635B54] mt-0.5">
                      {item.tag}
                    </p>
                  </div>
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7C2D12] hover:text-[#1C1917]"
                  >
                    Shop
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
