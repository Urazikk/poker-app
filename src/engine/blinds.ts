import { BlindLevel, EXPRESSO_CONFIG, GameState, Player } from "./types";

/**
 * Retourne le niveau de blinds actuel.
 */
export function getCurrentBlinds(state: GameState): BlindLevel {
  const idx = Math.min(state.currentBlindLevel, state.config.blindStructure.length - 1);
  return state.config.blindStructure[idx];
}

/**
 * Passe au niveau de blinds suivant si le timer est ecoule.
 */
export function checkBlindIncrease(state: GameState): GameState {
  if (state.blindTimer <= 0) {
    const nextLevel = Math.min(
      state.currentBlindLevel + 1,
      state.config.blindStructure.length - 1
    );
    const newBlinds = state.config.blindStructure[nextLevel];
    return {
      ...state,
      currentBlindLevel: nextLevel,
      blindTimer: newBlinds.duration,
    };
  }
  return state;
}

/**
 * Poste les blinds pour une nouvelle main.
 * En 3-max Expresso : BTN = dealer, SB a gauche du BTN, BB a gauche du SB.
 * Quand il ne reste que 2 joueurs : BTN poste la SB, l'autre poste la BB.
 */
export function postBlinds(state: GameState): GameState {
  const blinds = getCurrentBlinds(state);
  const activePlayers = state.players.filter((p) => p.stack > 0);
  const newPlayers = [...state.players.map((p) => ({ ...p }))];

  if (activePlayers.length === 3) {
    // 3 joueurs : SB = dealer+1, BB = dealer+2
    const sbIndex = (state.dealerIndex + 1) % 3;
    const bbIndex = (state.dealerIndex + 2) % 3;

    const sbAmount = Math.min(blinds.sb, newPlayers[sbIndex].stack);
    newPlayers[sbIndex].stack -= sbAmount;
    newPlayers[sbIndex].currentBet = sbAmount;
    newPlayers[sbIndex].totalInvested = sbAmount;

    const bbAmount = Math.min(blinds.bb, newPlayers[bbIndex].stack);
    newPlayers[bbIndex].stack -= bbAmount;
    newPlayers[bbIndex].currentBet = bbAmount;
    newPlayers[bbIndex].totalInvested = bbAmount;

    return {
      ...state,
      players: newPlayers,
      pots: [{ amount: sbAmount + bbAmount, eligible: activePlayers.map((p) => p.id) }],
    };
  }

  if (activePlayers.length === 2) {
    // Heads-up : BTN poste SB, autre poste BB
    const sbIdx = state.dealerIndex;
    const bbIdx = newPlayers.findIndex(
      (p, i) => i !== state.dealerIndex && p.stack > 0
    );

    const sbAmount = Math.min(blinds.sb, newPlayers[sbIdx].stack);
    newPlayers[sbIdx].stack -= sbAmount;
    newPlayers[sbIdx].currentBet = sbAmount;
    newPlayers[sbIdx].totalInvested = sbAmount;

    const bbAmount = Math.min(blinds.bb, newPlayers[bbIdx].stack);
    newPlayers[bbIdx].stack -= bbAmount;
    newPlayers[bbIdx].currentBet = bbAmount;
    newPlayers[bbIdx].totalInvested = bbAmount;

    return {
      ...state,
      players: newPlayers,
      pots: [{ amount: sbAmount + bbAmount, eligible: [newPlayers[sbIdx].id, newPlayers[bbIdx].id] }],
    };
  }

  return state;
}
