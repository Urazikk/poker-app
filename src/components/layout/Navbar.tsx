"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // On peut cacher la navbar dans le lobby de la table in-game (ex: /play/table)
  if (pathname?.startsWith("/play/table")) {
    return null;
  }

  return (
    <nav className="w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm group-hover:-translate-y-1 transition-transform">
            <img src="/images/logo.png" alt="PokerDuo Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white group-hover:opacity-80 transition-opacity">
            <span className="text-duo-green">Poker</span>Duo
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-6 font-bold text-lg">
        {/* Streak */}
        <div className="flex items-center gap-2 text-duo-amber">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8 6 4 10 4 15c0 4.418 3.582 8 8 8s8-3.582 8-8c0-5-4-9-8-13z" />
          </svg>
          <span>2</span>
        </div>
        {/* Gems/XP */}
        <div className="flex items-center gap-2 text-duo-blue">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l8 6v8l-8 6-8-6V8l8-6z" />
          </svg>
          <span>150</span>
        </div>
        {/* Hearts */}
        <div className="flex items-center gap-2 text-duo-red hidden md:flex">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>5</span>
        </div>
        
        {/* Profile Link */}
        <Link href="/profile" className="ml-4 w-10 h-10 rounded-full border-2 border-duo-neutral-dark bg-duo-neutral overflow-hidden hover:opacity-80 transition-opacity">
           <img src="/images/avatars/shark.png" alt="Profile" className="w-full h-full object-cover" />
        </Link>
      </div>
    </nav>
  );
}
