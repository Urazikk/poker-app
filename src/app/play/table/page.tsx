"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, Suspense } from "react";
import { GameState, ActionType, Action, EXPRESSO_CONFIG } from "@/engine/types";
import { createGame, startNewHand, playAction, isGameOver, getWinner, getStateInfo } from "@/engine/game";
import { getLegalActions, getMinRaise } from "@/engine/betting";
import PokerTable from "@/components/play/PokerTable";
import ActionPanel from "@/components/play/ActionPanel";
import { getBotAction, BotDifficulty } from "@/bots/bot-engine";
import Link from "next/link";

function TableContent() {
  const searchParams = useSearchParams();
  const difficulty = (searchParams.get("difficulty") || "recruit") as BotDifficulty;

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showdown, setShowdown] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [gameOver, setGameOver] = useState(false);

  // Initialiser la partie
  useEffect(() => {
    const state = createGame("hero", "bot-1", "bot-2", EXPRESSO_CONFIG);
    const started = startNewHand(state);
    setGameState(started);
    setMessage("Nouvelle main distribuee. A vous de jouer !");
  }, []);

  // Faire jouer les bots automatiquement
  const playBotTurns = useCallback(
    (state: GameState): GameState => {
      let current = state;

      while (
        current.phase === "betting" &&
        !current.players[current.currentPlayerIndex]?.isHero &&
        current.players[current.currentPlayerIndex]?.isActive
      ) {
        const botAction = getBotAction(current, difficulty);
        const result = playAction(current, botAction);
        current = result.state;

        if (result.showdown) {
          setShowdown(true);
          setMessage(
            `Showdown ! ${result.showdown.winners.map((w) => (w.playerId === "hero" ? "Vous gagnez" : `${w.playerId} gagne`)).join(", ")} ${result.showdown.winners[0].amount} chips`
          );
          break;
        }
      }

      return current;
    },
    [difficulty]
  );

  // Quand c'est au tour d'un bot, le faire jouer
  useEffect(() => {
    if (!gameState || gameState.phase !== "betting") return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.isHero) return;

    // Petit delai pour que ce soit visible
    const timer = setTimeout(() => {
      const newState = playBotTurns(gameState);
      setGameState(newState);
    }, 600);

    return () => clearTimeout(timer);
  }, [gameState, playBotTurns]);

  const handleAction = useCallback(
    (type: ActionType, amount?: number) => {
      if (!gameState || gameState.phase !== "betting") return;

      const action: Action = {
        type,
        amount: amount || 0,
      };

      if (type === "call") {
        const highestBet = Math.max(...gameState.players.map((p) => p.currentBet));
        const hero = gameState.players[gameState.currentPlayerIndex];
        action.amount = highestBet - hero.currentBet;
      }

      if (type === "allin") {
        const hero = gameState.players[gameState.currentPlayerIndex];
        action.amount = hero.stack;
      }

      try {
        const result = playAction(gameState, action);
        let newState = result.state;

        if (result.showdown) {
          setShowdown(true);
          setMessage(
            `Showdown ! ${result.showdown.winners.map((w) => (w.playerId === "hero" ? "Vous gagnez" : `${w.playerId} gagne`)).join(", ")} ${result.showdown.winners[0].amount} chips`
          );
        } else {
          // Faire jouer les bots apres l'action du hero
          newState = playBotTurns(newState);
        }

        setGameState(newState);

        if (isGameOver(newState)) {
          const winner = getWinner(newState);
          setGameOver(true);
          setMessage(
            winner?.isHero
              ? "Victoire ! Vous avez elimine tous les bots !"
              : `Defaite. ${winner?.id} remporte le tournoi.`
          );
        }
      } catch (err: any) {
        setMessage(`Erreur: ${err.message}`);
      }
    },
    [gameState, playBotTurns]
  );

  const handleNextHand = useCallback(() => {
    if (!gameState) return;
    setShowdown(false);
    setMessage("");
    const newState = startNewHand(gameState);
    setGameState(newState);
  }, [gameState]);

  const handleNewGame = useCallback(() => {
    setShowdown(false);
    setGameOver(false);
    setMessage("");
    const state = createGame("hero", "bot-1", "bot-2", EXPRESSO_CONFIG);
    const started = startNewHand(state);
    setGameState(started);
  }, []);

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-400">Chargement...</div>
      </div>
    );
  }

  const info = getStateInfo(gameState);
  const hero = gameState.players.find((p) => p.isHero)!;
  const isHeroTurn =
    gameState.phase === "betting" &&
    gameState.players[gameState.currentPlayerIndex]?.isHero;

  const highestBet = Math.max(...gameState.players.map((p) => p.currentBet));
  const toCall = highestBet - hero.currentBet;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <nav className="border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <Link href="/play" className="text-neutral-400 hover:text-white text-sm transition-colors">
          ← Quitter
        </Link>
        <span className="text-sm text-neutral-400">
          Difficulte : <span className="text-white capitalize">{difficulty}</span>
        </span>
      </nav>

      {/* Table */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8">
        <PokerTable state={gameState} showdown={showdown} />

        {/* Message */}
        {message && (
          <div className="bg-neutral-900/80 border border-neutral-700/50 rounded-lg px-4 py-2 text-sm text-neutral-300 max-w-md text-center">
            {message}
          </div>
        )}

        {/* Actions du hero */}
        {isHeroTurn && !showdown && !gameOver && (
          <ActionPanel
            legalActions={info.legalActions}
            currentBet={toCall}
            heroStack={hero.stack}
            minRaise={getMinRaise(gameState)}
            onAction={handleAction}
          />
        )}

        {/* Bouton main suivante */}
        {showdown && !gameOver && (
          <button
            onClick={handleNextHand}
            className="px-8 py-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-semibold hover:bg-amber-500/30 transition-colors"
          >
            Main suivante
          </button>
        )}

        {/* Game over */}
        {gameOver && (
          <div className="flex gap-4">
            <button
              onClick={handleNewGame}
              className="px-8 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold hover:bg-emerald-500/30 transition-colors"
            >
              Nouvelle partie
            </button>
            <Link
              href="/play"
              className="px-8 py-3 rounded-lg bg-neutral-700/40 border border-neutral-600/40 text-neutral-200 font-semibold hover:bg-neutral-600/40 transition-colors"
            >
              Retour au lobby
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TablePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-neutral-400">Chargement...</div>}>
      <TableContent />
    </Suspense>
  );
}
