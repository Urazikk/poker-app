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

  // Positions des sieges façon "bureau" : Hero centré en bas, Bot1/Bot2 en haut gauche/droite
  const seatPositions = [
    "bottom-[-10%] left-1/2 -translate-x-1/2",    // Hero (index 0)
    "top-[5%] left-[5%]",                         // Bot 1
    "top-[5%] right-[5%]",                        // Bot 2
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[2/1] mt-8 mb-16">
      {/* Table ovale Winamax */}
      <div className="absolute inset-0 rounded-[100px] winamax-table" />
      <div className="absolute inset-4 rounded-[85px] border-2 border-white/5 opacity-50" />

      {/* Pot Area */}
      {totalPot > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] z-10 flex flex-col items-center">
          <div className="bg-black/80 rounded-full px-5 py-1.5 border border-white/10 shadow-lg">
            <span className="text-white font-bold text-xl drop-shadow-md">Winamax Pot: {totalPot}</span>
          </div>
        </div>
      )}

      {/* Community Cards */}
      {state.communityCards.length > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 z-10 p-2 bg-black/20 rounded-2xl backdrop-blur-sm">
          {state.communityCards.map((card, i) => (
            <CardComponent key={i} card={card} size="lg" />
          ))}
        </div>
      )}

      {/* Blinds info / Dealer button area */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-xs text-white/50 bg-black/60 rounded-full px-4 py-1 z-10 shadow-inner">
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
