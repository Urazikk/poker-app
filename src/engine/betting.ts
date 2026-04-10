import { Action, ActionType, GameState, HandHistoryEntry, Player, Street } from "./types";
import { getCurrentBlinds } from "./blinds";

/**
 * Retourne les actions legales pour le joueur actif.
 */
export function getLegalActions(state: GameState): ActionType[] {
  const player = state.players[state.currentPlayerIndex];
  if (!player || !player.isActive) return [];

  const highestBet = Math.max(...state.players.map((p) => p.currentBet));
  const toCall = highestBet - player.currentBet;
  const actions: ActionType[] = [];

  // Fold : toujours possible sauf si on peut checker
  if (toCall > 0) {
    actions.push("fold");
  }

  // Check : si personne n'a mise ou si on est deja au niveau
  if (toCall === 0) {
    actions.push("check");
  }

  // Call : si quelqu'un a mise plus
  if (toCall > 0 && player.stack > 0) {
    actions.push("call");
  }

  // Raise : si on a assez de jetons au dela du call
  if (player.stack > toCall) {
    actions.push("raise");
  }

  // All-in : toujours possible si on a des jetons
  if (player.stack > 0) {
    actions.push("allin");
  }

  return actions;
}

/**
 * Calcule le montant minimum d'un raise.
 * Regle standard : le raise minimum est le montant du dernier raise,
 * ou la BB si aucun raise precedent.
 */
export function getMinRaise(state: GameState): number {
  const blinds = getCurrentBlinds(state);
  const highestBet = Math.max(...state.players.map((p) => p.currentBet));
  return Math.max(state.minRaise, highestBet + blinds.bb);
}

/**
 * Applique une action au GameState et retourne le nouvel etat.
 */
export function applyAction(state: GameState, action: Action): GameState {
  const player = state.players[state.currentPlayerIndex];
  if (!player || !player.isActive) {
    throw new Error("Aucun joueur actif a cet index");
  }

  const newPlayers = state.players.map((p) => ({ ...p }));
  const currentPlayer = newPlayers[state.currentPlayerIndex];
  let newPots = state.pots.map((p) => ({ ...p, eligible: [...p.eligible] }));
  let newMinRaise = state.minRaise;

  // Enregistrer dans l'historique
  const historyEntry: HandHistoryEntry = {
    playerId: currentPlayer.id,
    street: state.currentStreet,
    action,
    stackBefore: currentPlayer.stack + currentPlayer.currentBet,
    potAfter: 0, // calcule apres
  };

  switch (action.type) {
    case "fold": {
      currentPlayer.isActive = false;
      // Retirer des pots eligibles
      newPots = newPots.map((pot) => ({
        ...pot,
        eligible: pot.eligible.filter((id) => id !== currentPlayer.id),
      }));
      break;
    }

    case "check": {
      // Rien a faire
      break;
    }

    case "call": {
      const highestBet = Math.max(...newPlayers.map((p) => p.currentBet));
      const toCall = Math.min(highestBet - currentPlayer.currentBet, currentPlayer.stack);
      currentPlayer.stack -= toCall;
      currentPlayer.currentBet += toCall;
      currentPlayer.totalInvested += toCall;
      newPots[0].amount += toCall;

      if (currentPlayer.stack === 0) {
        currentPlayer.isAllIn = true;
      }
      break;
    }

    case "raise": {
      const highestBet = Math.max(...newPlayers.map((p) => p.currentBet));
      const raiseAmount = action.amount;
      const totalBet = Math.min(raiseAmount, currentPlayer.stack + currentPlayer.currentBet);
      const additional = totalBet - currentPlayer.currentBet;

      currentPlayer.stack -= additional;
      currentPlayer.currentBet = totalBet;
      currentPlayer.totalInvested += additional;
      newPots[0].amount += additional;

      // Mettre a jour le min raise
      newMinRaise = totalBet - highestBet;

      if (currentPlayer.stack === 0) {
        currentPlayer.isAllIn = true;
      }
      break;
    }

    case "allin": {
      const allInAmount = currentPlayer.stack;
      currentPlayer.currentBet += allInAmount;
      currentPlayer.totalInvested += allInAmount;
      currentPlayer.stack = 0;
      currentPlayer.isAllIn = true;
      newPots[0].amount += allInAmount;

      const highestBet = Math.max(...newPlayers.map((p) => p.currentBet));
      if (currentPlayer.currentBet > highestBet - allInAmount) {
        newMinRaise = Math.max(newMinRaise, allInAmount);
      }
      break;
    }
  }

  // Calculer le pot total pour l'historique
  const totalPot = newPots.reduce((sum, p) => sum + p.amount, 0);
  historyEntry.potAfter = totalPot;

  // Passer au joueur suivant
  const nextIndex = findNextActivePlayer(newPlayers, state.currentPlayerIndex);

  return {
    ...state,
    players: newPlayers,
    pots: newPots,
    currentPlayerIndex: nextIndex,
    minRaise: newMinRaise,
    lastAction: { playerId: currentPlayer.id, action },
    handHistory: [...state.handHistory, historyEntry],
  };
}

/**
 * Trouve l'index du prochain joueur actif (pas fold, pas all-in).
 */
function findNextActivePlayer(players: Player[], currentIndex: number): number {
  const count = players.length;
  for (let i = 1; i <= count; i++) {
    const idx = (currentIndex + i) % count;
    if (players[idx].isActive && !players[idx].isAllIn) {
      return idx;
    }
  }
  return -1; // Personne d'autre ne peut agir
}

/**
 * Verifie si le tour de mise est termine.
 * Un tour est termine quand :
 * - Tous les joueurs actifs (non all-in) ont mise le meme montant
 * - Ou il ne reste qu'un joueur actif
 */
export function isBettingRoundComplete(state: GameState): boolean {
  const activePlayers = state.players.filter((p) => p.isActive);

  // Un seul joueur restant = main terminee
  if (activePlayers.length <= 1) return true;

  // Tous all-in ou fold sauf peut-etre un
  const canAct = activePlayers.filter((p) => !p.isAllIn);
  if (canAct.length <= 1) {
    // Le dernier joueur a deja eu sa chance d'agir
    const highestBet = Math.max(...activePlayers.map((p) => p.currentBet));
    if (canAct.length === 0) return true;
    if (canAct[0].currentBet === highestBet) return true;
    return false;
  }

  // Verifier que tous les joueurs actifs (non all-in) ont la meme mise
  const highestBet = Math.max(...activePlayers.map((p) => p.currentBet));
  return canAct.every((p) => p.currentBet === highestBet);
}

/**
 * Reset les mises courantes pour un nouveau tour (street).
 */
export function resetBetsForNewStreet(state: GameState): GameState {
  const newPlayers = state.players.map((p) => ({
    ...p,
    currentBet: 0,
  }));

  // Premier a parler : SB (ou premier joueur actif apres le dealer)
  const firstToAct = findNextActivePlayer(newPlayers, state.dealerIndex);

  return {
    ...state,
    players: newPlayers,
    currentPlayerIndex: firstToAct,
    minRaise: getCurrentBlinds(state).bb,
  };
}
