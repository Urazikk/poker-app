import { Card, Rank } from "./types";

// ============================================================
// Evaluateur de mains simplifie
// Classe chaque main sur un score numerique pour comparaison
// ============================================================

export enum HandRank {
  HighCard = 0,
  Pair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  Straight = 4,
  Flush = 5,
  FullHouse = 6,
  FourOfAKind = 7,
  StraightFlush = 8,
  RoyalFlush = 9,
}

export interface EvaluatedHand {
  rank: HandRank;
  score: number;    // Score unique pour comparaison directe
  name: string;     // Description lisible ("Pair of Aces", etc.)
  bestCards: Card[]; // Les 5 meilleures cartes
}

const RANK_VALUES: Record<Rank, number> = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8,
  "9": 9, "T": 10, "J": 11, "Q": 12, "K": 13, "A": 14,
};

/**
 * Evalue la meilleure main de 5 cartes parmi 7 (2 hole + 5 board).
 */
export function evaluateHand(holeCards: [Card, Card], board: Card[]): EvaluatedHand {
  const allCards = [...holeCards, ...board];
  const combos = getCombinations(allCards, 5);

  let best: EvaluatedHand | null = null;
  for (const combo of combos) {
    const evaluated = evaluate5Cards(combo);
    if (!best || evaluated.score > best.score) {
      best = evaluated;
    }
  }

  return best!;
}

/**
 * Evalue exactement 5 cartes.
 */
function evaluate5Cards(cards: Card[]): EvaluatedHand {
  const sorted = [...cards].sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank]);
  const values = sorted.map((c) => RANK_VALUES[c.rank]);

  const isFlush = sorted.every((c) => c.suit === sorted[0].suit);
  const isStraight = checkStraight(values);
  const groups = getGroups(sorted);

  // Royal Flush
  if (isFlush && isStraight && values[0] === 14 && values[4] === 10) {
    return { rank: HandRank.RoyalFlush, score: score(9, values), name: "Royal Flush", bestCards: sorted };
  }

  // Straight Flush
  if (isFlush && isStraight) {
    return { rank: HandRank.StraightFlush, score: score(8, values), name: `Straight Flush, ${sorted[0].rank} high`, bestCards: sorted };
  }

  // Four of a Kind
  if (groups[0].count === 4) {
    return { rank: HandRank.FourOfAKind, score: score(7, [groups[0].value, groups[1].value]), name: `Four of a Kind, ${rankName(groups[0].value)}s`, bestCards: sorted };
  }

  // Full House
  if (groups[0].count === 3 && groups[1].count === 2) {
    return { rank: HandRank.FullHouse, score: score(6, [groups[0].value, groups[1].value]), name: `Full House, ${rankName(groups[0].value)}s full of ${rankName(groups[1].value)}s`, bestCards: sorted };
  }

  // Flush
  if (isFlush) {
    return { rank: HandRank.Flush, score: score(5, values), name: `Flush, ${sorted[0].rank} high`, bestCards: sorted };
  }

  // Straight
  if (isStraight) {
    return { rank: HandRank.Straight, score: score(4, values), name: `Straight, ${sorted[0].rank} high`, bestCards: sorted };
  }

  // Three of a Kind
  if (groups[0].count === 3) {
    return { rank: HandRank.ThreeOfAKind, score: score(3, [groups[0].value, ...groups.slice(1).map((g) => g.value)]), name: `Three of a Kind, ${rankName(groups[0].value)}s`, bestCards: sorted };
  }

  // Two Pair
  if (groups[0].count === 2 && groups[1].count === 2) {
    return { rank: HandRank.TwoPair, score: score(2, [groups[0].value, groups[1].value, groups[2].value]), name: `Two Pair, ${rankName(groups[0].value)}s and ${rankName(groups[1].value)}s`, bestCards: sorted };
  }

  // Pair
  if (groups[0].count === 2) {
    return { rank: HandRank.Pair, score: score(1, [groups[0].value, ...groups.slice(1).map((g) => g.value)]), name: `Pair of ${rankName(groups[0].value)}s`, bestCards: sorted };
  }

  // High Card
  return { rank: HandRank.HighCard, score: score(0, values), name: `${sorted[0].rank} high`, bestCards: sorted };
}

/**
 * Verifie si les valeurs forment une suite (gere aussi la roue A-2-3-4-5).
 */
function checkStraight(values: number[]): boolean {
  // Suite standard
  const isNormal = values.every((v, i) => i === 0 || values[i - 1] - v === 1);
  if (isNormal) return true;

  // Roue : A-5-4-3-2
  if (values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2) {
    return true;
  }

  return false;
}

/**
 * Groupe les cartes par valeur, trie par (count DESC, value DESC).
 */
function getGroups(cards: Card[]): { value: number; count: number }[] {
  const map = new Map<number, number>();
  for (const card of cards) {
    const v = RANK_VALUES[card.rank];
    map.set(v, (map.get(v) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || b.value - a.value);
}

/**
 * Calcule un score unique pour comparaison.
 * Le handRank est le facteur principal, les kickers departage.
 */
function score(handRank: number, kickers: number[]): number {
  let s = handRank * 1_000_000_000;
  for (let i = 0; i < kickers.length && i < 5; i++) {
    s += kickers[i] * Math.pow(15, 4 - i);
  }
  return s;
}

function rankName(value: number): string {
  const names: Record<number, string> = {
    14: "Ace", 13: "King", 12: "Queen", 11: "Jack", 10: "Ten",
    9: "Nine", 8: "Eight", 7: "Seven", 6: "Six", 5: "Five",
    4: "Four", 3: "Three", 2: "Two",
  };
  return names[value] || String(value);
}

/**
 * Retourne toutes les combinaisons de k elements parmi arr.
 */
function getCombinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = getCombinations(rest, k - 1).map((c) => [first, ...c]);
  const withoutFirst = getCombinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

/**
 * Compare deux mains evaluees. Retourne :
 *  > 0 si hand1 gagne
 *  < 0 si hand2 gagne
 *  = 0 si egalite
 */
export function compareHands(hand1: EvaluatedHand, hand2: EvaluatedHand): number {
  return hand1.score - hand2.score;
}
