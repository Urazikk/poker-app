"use client";

import { Card as CardType } from "@/engine/types";

const SUIT_SYMBOLS: Record<string, string> = {
  h: "\u2665",
  d: "\u2666",
  c: "\u2663",
  s: "\u2660",
};

const SUIT_COLORS: Record<string, string> = {
  h: "text-red-500",
  d: "text-blue-500",
  c: "text-emerald-500",
  s: "text-neutral-200",
};

interface CardProps {
  card: CardType | null;
  faceDown?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "w-10 h-14 text-sm",
  md: "w-14 h-20 text-lg",
  lg: "w-18 h-26 text-2xl",
};

export default function CardComponent({ card, faceDown = false, size = "md" }: CardProps) {
  if (!card || faceDown) {
    return (
      <div
        className={`${SIZES[size]} rounded-lg bg-gradient-to-br from-blue-800 to-blue-950 border border-blue-600/50 flex items-center justify-center shadow-lg`}
      >
        <div className="w-3/4 h-3/4 rounded border border-blue-400/30 bg-blue-900/50" />
      </div>
    );
  }

  return (
    <div
      className={`${SIZES[size]} rounded-lg bg-white border border-neutral-300 flex flex-col items-center justify-center shadow-lg ${SUIT_COLORS[card.suit]}`}
    >
      <span className="font-bold leading-none">{card.rank}</span>
      <span className="leading-none">{SUIT_SYMBOLS[card.suit]}</span>
    </div>
  );
}
