// ============================================================
// Types fondamentaux du moteur de jeu Poker Expresso
// ============================================================

export type Suit = "h" | "d" | "c" | "s"; // hearts, diamonds, clubs, spades
export type Rank =
  | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "T" | "J" | "Q" | "K" | "A";

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type Position = "BTN" | "SB" | "BB";

export type Street = "preflop" | "flop" | "turn" | "river";

export type ActionType = "fold" | "check" | "call" | "raise" | "allin";

export interface Action {
  type: ActionType;
  amount: number; // 0 pour fold/check, montant pour call/raise/allin
}

export interface Player {
  id: string;
  position: Position;
  stack: number;
  hand: [Card, Card] | null; // null si pas encore distribue
  isHero: boolean;
  isActive: boolean;    // encore dans la main
  isAllIn: boolean;
  currentBet: number;   // mise dans le tour en cours
  totalInvested: number; // total mis dans le pot sur cette main
}

export interface BlindLevel {
  level: number;
  sb: number;
  bb: number;
  duration: number; // secondes
}

export interface Pot {
  amount: number;
  eligible: string[]; // IDs des joueurs eligibles
}

export interface GameConfig {
  startingStack: number;
  blindStructure: BlindLevel[];
  multiplier: number;
}

export type GamePhase = "waiting" | "dealing" | "betting" | "showdown" | "finished";

export interface GameState {
  id: string;
  config: GameConfig;
  players: Player[];
  deck: Card[];
  communityCards: Card[];
  pots: Pot[];
  currentStreet: Street;
  currentPlayerIndex: number;  // index dans players[]
  dealerIndex: number;         // bouton
  currentBlindLevel: number;
  blindTimer: number;          // secondes restantes
  handNumber: number;
  phase: GamePhase;
  lastAction: { playerId: string; action: Action } | null;
  minRaise: number;
  handHistory: HandHistoryEntry[];
}

export interface HandHistoryEntry {
  playerId: string;
  street: Street;
  action: Action;
  stackBefore: number;
  potAfter: number;
}

// Configuration Expresso standard
export const EXPRESSO_CONFIG: GameConfig = {
  startingStack: 500,
  multiplier: 2,
  blindStructure: [
    { level: 1, sb: 10, bb: 20, duration: 180 },
    { level: 2, sb: 15, bb: 30, duration: 180 },
    { level: 3, sb: 20, bb: 40, duration: 180 },
    { level: 4, sb: 30, bb: 60, duration: 180 },
    { level: 5, sb: 40, bb: 80, duration: 180 },
    { level: 6, sb: 50, bb: 100, duration: 180 },
    { level: 7, sb: 75, bb: 150, duration: 180 },
    { level: 8, sb: 100, bb: 200, duration: 180 },
  ],
};
