"use client";

import { Player } from "@/engine/types";
import CardComponent from "./Card";

interface PlayerSeatProps {
  player: Player;
  isCurrentTurn: boolean;
  showCards: boolean;
}

export default function PlayerSeat({ player, isCurrentTurn, showCards }: PlayerSeatProps) {
  const canSeeCards = player.isHero || showCards;

  return (
    <div
      className={`flex flex-col items-center gap-2 transition-all duration-300 ${
        isCurrentTurn ? "scale-105" : ""
      } ${!player.isActive ? "opacity-40" : ""}`}
    >
      {/* Cartes */}
      <div className="flex gap-1">
        {player.hand ? (
          <>
            <CardComponent card={canSeeCards ? player.hand[0] : null} faceDown={!canSeeCards} size="md" />
            <CardComponent card={canSeeCards ? player.hand[1] : null} faceDown={!canSeeCards} size="md" />
          </>
        ) : (
          <>
            <div className="w-14 h-20" />
            <div className="w-14 h-20" />
          </>
        )}
      </div>

      {/* Info joueur */}
      <div
        className={`rounded-lg px-4 py-2 text-center min-w-[120px] border ${
          isCurrentTurn
            ? "bg-amber-500/20 border-amber-400/60"
            : "bg-neutral-800/80 border-neutral-700/50"
        }`}
      >
        <div className="text-xs text-neutral-400 font-medium">{player.position}</div>
        <div className="text-sm font-bold">
          {player.isHero ? "Vous" : `Bot ${player.position}`}
        </div>
        <div className="text-sm font-mono text-amber-400">{player.stack}</div>
        {player.isAllIn && (
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
            All-in
          </span>
        )}
      </div>

      {/* Mise courante */}
      {player.currentBet > 0 && (
        <div className="bg-neutral-900/80 rounded-full px-3 py-0.5 text-xs font-mono text-amber-300 border border-amber-500/20">
          {player.currentBet}
        </div>
      )}
    </div>
  );
}
