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
    <div className="flex items-center gap-3 bg-neutral-900/90 border border-neutral-700/50 rounded-xl px-6 py-4 backdrop-blur-sm">
      {legalActions.includes("fold") && (
        <button
          onClick={() => onAction("fold")}
          className="px-6 py-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 font-semibold hover:bg-red-500/30 transition-colors"
        >
          Fold
        </button>
      )}

      {legalActions.includes("check") && (
        <button
          onClick={() => onAction("check")}
          className="px-6 py-3 rounded-lg bg-neutral-700/40 border border-neutral-600/40 text-neutral-200 font-semibold hover:bg-neutral-600/40 transition-colors"
        >
          Check
        </button>
      )}

      {legalActions.includes("call") && (
        <button
          onClick={() => onAction("call")}
          className="px-6 py-3 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 font-semibold hover:bg-blue-500/30 transition-colors"
        >
          Call {currentBet}
        </button>
      )}

      {legalActions.includes("raise") && (
        <button
          onClick={() => onAction("raise", minRaise)}
          className="px-6 py-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-semibold hover:bg-amber-500/30 transition-colors"
        >
          Raise {minRaise}
        </button>
      )}

      {legalActions.includes("allin") && (
        <button
          onClick={() => onAction("allin")}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500/30 to-amber-500/30 border border-amber-500/50 text-white font-bold hover:from-red-500/40 hover:to-amber-500/40 transition-colors"
        >
          All-in ({heroStack})
        </button>
      )}
    </div>
  );
}
