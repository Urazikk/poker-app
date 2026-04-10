# Poker Expresso ☕️♠️

Une application web complète pour apprendre, s'entraîner et maîtriser les Sit & Go Expresso (Jackpot Spin & Go) au poker.

## 🎯 Raison d'être (Purpose)

Le projet **Poker Expresso** a pour objectif de fournir une plateforme d'apprentissage progressive et interactive dédiée aux formats de poker courts et rapides (Expresso/Spin & Go). 
L'application propose une pédagogie en trois piliers interactifs :

1. **Guide Théorique** : Des cours structurés et des tableaux de ranges interactifs pour comprendre les fondamentaux préflop et postflop.
2. **Parcours Gamifié** : Des puzzles interactifs et des exercices de "Push or Fold" inspirés de Duolingo (avec un système d'XP, niveaux de progression, et suivi des séries de victoires).
3. **Simulateur de Jeu** : Une véritable table de poker implémentée de zéro pour s'entraîner en conditions réelles contre notre moteur de bots de divers niveaux (Recrue, Régulier, Pro). Vous recevez ensuite des rapports d'analyse post-partie permettant d'identifier et corriger vos erreurs (leaks).

## 🛠️ Stack Technique

- **Frontend** : Next.js 15+, React 19, TypeScript
- **Style** : Tailwind CSS v4
- **State Management** : Zustand
- **Backend / Database** : Supabase (Auth & PostgreSQL)
- **Logique de Jeu** : Moteur de poker customisé (évaluation des mains, stratégies IA, logique des tournois Expresso)

## 🚀 Démarrage rapide

1. Cloner le repository
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.
