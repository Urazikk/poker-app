"use client";

import Link from "next/link";

const DIFFICULTIES = [
  {
    id: "recruit",
    name: "Recrue",
    description: "Bots passifs et previsibles. Ideal pour debuter.",
    color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 hover:border-emerald-400/60",
    badge: "text-emerald-400 bg-emerald-500/10",
  },
  {
    id: "regular",
    name: "Regulier",
    description: "Bots avec des ranges standards. Push-or-fold correct.",
    color: "from-amber-500/20 to-amber-600/5 border-amber-500/30 hover:border-amber-400/60",
    badge: "text-amber-400 bg-amber-500/10",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Bots agressifs et adaptatifs. Proche du GTO.",
    color: "from-red-500/20 to-red-600/5 border-red-500/30 hover:border-red-400/60",
    badge: "text-red-400 bg-red-500/10",
  },
];

export default function PlayLobby() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-white/10 px-6 py-4">
        <Link href="/" className="text-neutral-400 hover:text-white text-sm transition-colors">
          ← Retour
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Simulateur Expresso</h1>
        <p className="text-neutral-400 mb-12">Choisis la difficulte des bots</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {DIFFICULTIES.map((diff) => (
            <Link
              key={diff.id}
              href={`/play/table?difficulty=${diff.id}`}
              className={`group rounded-xl border bg-gradient-to-b p-6 transition-all duration-200 ${diff.color}`}
            >
              <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${diff.badge} mb-4`}>
                {diff.name}
              </span>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                {diff.description}
              </p>
              <div className="text-sm text-neutral-300 group-hover:text-white font-medium transition-colors">
                Jouer →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
