"use client";

import { Card as CardType } from "@/engine/types";

const SUIT_SYMBOLS: Record<string, string> = {
  h: "\u2665",
  d: "\u2666",
  c: "\u2663",
  s: "\u2660",
};

const SUIT_COLORS: Record<string, string> = {
  h: "text-red-600",
  d: "text-blue-600",
  c: "text-emerald-700",
  s: "text-neutral-900",
};

interface CardProps {
  card: CardType | null;
  faceDown?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "w-10 h-14 text-base",
  md: "w-14 h-20 text-xl",
  lg: "w-16 h-24 text-3xl",
};

export default function CardComponent({ card, faceDown = false, size = "md" }: CardProps) {
  if (!card || faceDown) {
    return (
      <div
        className={`${SIZES[size]} rounded-md bg-gradient-to-br from-indigo-800 to-indigo-950 border-[3px] border-white flex items-center justify-center shadow-md shadow-black/80`}
      >
        <div className="w-3/4 h-3/4 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>
    );
  }

  return (
    <div
      className={`${SIZES[size]} rounded-md bg-white border border-neutral-200 flex flex-col items-center justify-center shadow-md shadow-black/80 ${SUIT_COLORS[card.suit]}`}
    >
      <span className="font-black leading-none -mb-1">{card.rank}</span>
      <span className="leading-none">{SUIT_SYMBOLS[card.suit]}</span>
    </div>
  );
}
