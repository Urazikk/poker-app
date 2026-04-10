"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const CHAPTERS = [
  {
    id: "fondamentaux",
    title: "Chapitre 1 : Fondamentaux Mathématiques",
    description: "Expected Value (EV), Équité et fréquences de bluff GTO.",
    color: "bg-duo-blue border-duo-blue-dark",
    icon: "🧮",
  },
  {
    id: "preflop-deep",
    title: "Chapitre 2 : Stratégie Préflop (20-25bb)",
    description: "Ranges d'Open et de Défense en Deep Stack.",
    color: "bg-duo-green border-duo-green-dark",
    icon: "🃏",
  },
  {
    id: "push-fold",
    title: "Chapitre 3 : Théorie Push-or-Fold (<10bb)",
    description: "Les équilibres de Nash et mathématiques du short stack.",
    color: "bg-duo-red border-duo-red-dark",
    icon: "🔥",
  },
  {
    id: "postflop",
    title: "Chapitre 4 : Dynamiques Postflop",
    description: "Fréquences de C-Bet et matrice Protection vs Slowplay.",
    color: "bg-duo-amber border-duo-amber-dark",
    icon: "🎲",
  },
  {
    id: "mental-bankroll",
    title: "Chapitre 5 : Mental & Bankroll",
    description: "Critère de Kelly, gestion de la variance et anti-tilt.",
    color: "bg-[#9c59b6] border-[#8e44ad]", // Violet custom
    icon: "🧘‍♂️",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar />

      <main className="flex-1 w-full max-w-3xl flex flex-col px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="btn-duo bg-duo-neutral border-[#2a3c44] text-white w-12 h-12 rounded-full hover:bg-duo-card-hover">
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Le Guide Théorique</h1>
            <p className="text-duo-neutral font-medium">L'encyclopédie du joueur d'Expresso</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {CHAPTERS.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/guide/${chapter.id}`}
              className={`card-duo flex items-center p-4 border-b-4 hover:-translate-y-1 transition-transform group`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-sm ${chapter.color} text-white`}>
                {chapter.icon}
              </div>
              <div className="ml-6 flex-1">
                <h2 className="text-xl font-bold text-white group-hover:text-duo-blue transition-colors">
                  {chapter.title}
                </h2>
                <p className="text-duo-neutral font-medium mt-1">
                  {chapter.description}
                </p>
              </div>
              <div className="hidden md:flex bg-duo-neutral/50 text-white font-bold rounded-full px-4 py-2 text-sm group-hover:bg-duo-blue transition-colors">
                LIRE
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
