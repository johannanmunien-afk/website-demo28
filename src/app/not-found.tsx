import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-28 text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C2D12]">
        404 · Chamber Not Found
      </span>
      <h1 className="font-serif-display text-4xl sm:text-5xl font-medium text-[#1C1917] mt-3">
        This Corner of the Kingdom Is Uncharted
      </h1>
      <p className="text-sm sm:text-base text-[#635B54] mt-3 leading-relaxed">
        The offering or page you requested could not be found. Return to the
        main atelier to explore our Household and Beauty collections.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#7C2D12] hover:bg-[#62220C] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Esther&rsquo;s Kingdom</span>
      </Link>
    </div>
  );
}
