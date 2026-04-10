import { Action, ActionType, GameState, Player } from "@/engine/types";
import { getLegalActions, getMinRaise } from "@/engine/betting";
import { getCurrentBlinds } from "@/engine/blinds";

export type BotDifficulty = "recruit" | "regular" | "pro";

/**
 * Bot simplifie qui choisit une action selon sa difficulte.
 * Pour l'instant : logique basique, sera enrichie plus tard.
 */
export function getBotAction(
  state: GameState,
  difficulty: BotDifficulty
): Action {
  const legal = getLegalActions(state);
  const player = state.players[state.currentPlayerIndex];
  const blinds = getCurrentBlinds(state);
  const bbSize = blinds.bb;
  const stackBB = player.stack / bbSize;

  switch (difficulty) {
    case "recruit":
      return recruitAction(legal, player, state);
    case "regular":
      return regularAction(legal, player, state, stackBB);
    case "pro":
      return proAction(legal, player, state, stackBB);
    default:
      return { type: "fold", amount: 0 };
  }
}

/** Bot Recrue : tres passif, call souvent, raise rarement */
function recruitAction(legal: ActionType[], player: Player, state: GameState): Action {
  const rand = Math.random();

  if (legal.includes("check")) {
    return { type: "check", amount: 0 };
  }

  // 60% call, 20% fold, 20% raise/allin
  if (rand < 0.6 && legal.includes("call")) {
    const highestBet = Math.max(...state.players.map((p) => p.currentBet));
    return { type: "call", amount: highestBet - player.currentBet };
  }

  if (rand < 0.8 && legal.includes("fold")) {
    return { type: "fold", amount: 0 };
  }

  if (legal.includes("raise")) {
    const minRaise = getMinRaise(state);
    return { type: "raise", amount: minRaise };
  }

  if (legal.includes("call")) {
    const highestBet = Math.max(...state.players.map((p) => p.currentBet));
    return { type: "call", amount: highestBet - player.currentBet };
  }

  return { type: "fold", amount: 0 };
}

/** Bot Regulier : push-or-fold basique quand short stack */
function regularAction(legal: ActionType[], player: Player, state: GameState, stackBB: number): Action {
  const rand = Math.random();

  // Short stack : push-or-fold
  if (stackBB <= 10) {
    if (rand < 0.4 && legal.includes("allin")) {
      return { type: "allin", amount: player.stack };
    }
    if (legal.includes("fold")) return { type: "fold", amount: 0 };
  }

  if (legal.includes("check")) {
    // Check ou raise
    if (rand < 0.3 && legal.includes("raise")) {
      const minRaise = getMinRaise(state);
      return { type: "raise", amount: minRaise };
    }
    return { type: "check", amount: 0 };
  }

  // Face a un raise
  if (rand < 0.4 && legal.includes("call")) {
    const highestBet = Math.max(...state.players.map((p) => p.currentBet));
    return { type: "call", amount: highestBet - player.currentBet };
  }

  if (rand < 0.6 && legal.includes("raise")) {
    const minRaise = getMinRaise(state);
    return { type: "raise", amount: minRaise };
  }

  if (legal.includes("fold")) return { type: "fold", amount: 0 };
  return { type: "check", amount: 0 };
}

/** Bot Pro : plus agressif, decisions basees sur le stack effectif */
function proAction(legal: ActionType[], player: Player, state: GameState, stackBB: number): Action {
  const rand = Math.random();

  // Push-or-fold agressif en short stack
  if (stackBB <= 12) {
    if (rand < 0.55 && legal.includes("allin")) {
      return { type: "allin", amount: player.stack };
    }
    if (legal.includes("fold")) return { type: "fold", amount: 0 };
  }

  if (legal.includes("check")) {
    if (rand < 0.45 && legal.includes("raise")) {
      const minRaise = getMinRaise(state);
      const raiseSize = Math.min(minRaise * 2, player.stack + player.currentBet);
      return { type: "raise", amount: raiseSize };
    }
    return { type: "check", amount: 0 };
  }

  // 3-bet agressif
  if (rand < 0.35 && legal.includes("raise")) {
    const minRaise = getMinRaise(state);
    const raiseSize = Math.min(minRaise * 2.5, player.stack + player.currentBet);
    return { type: "raise", amount: Math.floor(raiseSize) };
  }

  if (rand < 0.65 && legal.includes("call")) {
    const highestBet = Math.max(...state.players.map((p) => p.currentBet));
    return { type: "call", amount: highestBet - player.currentBet };
  }

  if (legal.includes("fold")) return { type: "fold", amount: 0 };
  if (legal.includes("call")) {
    const highestBet = Math.max(...state.players.map((p) => p.currentBet));
    return { type: "call", amount: highestBet - player.currentBet };
  }
  return { type: "check", amount: 0 };
}
