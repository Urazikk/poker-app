# Poker Expresso - Structure du Projet

```
poker-expresso/
├── public/
│   ├── images/
│   │   ├── cards/              # Sprites des cartes (52 cartes + dos)
│   │   └── chips/              # Visuels des jetons
│   └── sounds/                 # Sons de jeu (deal, chips, fold...)
│
├── src/
│   ├── app/                    # App Router Next.js
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing / Dashboard
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── guide/              # Pilier 1 : Guide Theorique
│   │   │   ├── page.tsx        # Index des chapitres
│   │   │   ├── [slug]/page.tsx # Page d'un chapitre
│   │   │   └── ranges/page.tsx # Tableaux de ranges interactifs
│   │   ├── learn/              # Pilier 2 : Parcours Gamifie
│   │   │   ├── page.tsx        # Vue progression (carte des niveaux)
│   │   │   ├── [levelId]/page.tsx      # Ecran d'un niveau
│   │   │   └── [levelId]/puzzle/[puzzleId]/page.tsx  # Puzzle de main
│   │   ├── play/               # Pilier 3 : Simulateur
│   │   │   ├── page.tsx        # Lobby (choix difficulte)
│   │   │   ├── table/page.tsx  # Table de jeu active
│   │   │   └── review/[gameId]/page.tsx  # Rapport post-partie
│   │   └── profile/
│   │       └── page.tsx        # Stats et progression utilisateur
│   │
│   ├── components/
│   │   ├── ui/                 # Composants generiques (Button, Card, Modal...)
│   │   ├── guide/
│   │   │   ├── RangeTable.tsx          # Tableau de range interactif
│   │   │   ├── ChapterNav.tsx          # Navigation entre chapitres
│   │   │   └── HandExample.tsx         # Illustration d'une main
│   │   ├── learn/
│   │   │   ├── LevelMap.tsx            # Carte de progression Duolingo-style
│   │   │   ├── PuzzleCard.tsx          # Affichage d'un puzzle
│   │   │   ├── ActionSelector.tsx      # Boutons Fold/Call/Raise
│   │   │   ├── XPBar.tsx              # Barre d'experience
│   │   │   └── StreakCounter.tsx       # Compteur de serie
│   │   ├── play/
│   │   │   ├── PokerTable.tsx          # Table de jeu (layout visuel)
│   │   │   ├── PlayerSeat.tsx          # Siege d'un joueur
│   │   │   ├── CommunityCards.tsx      # Cartes communes (board)
│   │   │   ├── PotDisplay.tsx          # Affichage du pot
│   │   │   ├── ActionPanel.tsx         # Panel Fold/Call/Raise in-game
│   │   │   ├── BlindsTimer.tsx         # Timer des blinds
│   │   │   └── ReviewReport.tsx        # Rapport de fin de partie
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   │
│   ├── engine/                 # Moteur de jeu (logique pure, sans UI)
│   │   ├── types.ts            # Types du jeu (Card, Player, GameState...)
│   │   ├── deck.ts             # Creation et melange du deck
│   │   ├── evaluator.ts        # Evaluation des mains (ranking)
│   │   ├── game.ts             # Boucle de jeu principale
│   │   ├── betting.ts          # Logique des tours de mise
│   │   ├── blinds.ts           # Structure des blinds Expresso
│   │   └── showdown.ts         # Resolution du showdown
│   │
│   ├── bots/                   # IA des bots
│   │   ├── types.ts            # Interface BotStrategy
│   │   ├── bot-engine.ts       # Moteur de decision
│   │   ├── recruit.ts          # Bot Recrue (passif, previsible)
│   │   ├── regular.ts          # Bot Regulier (ranges standards)
│   │   └── pro.ts              # Bot Pro (adaptatif, GTO-like)
│   │
│   ├── ranges/                 # Donnees des ranges optimales
│   │   ├── preflop-charts.ts   # Charts preflop par position/stack
│   │   ├── push-fold.ts        # Tables push-or-fold par BB
│   │   └── call-ranges.ts     # Ranges de call vs push
│   │
│   ├── lib/                    # Utilitaires et config
│   │   ├── supabase/
│   │   │   ├── client.ts       # Client Supabase (browser)
│   │   │   ├── server.ts       # Client Supabase (server)
│   │   │   └── types.ts        # Types auto-generes depuis le schema
│   │   ├── xp.ts               # Calcul XP et niveaux
│   │   └── utils.ts            # Helpers divers
│   │
│   ├── hooks/                  # React hooks custom
│   │   ├── useGame.ts          # Hook principal du simulateur
│   │   ├── useProgress.ts      # Hook progression utilisateur
│   │   └── useRanges.ts        # Hook chargement des ranges
│   │
│   └── stores/                 # State management (Zustand)
│       ├── game-store.ts       # Etat de la partie en cours
│       └── user-store.ts       # Etat utilisateur / session
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Schema initial
│   └── seed.sql                    # Donnees initiales (chapitres, puzzles, ranges)
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.local                  # NEXT_PUBLIC_SUPABASE_URL, ANON_KEY
```
