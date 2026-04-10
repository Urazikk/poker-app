import { Card, Rank, Suit } from "./types";

const RANKS: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const SUITS: Suit[] = ["h", "d", "c", "s"];

/**
 * Cree un deck de 52 cartes ordonne.
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

/**
 * Melange un deck en place avec Fisher-Yates.
 * Utilise crypto.getRandomValues pour un vrai aleatoire.
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Fallback sur Math.random si crypto n'est pas dispo (SSR)
    let j: number;
    if (typeof globalThis.crypto !== "undefined") {
      const array = new Uint32Array(1);
      globalThis.crypto.getRandomValues(array);
      j = array[0] % (i + 1);
    } else {
      j = Math.floor(Math.random() * (i + 1));
    }
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Pioche n cartes du dessus du deck.
 * Modifie le deck en place (retire les cartes piochees).
 */
export function drawCards(deck: Card[], count: number): Card[] {
  if (deck.length < count) {
    throw new Error(`Pas assez de cartes: ${deck.length} restantes, ${count} demandees`);
  }
  return deck.splice(0, count);
}

/**
 * Notation courte d'une carte. Ex: { rank: 'A', suit: 'h' } => 'Ah'
 */
export function cardToString(card: Card): string {
  return `${card.rank}${card.suit}`;
}

/**
 * Parse une notation courte. Ex: 'Ah' => { rank: 'A', suit: 'h' }
 */
export function parseCard(str: string): Card {
  const rank = str[0] as Rank;
  const suit = str[1] as Suit;
  if (!RANKS.includes(rank) || !SUITS.includes(suit)) {
    throw new Error(`Carte invalide: ${str}`);
  }
  return { rank, suit };
}
