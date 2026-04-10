"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const PILLARS = [
  {
    title: "Guide Théorique",
    description: "Ranges et règles de base.",
    href: "/guide",
    borderBase: "border-duo-neutral",
    borderHover: "hover:border-duo-blue",
    iconBg: "bg-duo-blue",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Parcours Gamifié",
    description: "Puzzles, XP et progression.",
    href: "/learn",
    borderBase: "border-duo-neutral",
    borderHover: "hover:border-duo-amber",
    iconBg: "bg-duo-amber",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: "Simulateur Pro",
    description: "Joue contre nos bots.",
    href: "/play",
    borderBase: "border-duo-neutral",
    borderHover: "hover:border-duo-green",
    iconBg: "bg-duo-green",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12 items-center w-full mb-16">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Apprends le poker,<br />
              <span className="text-duo-green text-transparent">sans te ruiner.</span>
            </h1>
            <p className="text-xl text-duo-neutral mb-8 font-medium">
              Des petites leçons gamifiées gratuites pour devenir imbattable sur les formats Expresso et Spin & Go.
            </p>
            <Link 
              href="/learn" 
              className="btn-duo bg-duo-green text-white border-duo-green-dark px-12 py-4 text-xl w-full md:w-auto hover:bg-duo-green/90"
            >
              COMMENCER
            </Link>
          </div>
          
          <div className="flex-1 max-w-sm w-full">
            {/* Un faux "chemin de parcours" style Duolingo */}
            <div className="flex flex-col items-center gap-4 relative">
              {PILLARS.map((pillar, i) => (
                <Link
                  key={pillar.title}
                  href={pillar.href}
                  className={`card-duo w-full p-6 flex items-center gap-4 group cursor-pointer ${pillar.borderBase} ${pillar.borderHover}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${pillar.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                    {pillar.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1 group-hover:text-duo-blue transition-colors">
                      {pillar.title}
                    </h2>
                    <p className="text-duo-neutral font-medium">
                      {pillar.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
