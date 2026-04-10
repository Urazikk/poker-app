import {
  GameState,
  GameConfig,
  GamePhase,
  Player,
  Action,
  Street,
  Card,
  Position,
  EXPRESSO_CONFIG,
} from "./types";
import { createDeck, shuffleDeck, drawCards } from "./deck";
import { postBlinds, getCurrentBlinds, checkBlindIncrease } from "./blinds";
import {
  applyAction,
  isBettingRoundComplete,
  resetBetsForNewStreet,
  getLegalActions,
} from "./betting";
import { resolveShowdown, ShowdownResult } from "./showdown";

// ============================================================
// Moteur de jeu Expresso
// Orchestre le flux complet : deal -> blinds -> betting -> showdown
// ============================================================

/**
 * Cree une nouvelle partie Expresso.
 */
export function createGame(
  heroId: string,
  bot1Id: string,
  bot2Id: string,
  config: GameConfig = EXPRESSO_CONFIG
): GameState {
  const players: Player[] = [
    {
      id: heroId,
      position: "BTN",
      stack: config.startingStack,
      hand: null,
      isHero: true,
      isActive: true,
      isAllIn: false,
      currentBet: 0,
      totalInvested: 0,
    },
    {
      id: bot1Id,
      position: "SB",
      stack: config.startingStack,
      hand: null,
      isHero: false,
      isActive: true,
      isAllIn: false,
      currentBet: 0,
      totalInvested: 0,
    },
    {
      id: bot2Id,
      position: "BB",
      stack: config.startingStack,
      hand: null,
      isHero: false,
      isActive: true,
      isAllIn: false,
      currentBet: 0,
      totalInvested: 0,
    },
  ];

  return {
    id: crypto.randomUUID(),
    config,
    players,
    deck: [],
    communityCards: [],
    pots: [{ amount: 0, eligible: players.map((p) => p.id) }],
    currentStreet: "preflop",
    currentPlayerIndex: 0,
    dealerIndex: 0,
    currentBlindLevel: 0,
    blindTimer: config.blindStructure[0].duration,
    handNumber: 0,
    phase: "waiting",
    lastAction: null,
    minRaise: config.blindStructure[0].bb,
    handHistory: [],
  };
}

/**
 * Demarre une nouvelle main.
 * Melange, distribue, poste les blinds, place l'action sur le bon joueur.
 */
export function startNewHand(state: GameState): GameState {
  // Verifier si la partie est terminee
  const alive = state.players.filter((p) => p.stack > 0);
  if (alive.length <= 1) {
    return { ...state, phase: "finished" };
  }

  // Augmenter les blinds si necessaire
  let newState = checkBlindIncrease(state);

  // Avancer le dealer
  const newDealerIndex = (state.dealerIndex + 1) % state.players.length;

  // Assigner les positions selon le bouton
  const positions: Position[] = ["BTN", "SB", "BB"];
  const newPlayers: Player[] = state.players.map((p, i) => {
    const posIndex = (i - newDealerIndex + 3) % 3;
    return {
      ...p,
      position: positions[posIndex],
      hand: null as [Card, Card] | null,
      isActive: p.stack > 0,
      isAllIn: false,
      currentBet: 0,
      totalInvested: 0,
    };
  });

  // Creer et melanger le deck
  const deck = shuffleDeck(createDeck());

  // Distribuer 2 cartes a chaque joueur actif
  for (const player of newPlayers) {
    if (player.isActive) {
      const cards = drawCards(deck, 2) as [Card, Card];
      player.hand = cards;
    }
  }

  newState = {
    ...newState,
    players: newPlayers,
    deck,
    communityCards: [],
    pots: [{ amount: 0, eligible: newPlayers.filter((p) => p.isActive).map((p) => p.id) }],
    currentStreet: "preflop",
    dealerIndex: newDealerIndex,
    handNumber: state.handNumber + 1,
    phase: "dealing",
    lastAction: null,
    minRaise: getCurrentBlinds(newState).bb,
    handHistory: [],
  };

  // Poster les blinds
  newState = postBlinds(newState);

  // Preflop : l'action commence par le joueur apres la BB
  // En 3-max : c'est le BTN (dealer)
  // En heads-up : c'est le BTN/SB
  const activePlayers = newState.players.filter((p) => p.isActive && !p.isAllIn);
  if (activePlayers.length >= 2) {
    const bbIndex = newState.players.findIndex((p) => p.position === "BB" && p.isActive);
    let firstToAct: number;
    if (alive.length === 2) {
      // Heads-up : SB (= BTN) parle en premier preflop
      firstToAct = newDealerIndex;
    } else {
      // 3-max : BTN parle en premier preflop (apres BB)
      firstToAct = newDealerIndex;
    }
    newState = { ...newState, currentPlayerIndex: firstToAct, phase: "betting" };
  }

  return newState;
}

/**
 * Le joueur actif joue une action.
 * Retourne le nouvel etat + eventuellement le resultat du showdown.
 */
