"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { CrownEmblem } from "./Navbar";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "subscribed" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Unable to subscribe.");
      }
      setStatus("subscribed");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Unable to subscribe."
      );
    }
  };

  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] border-t border-[#2E2925]">
      {/* Craft Pillars Band */}
      <div className="border-b border-[#2E2925]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#292421] border border-[#3B332E] flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-[#B48A3E]" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-medium text-[#FAF8F5]">
                Clean Botanical Formulations
              </h3>
              <p className="text-xs text-[#B8AFA6] mt-1 leading-relaxed">
                Cold-pressed actives and phthalate-free home aromatics safe for
                every age and complexion.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#292421] border border-[#3B332E] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#B48A3E]" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-medium text-[#FAF8F5]">
                Artisanal Household Craft
              </h3>
              <p className="text-xs text-[#B8AFA6] mt-1 leading-relaxed">
                Small-batch European flax linens, wheel-thrown stoneware, and
                heirloom solid oak essentials.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#292421] border border-[#3B332E] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#B48A3E]" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-medium text-[#FAF8F5]">
                Under One Sovereign Guarantee
              </h3>
              <p className="text-xs text-[#B8AFA6] mt-1 leading-relaxed">
                Complimentary courier shipping over $75 and effortless 30-day
                returns across the kingdom.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Brand & Newsletter */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2.5">
            <CrownEmblem className="w-5 h-5 text-[#B48A3E]" />
            <span className="font-serif-display text-2xl font-semibold tracking-[0.06em]">
              ESTHER&rsquo;S KINGDOM
            </span>
          </div>
          <p className="text-sm text-[#B8AFA6] max-w-md leading-relaxed">
            A store with everything you need, under one kingdom. Thoughtfully
            bridging household sanctuary objects and daily botanical beauty for
            young adults, adults, females, males, and everyone.
          </p>

          <div className="pt-2">
            <p className="text-xs uppercase tracking-[0.16em] text-[#B48A3E] font-semibold mb-3">
              Join The Royal Dispatch
            </p>
            {status === "subscribed" ? (
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#2D5A3D]/30 border border-[#2D5A3D] text-xs text-[#E4F2E8]">
                <Check className="w-4 h-4 text-[#7AD098]" />
                <span>
                  Welcome to Esther&rsquo;s Kingdom. You are on the Royal
                  Dispatch list.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2.5 max-w-md"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg bg-[#292421] border border-[#3B332E] text-sm text-[#FAF8F5] placeholder:text-[#8E847B] focus:outline-none focus:border-[#B48A3E]"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="px-5 py-3 rounded-lg bg-[#7C2D12] hover:bg-[#933818] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.1em] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <span>
                    {status === "submitting" ? "Joining..." : "Subscribe"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="text-xs text-[#F87171] mt-2">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xs uppercase tracking-[0.16em] text-[#B48A3E] font-semibold mb-4">
              Departments
            </h4>
            <ul className="space-y-3 text-sm text-[#D6CFC8]">
              <li>
                <Link
                  href="/#catalog"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  All Offerings
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=household#catalog"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  Household Items
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=beauty#catalog"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  Beauty Items
                </Link>
              </li>
              <li>
                <Link
                  href="/?sort=rating#catalog"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  Highest Rated
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.16em] text-[#B48A3E] font-semibold mb-4">
              Shop For
            </h4>
            <ul className="space-y-3 text-sm text-[#D6CFC8]">
              <li>
                <Link
                  href="/?audience=everyone#catalog"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  Everyone
                </Link>
              </li>
              <li>
                <Link
                  href="/?audience=young-adults#catalog"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  Young Adults
                </Link>
              </li>
              <li>
                <Link
                  href="/?audience=adults#catalog"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  Adults
                </Link>
              </li>
              <li>
                <Link
                  href="/?audience=females#catalog"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  Females
                </Link>
              </li>
              <li>
                <Link
                  href="/?audience=males#catalog"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  Males
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.16em] text-[#B48A3E] font-semibold mb-4">
              Concierge
            </h4>
            <ul className="space-y-3 text-sm text-[#D6CFC8]">
              <li>
                <Link
                  href="/checkout"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  Express Bag Checkout
                </Link>
              </li>
              <li>
                <Link
                  href="/#collections"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  Featured Collections
                </Link>
              </li>
              <li>
                <span className="text-[#8E847B]">
                  Kingdom Courier · Free $75+
                </span>
              </li>
              <li>
                <span className="text-[#8E847B]">
                  30-Day Sanctuary Guarantee
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#2E2925]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E847B]">
          <p>
            &copy; {new Date().getFullYear()} Esther&rsquo;s Kingdom Atelier.
            All rights reserved.
          </p>
          <p className="tracking-[0.08em] uppercase">
            Household Sanctuary · Botanical Beauty · For Everyone
          </p>
        </div>
      </div>
    </footer>
  );
}
