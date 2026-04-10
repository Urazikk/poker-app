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
    <div className={`relative flex flex-col items-center transition-all duration-300 ${!player.isActive ? "opacity-30" : ""}`}>
      {/* Container Cards Positional (Overlap sur la gauche de l'avatar) */}
      <div className="absolute -top-4 -left-12 flex -space-x-4 z-0 drop-shadow-xl rotate-[-10deg]">
        {player.hand ? (
          <>
            <CardComponent card={canSeeCards ? player.hand[0] : null} faceDown={!canSeeCards} size="sm" />
            <CardComponent card={canSeeCards ? player.hand[1] : null} faceDown={!canSeeCards} size="sm" />
          </>
        ) : (
          <>
            <div className="w-10 h-14" />
            <div className="w-10 h-14" />
          </>
        )}
      </div>

      {/* Avatar Avatar + Info (Z-10 pour passer devant les cards) */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Border Timer si c'est son tour */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center p-1 ${isCurrentTurn ? "bg-gradient-to-r from-duo-green to-duo-blue animate-pulse" : "bg-zinc-800 border-2 border-zinc-700"}`}>
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
             {/* Fake Avatar Image / Initial */}
             <span className="text-xl font-bold text-zinc-500 uppercase">
               {player.isHero ? "MOI" : `P${player.position.charAt(0)}`}
             </span>
          </div>
        </div>

        {/* Name Tag */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-0.5 text-xs text-white -mt-2 z-20 shadow-lg">
          {player.isHero ? "Hero" : `Bot ${player.position}`}
        </div>

        {/* Stack */}
        <div className="bg-black text-duo-amber font-mono font-bold text-sm px-4 py-1 rounded-full mt-1 border border-zinc-800 shadow-md flex items-center gap-1">
          {player.stack}
        </div>

        {/* All-in Badge */}
        {player.isAllIn && (
          <div className="absolute top-0 right-0 bg-duo-red text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full rotate-12 shadow-sm border border-white/20">
            ALL-IN
          </div>
        )}
      </div>

      {/* Action En Cours / Mise Courante */}
      {player.currentBet > 0 && (
        <div className="absolute -top-6 left-1/2 translate-x-4 bg-zinc-900/90 rounded-full px-3 py-1 text-sm font-mono text-white border border-zinc-700 shadow-lg z-30">
          {player.currentBet}
        </div>
      )}
    </div>
  );
}
