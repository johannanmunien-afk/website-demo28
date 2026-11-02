"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CrownEmblem({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 18H21M4.5 15L3 7L8.5 11L12 5L15.5 11L21 7L19.5 15H4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="3.2" r="1" fill="currentColor" />
    </svg>
  );
}

export function Navbar() {
  const { totalItems, isHydrated, openCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    if (q) {
      router.push(`/?search=${encodeURIComponent(q)}#catalog`);
    } else {
      router.push("/#catalog");
    }
  };

  return (
    <>
      {/* Royal Announcement Ribbon */}
      <div className="bg-[#1C1917] text-[#FAF8F5] px-4 py-2.5 text-center text-[11px] sm:text-xs tracking-[0.14em] uppercase font-medium border-b border-[#2E2925]">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#B48A3E] shrink-0" />
          <span>
            Complimentary Kingdom Courier on orders over $75 · Household &amp;
            Beauty Under One Kingdom
          </span>
        </span>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#E6E0D6] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-4">
            {/* Left Navigation (Desktop) & Mobile Menu Button */}
            <div className="flex items-center gap-6 flex-1">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[#1C1917] hover:text-[#7C2D12] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <nav
                aria-label="Primary navigation"
                className="hidden lg:flex items-center gap-7 text-[13px] tracking-[0.06em] uppercase font-medium text-[#1C1917]"
              >
                <Link
                  href="/#catalog"
                  className="hover:text-[#7C2D12] transition-colors py-1"
                >
                  Shop All
                </Link>
                <Link
                  href="/?category=household#catalog"
                  className="hover:text-[#7C2D12] transition-colors py-1"
                >
                  Household
                </Link>
                <Link
                  href="/?category=beauty#catalog"
                  className="hover:text-[#7C2D12] transition-colors py-1"
                >
                  Beauty
                </Link>
                <Link
                  href="/?audience=everyone#catalog"
                  className="hover:text-[#7C2D12] transition-colors py-1 text-[#635B54]"
                >
                  For Everyone
                </Link>
              </nav>
            </div>

            {/* Center Sovereign Wordmark */}
            <Link
              href="/"
              className="group flex flex-col items-center text-center shrink-0"
            >
              <div className="flex items-center gap-2">
                <CrownEmblem className="w-4 h-4 text-[#B48A3E] transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span className="font-serif-display text-2xl sm:text-[28px] font-semibold tracking-[0.06em] text-[#1C1917] leading-none">
                  ESTHER&rsquo;S KINGDOM
                </span>
              </div>
              <span className="text-[10px] tracking-[0.24em] uppercase text-[#635B54] mt-1 hidden sm:block">
                Everything You Need · Under One Kingdom
              </span>
            </Link>

            {/* Right Controls */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
              <Link
                href="/#collections"
                className="hidden xl:inline-block text-[13px] tracking-[0.06em] uppercase font-medium text-[#635B54] hover:text-[#1C1917] transition-colors mr-2"
              >
                Collections
              </Link>

              <button
                type="button"
                onClick={() => setSearchOpen((prev) => !prev)}
                className="p-2.5 rounded-full text-[#1C1917] hover:bg-[#F3EFEA] hover:text-[#7C2D12] transition-colors"
                aria-label="Search catalog"
              >
                {searchOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>

              <button
                type="button"
                onClick={openCart}
                className="group relative inline-flex items-center gap-2.5 pl-3.5 pr-4 py-2 rounded-full bg-[#F3EFEA] hover:bg-[#1C1917] text-[#1C1917] hover:text-[#FAF8F5] border border-[#E6E0D6] transition-all duration-200 cursor-pointer"
                aria-label="Open shopping bag"
              >
                <ShoppingBag className="w-4 h-4 text-[#7C2D12] group-hover:text-[#B48A3E] transition-colors" />
                <span className="text-xs font-semibold tracking-[0.06em] uppercase hidden sm:inline">
                  Bag
                </span>
                <span className="font-mono-num inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold bg-[#7C2D12] text-[#FAF8F5]">
                  {isHydrated ? totalItems : 0}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#E6E0D6] bg-[#FAF8F5] px-4 py-4 animate-fade-in">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto flex items-center gap-3"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#635B54] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search terracotta diffuser, Belgian linen, bakuchiol serum, cedar candle..."
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 bg-[#F3EFEA] border border-[#E6E0D6] rounded-full text-sm text-[#1C1917] placeholder:text-[#635B54]/75 focus:outline-none focus:border-[#7C2D12]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Slide-In Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#1C1917]/45 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-[#FAF8F5] h-full shadow-2xl border-r border-[#E6E0D6] flex flex-col justify-between p-6 z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E6E0D6]">
                <div className="flex items-center gap-2">
                  <CrownEmblem className="w-4 h-4 text-[#B48A3E]" />
                  <span className="font-serif-display text-xl font-semibold tracking-wider">
                    ESTHER&rsquo;S KINGDOM
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#635B54] hover:text-[#1C1917]"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#635B54] mb-3">
                    Departments
                  </p>
                  <div className="flex flex-col space-y-2.5 font-serif-display text-2xl">
                    <Link
                      href="/#catalog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:text-[#7C2D12] transition-colors"
                    >
                      All Kingdom Offerings
                    </Link>
                    <Link
                      href="/?category=household#catalog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:text-[#7C2D12] transition-colors"
                    >
                      Household Sanctuary
                    </Link>
                    <Link
                      href="/?category=beauty#catalog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:text-[#7C2D12] transition-colors"
                    >
                      Beauty &amp; Apothecary
                    </Link>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#E6E0D6]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#635B54] mb-3">
                    Curated By Audience
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      { label: "Everyone", val: "everyone" },
                      { label: "Young Adults", val: "young-adults" },
                      { label: "Adults", val: "adults" },
                      { label: "Females", val: "females" },
                      { label: "Males", val: "males" },
                    ].map((aud) => (
                      <Link
                        key={aud.val}
                        href={`/?audience=${aud.val}#catalog`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3.5 py-2 rounded-lg bg-[#F3EFEA] hover:bg-[#7C2D12] hover:text-[#FAF8F5] text-[#1C1917] font-medium transition-colors"
                      >
                        {aud.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E6E0D6] text-xs text-[#635B54]">
              <p className="font-medium text-[#1C1917]">
                A store with everything you need, under one kingdom.
              </p>
              <p className="mt-1">Complimentary shipping over $75.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
