"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCart } from "@/lib/cart";

export function CartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(getCart().length);
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  if (count === 0) return null;

  return (
    <Link href="/offerte"
      className="relative flex items-center gap-2 bg-[#1066a3] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#0d5491] transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      Mijn offerte
      <span className="bg-white text-[#1066a3] text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
        {count}
      </span>
    </Link>
  );
}
