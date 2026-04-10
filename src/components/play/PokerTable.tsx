"use client";

import { GameState } from "@/engine/types";
import PlayerSeat from "./PlayerSeat";
import CardComponent from "./Card";

interface PokerTableProps {
  state: GameState;
  showdown: boolean;
}

export default function PokerTable({ state, showdown }: PokerTableProps) {
  const totalPot = state.pots.reduce((sum, p) => sum + p.amount, 0);

  // Positions des sieges autour de la table (bas = hero, haut-gauche et haut-droite = bots)
  const seatPositions = [
    "bottom-4 left-1/2 -translate-x-1/2",      // Hero (index 0 ou BTN au debut)
    "top-4 left-8",                               // Bot 1
    "top-4 right-8",                              // Bot 2
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-[16/10]">
      {/* Table ovale */}
      <div className="absolute inset-0 rounded-[50%] bg-gradient-to-b from-emerald-800 to-emerald-950 border-[6px] border-amber-800/60 shadow-2xl shadow-black/50" />
      <div className="absolute inset-3 rounded-[50%] border border-emerald-600/30" />

      {/* Pot */}
      {totalPot > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-black/50 rounded-full px-4 py-1.5 border border-amber-500/30 backdrop-blur-sm">
            <span className="text-amber-400 font-bold text-lg font-mono">{totalPot}</span>
          </div>
        </div>
      )}

      {/* Community Cards */}
      {state.communityCards.length > 0 && (
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1.5 z-10">
          {state.communityCards.map((card, i) => (
            <CardComponent key={i} card={card} size="sm" />
          ))}
        </div>
      )}

      {/* Blinds info */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-neutral-400 bg-black/40 rounded-full px-3 py-1 z-10">
        Blinds {state.config.blindStructure[state.currentBlindLevel].sb}/
        {state.config.blindStructure[state.currentBlindLevel].bb} | Main #{state.handNumber}
      </div>

      {/* Joueurs */}
      {state.players.map((player, index) => (
        <div key={player.id} className={`absolute z-20 ${seatPositions[index]}`}>
          <PlayerSeat
            player={player}
            isCurrentTurn={index === state.currentPlayerIndex && state.phase === "betting"}
            showCards={showdown}
          />
        </div>
      ))}
    </div>
  );
}
