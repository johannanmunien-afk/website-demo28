"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Gift,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Order } from "@/db/schema";
import {
  EXPRESS_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  STANDARD_SHIPPING_CENTS,
  TAX_RATE,
  formatPrice,
} from "@/lib/format";
import { CrownEmblem } from "@/components/Navbar";

function CheckoutContent() {
  const { items, isHydrated, subtotalCents, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderQueryNumber = searchParams.get("order");

  // Confirmed Order state (from freshly placed order or fetched via ?order=EK-...)
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(
    Boolean(orderQueryNumber)
  );

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateProv, setStateProv] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [includeGiftNote, setIncludeGiftNote] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  // Demo Payment Fields
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8842");
  const [cardExpiry, setCardExpiry] = useState("09/29");
  const [cardCvc, setCardCvc] = useState("842");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!orderQueryNumber) {
      setLoadingOrder(false);
      return;
    }
    if (confirmedOrder && confirmedOrder.orderNumber === orderQueryNumber) {
      setLoadingOrder(false);
      return;
    }

    let cancelled = false;
    setLoadingOrder(true);
    fetch(`/api/orders?orderNumber=${encodeURIComponent(orderQueryNumber)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.order) {
          setConfirmedOrder(data.order);
        }
      })
      .catch(() => {
        // Ignore fetch errors
      })
      .finally(() => {
        if (!cancelled) setLoadingOrder(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderQueryNumber, confirmedOrder]);

  const fillDemoGuest = () => {
    setCustomerName("Esther Vance-Laurent");
    setCustomerEmail("esther.guest@kingdomatelier.com");
    setLine1("428 Mercer Street");
    setLine2("Apt 5B");
    setCity("New York");
    setStateProv("NY");
    setPostalCode("10013");
    setCountry("United States");
  };

  const qualifiesFreeStandard = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCents =
    shippingMethod === "express"
      ? EXPRESS_SHIPPING_CENTS
      : qualifiesFreeStandard
        ? 0
        : STANDARD_SHIPPING_CENTS;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + shippingCents + taxCents;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (items.length === 0) {
      setErrorMsg("Your Kingdom bag is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          shippingAddress: {
            line1,
            line2: line2 || undefined,
            city,
            state: stateProv,
            postalCode,
            country,
          },
          shippingMethod,
          giftNote: includeGiftNote ? giftNote : undefined,
          items: items.map((i) => ({
            productId: i.productId,
            slug: i.slug,
            name: i.name,
            image: i.image,
            variant: i.variant,
            priceCents: i.priceCents,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to complete checkout.");
      }

      setConfirmedOrder(data.order);
      clearCart();
      router.replace(
        `/checkout?order=${encodeURIComponent(data.order.orderNumber)}`,
        { scroll: true }
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Unable to complete checkout."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOrder || !isHydrated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-28 text-center text-sm text-[#635B54]">
        Preparing Royal Checkout...
      </div>
    );
  }

  // CONFIRMED ORDER RECEIPT VIEW
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 animate-fade-up">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D6] shadow-sm space-y-8">
          <div className="text-center space-y-3 pb-8 border-b border-[#E6E0D6]">
            <div className="w-14 h-14 rounded-full bg-[#2D5A3D]/12 border border-[#2D5A3D]/30 text-[#2D5A3D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#7C2D12]">
              <CrownEmblem className="w-4 h-4 text-[#B48A3E]" />
              <span>Order Confirmed · Esther&rsquo;s Kingdom</span>
            </div>
            <h1 className="font-serif-display text-4xl sm:text-5xl font-medium text-[#1C1917]">
              Thank You, {confirmedOrder.customerName.split(" ")[0]}
            </h1>
            <p className="text-sm text-[#635B54] max-w-md mx-auto leading-relaxed">
              Your sanctuary selections have been received by our atelier and
              are being prepared for dispatch. A confirmation dispatch has been
              recorded for{" "}
              <strong className="text-[#1C1917]">
                {confirmedOrder.customerEmail}
              </strong>
              .
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#F3EFEA] border border-[#E6E0D6] font-mono-num text-xs font-semibold text-[#1C1917]">
                Order Reference: {confirmedOrder.orderNumber}
              </span>
            </div>
          </div>

          {/* Delivery & Courier Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="p-5 rounded-xl bg-[#F3EFEA]/75 border border-[#E6E0D6]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#635B54] mb-2">
                Shipping Destination
              </p>
              <p className="font-medium text-[#1C1917]">
                {confirmedOrder.customerName}
              </p>
              <p className="text-[#635B54] mt-0.5">
                {confirmedOrder.shippingAddress.line1}
                {confirmedOrder.shippingAddress.line2
                  ? `, ${confirmedOrder.shippingAddress.line2}`
                  : ""}
              </p>
              <p className="text-[#635B54]">
                {confirmedOrder.shippingAddress.city},{" "}
                {confirmedOrder.shippingAddress.state}{" "}
                {confirmedOrder.shippingAddress.postalCode}
              </p>
              <p className="text-[#635B54]">
                {confirmedOrder.shippingAddress.country}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F3EFEA]/75 border border-[#E6E0D6] flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#635B54] mb-2">
                  Courier Method
                </p>
                <p className="font-medium text-[#1C1917]">
                  {confirmedOrder.shippingMethod === "express"
                    ? "Royal Express Air (1–2 Business Days)"
                    : "Kingdom Standard Courier (3–5 Business Days)"}
                </p>
                <p className="text-xs text-[#2D5A3D] mt-1 font-medium">
                  Status: Confirmed &amp; Preparing in Atelier
                </p>
              </div>
              {confirmedOrder.giftNote && (
                <div className="mt-3 pt-3 border-t border-[#E6E0D6] text-xs text-[#635B54]">
                  <span className="font-semibold text-[#1C1917]">
                    Linen Gift Card:
                  </span>{" "}
                  &ldquo;{confirmedOrder.giftNote}&rdquo;
                </div>
              )}
            </div>
          </div>

          {/* Itemized Receipt */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#635B54] mb-4">
              Selected Offerings
            </h2>
            <ul className="divide-y divide-[#E6E0D6] border-t border-b border-[#E6E0D6]">
              {confirmedOrder.items.map((item, idx) => (
                <li
                  key={idx}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 rounded-lg object-cover bg-[#F3EFEA] border border-[#E6E0D6] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-serif-display text-lg font-medium text-[#1C1917] truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#635B54]">
                        {item.variant ? `${item.variant} · ` : ""}Qty{" "}
                        {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono-num text-sm font-semibold text-[#1C1917] shrink-0">
                    {formatPrice(item.priceCents * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-2 text-sm max-w-xs ml-auto">
            <div className="flex justify-between text-[#635B54]">
              <span>Subtotal</span>
              <span className="font-mono-num">
                {formatPrice(confirmedOrder.subtotalCents)}
              </span>
            </div>
            <div className="flex justify-between text-[#635B54]">
              <span>Courier Shipping</span>
              <span className="font-mono-num">
                {confirmedOrder.shippingCents === 0
                  ? "Complimentary"
                  : formatPrice(confirmedOrder.shippingCents)}
              </span>
            </div>
            <div className="flex justify-between text-[#635B54]">
              <span>Estimated Tax</span>
              <span className="font-mono-num">
                {formatPrice(confirmedOrder.taxCents)}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E6E0D6] flex justify-between text-base font-semibold text-[#1C1917]">
              <span>Total Paid</span>
              <span className="font-mono-num text-lg">
                {formatPrice(confirmedOrder.totalCents)}
              </span>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
            >
              <span>Continue Exploring Esther&rsquo;s Kingdom</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY BAG GUARD
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#F3EFEA] border border-[#E6E0D6] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-7 h-7 text-[#7C2D12]" />
        </div>
        <h1 className="font-serif-display text-4xl font-medium text-[#1C1917]">
          Your Kingdom Bag Is Empty
        </h1>
        <p className="text-sm text-[#635B54] leading-relaxed">
          Add household sanctuary objects or botanical beauty formulations to
          your bag before proceeding to checkout.
        </p>
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Kingdom Offerings</span>
        </Link>
      </div>
    );
  }

  // STREAMLINED TWO-COLUMN CHECKOUT
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/#catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </Link>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-medium text-[#1C1917] mt-2">
            Streamlined Royal Checkout
          </h1>
        </div>

        <button
          type="button"
          onClick={fillDemoGuest}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F3EFEA] hover:bg-[#1C1917] text-[#7C2D12] hover:text-[#FAF8F5] border border-[#E6E0D6] text-xs font-semibold transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autofill Demo Guest Address</span>
        </button>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
      >
        {/* LEFT COLUMN: Contact, Shipping, Courier & Demo Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact & Shipping */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E6E0D6] pb-4">
              <h2 className="font-serif-display text-2xl font-medium text-[#1C1917]">
                1. Guest Contact &amp; Shipping
              </h2>
              <span className="text-xs text-[#635B54]">No account required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Esther Vance"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="428 Mercer Street"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  Apt / Suite
                </label>
                <input
                  type="text"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  placeholder="Apt 5B"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={stateProv}
                  onChange={(e) => setStateProv(e.target.value)}
                  placeholder="NY"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10013"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>
            </div>
          </section>

          {/* 2. Courier Method & Gift Option */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D6] space-y-5">
            <h2 className="font-serif-display text-2xl font-medium text-[#1C1917] border-b border-[#E6E0D6] pb-4">
              2. Kingdom Courier &amp; Gifting
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  shippingMethod === "standard"
                    ? "border-[#7C2D12] bg-[#F3EFEA]"
                    : "border-[#E6E0D6] bg-[#FAF8F5]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className="mt-1 accent-[#7C2D12]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#1C1917]">
                      Standard Courier
                    </p>
                    <p className="text-xs text-[#635B54] mt-0.5">
                      3–5 business days · Plastic-free wrap
                    </p>
                  </div>
                </div>
                <span className="font-mono-num text-xs font-semibold text-[#2D5A3D]">
                  {qualifiesFreeStandard
                    ? "FREE"
                    : formatPrice(STANDARD_SHIPPING_CENTS)}
                </span>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  shippingMethod === "express"
                    ? "border-[#7C2D12] bg-[#F3EFEA]"
                    : "border-[#E6E0D6] bg-[#FAF8F5]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                    className="mt-1 accent-[#7C2D12]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#1C1917]">
                      Royal Express Air
                    </p>
                    <p className="text-xs text-[#635B54] mt-0.5">
                      1–2 business days · Priority dispatch
                    </p>
                  </div>
                </div>
                <span className="font-mono-num text-xs font-semibold text-[#1C1917]">
                  {formatPrice(EXPRESS_SHIPPING_CENTS)}
                </span>
              </label>
            </div>

            {/* Complimentary Linen Gift Card Toggle */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2.5 text-xs font-medium text-[#1C1917] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGiftNote}
                  onChange={(e) => setIncludeGiftNote(e.target.checked)}
                  className="rounded accent-[#7C2D12]"
                />
                <Gift className="w-4 h-4 text-[#B48A3E]" />
                <span>
                  Include a complimentary embossed linen gift card message
                </span>
              </label>

              {includeGiftNote && (
                <textarea
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Write your personal message here..."
                  className="mt-3 w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              )}
            </div>
          </section>

          {/* 3. Streamlined Demo Payment */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D6] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6E0D6] pb-4">
              <h2 className="font-serif-display text-2xl font-medium text-[#1C1917]">
                3. Payment Details
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2D5A3D]/12 text-[#2D5A3D] text-[11px] font-semibold">
                <Lock className="w-3 h-3" />
                <span>Demo Storefront Mode · No Real Charge</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] font-mono-num text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  Expiry
                </label>
                <input
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] font-mono-num text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#635B54] mb-1.5">
                  Security Code
                </label>
                <input
                  type="text"
                  required
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F3EFEA]/60 border border-[#E6E0D6] font-mono-num text-sm text-[#1C1917] focus:outline-none focus:border-[#7C2D12]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-[#991B1B]/10 border border-[#991B1B]/30 text-xs text-[#991B1B] font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-lg bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              <span>
                {submitting
                  ? "Confirming Royal Order..."
                  : `Complete Order · ${formatPrice(totalCents)}`}
              </span>
            </button>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Order Summary */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F3EFEA] border border-[#E6E0D6] space-y-6">
            <h2 className="font-serif-display text-2xl font-medium text-[#1C1917] border-b border-[#E6E0D6] pb-4">
              Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            <ul className="divide-y divide-[#E6E0D6] max-h-96 overflow-y-auto pr-1">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#FAF8F5] border border-[#E6E0D6] shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 font-mono-num text-[10px] font-bold bg-[#1C1917] text-[#FAF8F5] px-1.5 py-0.5 rounded-bl-md">
                        ×{item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif-display text-base font-medium text-[#1C1917] truncate">
                        {item.name}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-[#635B54] truncate">
                          {item.variant}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-mono-num text-sm font-semibold text-[#1C1917] shrink-0">
                    {formatPrice(item.priceCents * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-[#E6E0D6] space-y-2.5 text-sm">
              <div className="flex justify-between text-[#635B54]">
                <span>Subtotal</span>
                <span className="font-mono-num">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <div className="flex justify-between text-[#635B54]">
                <span>Courier Shipping</span>
                <span className="font-mono-num">
                  {shippingCents === 0 ? (
                    <span className="text-[#2D5A3D] font-medium">
                      Complimentary
                    </span>
                  ) : (
                    formatPrice(shippingCents)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[#635B54]">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono-num">{formatPrice(taxCents)}</span>
              </div>
              <div className="pt-3 border-t border-[#E6E0D6] flex justify-between items-baseline text-[#1C1917]">
                <span className="font-semibold text-base">Total</span>
                <span className="font-mono-num text-xl font-semibold">
                  {formatPrice(totalCents)}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2 text-xs text-[#635B54]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#7C2D12] shrink-0" />
                <span>
                  Dispatches in recyclable plastic-free atelier packaging
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2D5A3D] shrink-0" />
                <span>30-Day Esther&rsquo;s Kingdom Sanctuary Guarantee</span>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-28 text-center text-sm text-[#635B54]">
          Loading Royal Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
