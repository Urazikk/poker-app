"use client";

import { ActionType } from "@/engine/types";

interface ActionPanelProps {
  legalActions: ActionType[];
  currentBet: number;
  heroStack: number;
  minRaise: number;
  onAction: (type: ActionType, amount?: number) => void;
}

export default function ActionPanel({
  legalActions,
  currentBet,
  heroStack,
  minRaise,
  onAction,
}: ActionPanelProps) {
  if (legalActions.length === 0) return null;

  return (
    <div className="absolute bottom-0 right-0 p-4 flex items-end gap-2 bg-black/80 rounded-tl-2xl border-t border-l border-white/10 backdrop-blur-md">
      {legalActions.includes("fold") && (
        <button
          onClick={() => onAction("fold")}
          className="btn-duo bg-zinc-600 border-zinc-800 text-white w-24 h-16 text-lg hover:bg-zinc-500"
        >
          FOLD
        </button>
      )}

      {legalActions.includes("check") && (
        <button
          onClick={() => onAction("check")}
          className="btn-duo bg-duo-green border-duo-green-dark text-white w-28 h-16 text-lg hover:bg-duo-green/90"
        >
          CHECK
        </button>
      )}

      {legalActions.includes("call") && (
        <button
          onClick={() => onAction("call")}
          className="btn-duo bg-duo-green border-duo-green-dark text-white w-28 h-16 text-lg flex flex-col items-center justify-center hover:bg-duo-green/90"
        >
          <span>CALL</span>
          <span className="text-xs font-mono">{currentBet}</span>
        </button>
      )}

      {legalActions.includes("raise") && (
        <button
          onClick={() => onAction("raise", minRaise)}
          className="btn-duo bg-duo-amber border-duo-amber-dark text-white w-28 h-16 text-lg flex flex-col items-center justify-center hover:bg-duo-amber/90"
        >
          <span>RAISE</span>
          <span className="text-xs font-mono">{minRaise}</span>
        </button>
      )}

      {legalActions.includes("allin") && (
        <button
          onClick={() => onAction("allin")}
          className="btn-duo bg-duo-red border-duo-red-dark text-white w-28 h-16 text-lg flex flex-col items-center justify-center hover:bg-duo-red/90"
        >
          <span>ALL-IN</span>
          <span className="text-xs font-mono opacity-80">{heroStack}</span>
        </button>
      )}
    </div>
  );
}
