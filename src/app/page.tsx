"use client";

import Link from "next/link";

const PILLARS = [
  {
    title: "Guide Theorique",
    description: "Ranges, regles de base et erreurs communes du format Expresso.",
    href: "/guide",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    color: "from-blue-500/20 to-blue-600/5 border-blue-500/30 hover:border-blue-400/60",
    iconColor: "text-blue-400",
  },
  {
    title: "Parcours Gamifie",
    description: "Puzzles de mains, XP et progression style Duolingo.",
    href: "/learn",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    color: "from-amber-500/20 to-amber-600/5 border-amber-500/30 hover:border-amber-400/60",
    iconColor: "text-amber-400",
  },
  {
    title: "Simulateur",
    description: "Joue des Expressos contre des bots de 3 niveaux.",
    href: "/play",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    ),
    color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 hover:border-emerald-400/60",
    iconColor: "text-emerald-400",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-amber-400">Poker</span> Expresso
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">Niveau 1</span>
          <div className="w-32 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div className="w-1/4 h-full bg-amber-400 rounded-full" />
          </div>
          <span className="text-sm text-amber-400 font-medium">0 XP</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
          Maitrise le format{" "}
          <span className="text-amber-400">Expresso</span>
        </h1>
        <p className="text-neutral-400 text-lg text-center max-w-xl mb-16">
          Apprends les ranges, entraine-toi sur des puzzles, et affronte des bots
          pour progresser au poker 3-max hyper-turbo.
        </p>

        {/* 3 Piliers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className={`group relative rounded-xl border bg-gradient-to-b p-6 transition-all duration-200 ${pillar.color}`}
            >
              <div className={`mb-4 ${pillar.iconColor}`}>{pillar.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{pillar.title}</h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {pillar.description}
              </p>
              <div className="mt-4 text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                Commencer →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