export function playAction(
  state: GameState,
  action: Action
): { state: GameState; showdown?: ShowdownResult } {
  // Valider l'action
  const legal = getLegalActions(state);
  if (!legal.includes(action.type)) {
    throw new Error(`Action illegale: ${action.type}. Actions possibles: ${legal.join(", ")}`);
  }

  // Appliquer l'action
  let newState = applyAction(state, action);

  // Verifier si la main est terminee (tout le monde fold sauf un)
  const activePlayers = newState.players.filter((p) => p.isActive);
  if (activePlayers.length === 1) {
    const result = resolveShowdown(newState);
    newState = distributeWinnings(newState, result);
    return { state: { ...newState, phase: "showdown" }, showdown: result };
  }

  // Verifier si le tour de mise est termine
  if (isBettingRoundComplete(newState)) {
    // Tous all-in ? Aller directement au showdown en distribuant les cartes restantes
    const canAct = activePlayers.filter((p) => !p.isAllIn);
    if (canAct.length <= 1) {
      newState = dealRemainingCards(newState);
      const result = resolveShowdown(newState);
      newState = distributeWinnings(newState, result);
      return { state: { ...newState, phase: "showdown" }, showdown: result };
    }

    // Passer au prochain street
    newState = advanceStreet(newState);
  }

  return { state: newState };
}

/**
 * Passe a la street suivante (flop -> turn -> river -> showdown).
 */
function advanceStreet(state: GameState): GameState {
  const streetOrder: Street[] = ["preflop", "flop", "turn", "river"];
  const currentIndex = streetOrder.indexOf(state.currentStreet);

  if (currentIndex >= 3) {
    // Apres la river = showdown
    const result = resolveShowdown(state);
    return { ...distributeWinnings(state, result), phase: "showdown" };
  }

  const nextStreet = streetOrder[currentIndex + 1];
  let newState = { ...state, currentStreet: nextStreet };
  const deck = [...state.deck];

  // Distribuer les cartes communes
  switch (nextStreet) {
    case "flop": {
      drawCards(deck, 1); // burn
      const flop = drawCards(deck, 3);
      newState = {
        ...newState,
        deck,
        communityCards: [...state.communityCards, ...flop],
      };
      break;
    }
    case "turn": {
      drawCards(deck, 1); // burn
      const turn = drawCards(deck, 1);
      newState = {
        ...newState,
        deck,
        communityCards: [...state.communityCards, ...turn],
      };
      break;
    }
    case "river": {
      drawCards(deck, 1); // burn
      const river = drawCards(deck, 1);
      newState = {
        ...newState,
        deck,
        communityCards: [...state.communityCards, ...river],
      };
      break;
    }
  }

  // Reset les mises et placer l'action sur le premier joueur apres le dealer
  newState = resetBetsForNewStreet(newState);
  return newState;
}

/**
 * Distribue les cartes restantes quand tous les joueurs sont all-in.
 */
function dealRemainingCards(state: GameState): GameState {
  const deck = [...state.deck];
  const community = [...state.communityCards];

  while (community.length < 5) {
    drawCards(deck, 1); // burn
    const card = drawCards(deck, 1);
    community.push(...card);
  }

  return { ...state, deck, communityCards: community, currentStreet: "river" };
}

/**
 * Distribue les gains aux joueurs selon le resultat du showdown.
 */
function distributeWinnings(state: GameState, result: ShowdownResult): GameState {
  const newPlayers = state.players.map((p) => {
    const playerResult = result.results.find((r) => r.playerId === p.id);
    if (!playerResult) return p;
    return {
      ...p,
      stack: p.stack + (playerResult.netGain > 0 ? playerResult.netGain + p.totalInvested : 0),
    };
  });

  return { ...state, players: newPlayers };
}

/**
 * Verifie si la partie (sit-and-go) est terminee.
 * Terminee quand un seul joueur a des jetons.
 */
export function isGameOver(state: GameState): boolean {
  return state.players.filter((p) => p.stack > 0).length <= 1;
}

/**
 * Retourne le gagnant de la partie (celui qui a tous les jetons).
 */
export function getWinner(state: GameState): Player | null {
  if (!isGameOver(state)) return null;
  return state.players.find((p) => p.stack > 0) || null;
}

/**
 * Retourne un resume de l'etat actuel lisible.
 */
export function getStateInfo(state: GameState) {
  const blinds = getCurrentBlinds(state);
  return {
    handNumber: state.handNumber,
    street: state.currentStreet,
    phase: state.phase,
    blinds: `${blinds.sb}/${blinds.bb}`,
    pot: state.pots.reduce((sum, p) => sum + p.amount, 0),
    board: state.communityCards,
    players: state.players.map((p) => ({
      id: p.id,
      position: p.position,
      stack: p.stack,
      isActive: p.isActive,
      isAllIn: p.isAllIn,
      currentBet: p.currentBet,
    })),
    currentPlayer: state.players[state.currentPlayerIndex]?.id,
    legalActions: getLegalActions(state),
  };
}
