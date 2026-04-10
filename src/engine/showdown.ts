import { GameState, Player } from "./types";
import { evaluateHand, compareHands, EvaluatedHand } from "./evaluator";

export interface ShowdownResult {
  winners: { playerId: string; amount: number; hand: EvaluatedHand }[];
  results: { playerId: string; hand: EvaluatedHand | null; netGain: number }[];
}

/**
 * Resout le showdown et distribue le(s) pot(s).
 * Gere les side pots quand des joueurs sont all-in avec des stacks differents.
 */
export function resolveShowdown(state: GameState): ShowdownResult {
  const activePlayers = state.players.filter((p) => p.isActive);

  // Si un seul joueur reste (tous les autres ont fold)
  if (activePlayers.length === 1) {
    const winner = activePlayers[0];
    const totalPot = state.pots.reduce((sum, p) => sum + p.amount, 0);
    return {
      winners: [{ playerId: winner.id, amount: totalPot, hand: null as any }],
      results: state.players.map((p) => ({
        playerId: p.id,
        hand: null,
        netGain: p.id === winner.id ? totalPot - winner.totalInvested : -p.totalInvested,
      })),
    };
  }

  // Evaluer les mains de chaque joueur actif
  const evaluations = new Map<string, EvaluatedHand>();
  for (const player of activePlayers) {
    if (player.hand) {
      const hand = evaluateHand(player.hand, state.communityCards);
      evaluations.set(player.id, hand);
    }
  }

  // Construire les side pots
  const sidePots = buildSidePots(state);
  const winnings = new Map<string, number>();

  for (const pot of sidePots) {
    // Trouver le(s) gagnant(s) de ce pot parmi les joueurs eligibles
    let bestHand: EvaluatedHand | null = null;
    let potWinners: string[] = [];

    for (const playerId of pot.eligible) {
      const hand = evaluations.get(playerId);
      if (!hand) continue;

      if (!bestHand) {
        bestHand = hand;
        potWinners = [playerId];
      } else {
        const cmp = compareHands(hand, bestHand);
        if (cmp > 0) {
          bestHand = hand;
          potWinners = [playerId];
        } else if (cmp === 0) {
          potWinners.push(playerId);
        }
      }
    }

    // Distribuer le pot (split en cas d'egalite)
    const share = Math.floor(pot.amount / potWinners.length);
    const remainder = pot.amount - share * potWinners.length;

    for (let i = 0; i < potWinners.length; i++) {
      const amount = share + (i === 0 ? remainder : 0); // le reste va au premier
      winnings.set(potWinners[i], (winnings.get(potWinners[i]) || 0) + amount);
    }
  }

  // Construire les resultats
  const winners = Array.from(winnings.entries())
    .filter(([_, amount]) => amount > 0)
    .map(([playerId, amount]) => ({
      playerId,
      amount,
      hand: evaluations.get(playerId)!,
    }));

  const results = state.players.map((p) => ({
    playerId: p.id,
    hand: evaluations.get(p.id) || null,
    netGain: (winnings.get(p.id) || 0) - p.totalInvested,
  }));

  return { winners, results };
}

/**
 * Construit les side pots a partir des investissements des joueurs.
 */
function buildSidePots(state: GameState): { amount: number; eligible: string[] }[] {
  const activePlayers = state.players
    .filter((p) => p.isActive)
    .sort((a, b) => a.totalInvested - b.totalInvested);

  const pots: { amount: number; eligible: string[] }[] = [];
  let processedAmount = 0;

  for (let i = 0; i < activePlayers.length; i++) {
    const player = activePlayers[i];
    const contribution = player.totalInvested - processedAmount;

    if (contribution <= 0) continue;

    // Chaque joueur ayant investi au moins ce montant est eligible
    const eligible = state.players
      .filter((p) => p.isActive && p.totalInvested > processedAmount)
      .map((p) => p.id);

    // Le montant du pot = contribution * nombre de joueurs eligibles
    // (tous ceux qui ont au moins atteint ce palier)
    const potAmount = contribution * state.players.filter(
      (p) => p.totalInvested > processedAmount
    ).length;

    pots.push({ amount: potAmount, eligible });
    processedAmount = player.totalInvested;
  }

  return pots;
}
