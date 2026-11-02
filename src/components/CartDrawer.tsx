"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CATEGORY_DISPLAY_MAP, formatPrice } from "@/lib/format";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    subtotalCents,
    remainingForFreeShippingCents,
    freeShippingProgressPercent,
  } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
    >
      {/* Blurred Overlay */}
      <div
        className="fixed inset-0 bg-[#1C1917]/45 backdrop-blur-xs animate-fade-in"
        onClick={closeCart}
      />

      {/* Slide-out Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl border-l border-[#E6E0D6] flex flex-col animate-slide-in-right">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#E6E0D6] flex items-center justify-between">
          <div>
            <h2 className="font-serif-display text-2xl font-medium text-[#1C1917]">
              Your Kingdom Bag
            </h2>
            <p className="text-xs text-[#635B54] mt-0.5">
              {totalItems} {totalItems === 1 ? "item" : "items"} selected
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-full text-[#635B54] hover:text-[#1C1917] hover:bg-[#F3EFEA] transition-colors cursor-pointer"
            aria-label="Close shopping bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Banner */}
        <div className="px-6 py-3.5 bg-[#F3EFEA] border-b border-[#E6E0D6]">
          {remainingForFreeShippingCents === 0 && items.length > 0 ? (
            <div className="flex items-center gap-2 text-xs font-medium text-[#2D5A3D]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                You&rsquo;ve unlocked complimentary Kingdom Courier shipping!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-[#1C1917]">
              <Truck className="w-4 h-4 text-[#7C2D12] shrink-0" />
              <span>
                Add{" "}
                <strong className="font-mono-num font-semibold text-[#7C2D12]">
                  {formatPrice(remainingForFreeShippingCents)}
                </strong>{" "}
                more for complimentary courier shipping
              </span>
            </div>
          )}
          <div className="mt-2 h-1.5 w-full rounded-full bg-[#E6E0D6] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                remainingForFreeShippingCents === 0 && items.length > 0
                  ? "bg-[#2D5A3D]"
                  : "bg-[#B48A3E]"
              }`}
              style={{
                width: `${items.length === 0 ? 0 : freeShippingProgressPercent}%`,
              }}
            />
          </div>
        </div>

        {/* Cart Items Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F3EFEA] border border-[#E6E0D6] flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-[#7C2D12]" />
              </div>
              <h3 className="font-serif-display text-2xl text-[#1C1917]">
                Your Sanctuary Awaits
              </h3>
              <p className="text-sm text-[#635B54] max-w-xs mt-2 leading-relaxed">
                Explore artisanal household essentials and botanical beauty
                rituals crafted for every member of the kingdom.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Link
                  href="/?category=household#catalog"
                  onClick={closeCart}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#F3EFEA] hover:bg-[#1C1917] text-[#1C1917] hover:text-[#FAF8F5] border border-[#E6E0D6] text-xs font-semibold uppercase tracking-[0.08em] transition-colors text-center"
                >
                  Shop Household
                </Link>
                <Link
                  href="/?category=beauty#catalog"
                  onClick={closeCart}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.08em] transition-colors text-center"
                >
                  Shop Beauty
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-[#E6E0D6]">
              {items.map((item) => (
                <li key={item.key} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="w-20 h-24 rounded-lg overflow-hidden bg-[#F3EFEA] border border-[#E6E0D6] shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="font-serif-display text-lg font-medium text-[#1C1917] hover:text-[#7C2D12] leading-snug line-clamp-2 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="p-1 text-[#635B54] hover:text-[#991B1B] transition-colors shrink-0 cursor-pointer"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[11px] uppercase tracking-[0.08em] text-[#635B54]">
                          {CATEGORY_DISPLAY_MAP[item.category] ?? item.category}
                        </span>
                        {item.variant && (
                          <>
                            <span className="text-[#E6E0D6]">·</span>
                            <span className="text-xs text-[#7C2D12] font-medium">
                              {item.variant}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center rounded-full border border-[#E6E0D6] bg-[#F3EFEA]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#1C1917] hover:text-[#7C2D12] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-num text-xs font-semibold px-2.5 text-[#1C1917]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#1C1917] hover:text-[#7C2D12] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono-num text-sm font-semibold text-[#1C1917]">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sticky Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#E6E0D6] bg-[#F3EFEA]/65 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-[#635B54]">
                <span>Shipping</span>
                <span className="font-mono-num">
                  {remainingForFreeShippingCents === 0
                    ? "Complimentary"
                    : "Calculated at checkout"}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-[#1C1917]">
                <span>Subtotal</span>
                <span className="font-mono-num text-lg">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3.5 px-6 rounded-lg bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={closeCart}
              className="w-full py-2 text-xs font-medium uppercase tracking-[0.1em] text-[#635B54] hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              Continue Exploring the Kingdom
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
