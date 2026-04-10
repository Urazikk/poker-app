"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const DIFFICULTIES = [
  {
    id: "recruit",
    name: "Recrue",
    description: "Bots passifs et prévisibles. Idéal pour débuter.",
    colorClass: "bg-duo-green border-duo-green-dark",
    textColor: "text-duo-green",
    icon: "🐣",
  },
  {
    id: "regular",
    name: "Régulier",
    description: "Bots avec des ranges standards. Push-or-fold correct.",
    colorClass: "bg-duo-amber border-duo-amber-dark",
    textColor: "text-duo-amber",
    icon: "🤓",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Bots agressifs et adaptatifs. Proche du GTO.",
    colorClass: "bg-duo-red border-duo-red-dark",
    textColor: "text-duo-red",
    icon: "🤖",
  },
];

export default function PlayLobby() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl flex flex-col px-6 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/" className="btn-duo bg-duo-neutral border-[#2a3c44] text-white w-12 h-12 rounded-full hover:bg-duo-card-hover">
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Simulateur Expresso</h1>
            <p className="text-duo-neutral font-medium">Affrontez nos bots d'entraînement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {DIFFICULTIES.map((diff) => (
            <div
              key={diff.id}
              className="card-duo flex flex-col p-6 items-center text-center justify-between min-h-[300px]"
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-sm border-b-4 ${diff.colorClass}`}>
                {diff.icon}
              </div>
              
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-2 uppercase ${diff.textColor}`}>
                  {diff.name}
                </h2>
                <p className="text-white font-medium mb-6">
                  {diff.description}
                </p>
              </div>

              <Link
                href={`/play/table?difficulty=${diff.id}`}
                className={`btn-duo w-full text-white py-4 text-xl ${diff.colorClass} hover:opacity-90`}
              >
                JOUER
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
