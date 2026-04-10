"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const AVATARS = [
  { id: "shark", name: "Requin", src: "/images/avatars/shark.png" },
  { id: "bee", name: "Abeille", src: "/images/avatars/bee.png" },
  { id: "lobster", name: "Homard", src: "/images/avatars/lobster.png" },
  { id: "owl", name: "Hibou", src: "/images/avatars/owl.png" },
  { id: "fox", name: "Renard", src: "/images/avatars/fox.png" },
  { id: "wolf", name: "Loup", src: "/images/avatars/wolf.png" },
  { id: "cat", name: "Chat", src: "/images/avatars/cat.png" },
];

const TABLES = [
  { id: "winamax-classic", name: "Vert Winamax", colorClass: "bg-[#1f3a30] border-[#12241d]" },
  { id: "vegas-red", name: "Rouge Vegas", colorClass: "bg-duo-red border-duo-red-dark" },
  { id: "midnight-blue", name: "Bleu Nuit", colorClass: "bg-duo-blue border-duo-blue-dark" },
];

const CARD_BACKS = [
  { id: "classic-red", name: "Classique", colorClass: "bg-red-600 border-red-800" },
  { id: "classic-blue", name: "Bicycle", colorClass: "bg-blue-600 border-blue-800" },
  { id: "pro-black", name: "Pro Noir", colorClass: "bg-neutral-800 border-black" },
];

export default function ProfilePage() {
  const [activeAvatar, setActiveAvatar] = useState("shark");
  const [activeTable, setActiveTable] = useState("winamax-classic");
  const [activeCard, setActiveCard] = useState("classic-red");

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl flex flex-col px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="btn-duo bg-duo-neutral border-[#2a3c44] text-white w-12 h-12 rounded-full hover:bg-duo-card-hover">
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Mon Profil</h1>
            <p className="text-duo-neutral font-medium">Personnalise ton expérience de jeu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section Gauche : Avatar */}
          <div className="flex flex-col gap-6">
            <section className="card-duo p-6">
              <h2 className="text-xl font-bold text-white mb-6">Choisis ton Avatar</h2>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {AVATARS.map((avatar) => {
                  const isActive = activeAvatar === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => setActiveAvatar(avatar.id)}
                      className={`
                        relative w-full aspect-square rounded-2xl overflow-hidden transition-all
                        ${isActive ? "ring-4 ring-duo-blue scale-105 shadow-lg" : "scale-100 opacity-60 hover:opacity-100 hover:scale-105"}
                      `}
                    >
                      <img src={avatar.src} alt={avatar.name} className="w-full h-full object-cover" />
                      {isActive && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-duo-blue rounded-full border-2 border-white flex items-center justify-center">
                          <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-center">
                 <div className="text-center">
                   <div className="w-32 h-32 mx-auto rounded-3xl overflow-hidden shadow-xl ring-4 ring-duo-neutral border-4 border-duo-neutral-dark mb-4">
                     <img src={AVATARS.find(a => a.id === activeAvatar)?.src} alt="Current" className="w-full h-full object-cover" />
                   </div>
                   <h3 className="text-2xl font-bold text-white">{AVATARS.find(a => a.id === activeAvatar)?.name}</h3>
                   <p className="text-duo-green font-bold">Niveau 12</p>
                 </div>
              </div>
            </section>
          </div>

          {/* Section Droite : Personnalisation Plateau */}
          <div className="flex flex-col gap-6">
            <section className="card-duo p-6">
              <h2 className="text-xl font-bold text-white mb-6">Couleur du Tapis</h2>
              <div className="grid grid-cols-3 gap-4">
                {TABLES.map((table) => {
                  const isActive = activeTable === table.id;
                  return (
                    <button
                      key={table.id}
                      onClick={() => setActiveTable(table.id)}
                      className={`
                        btn-duo aspect-video rounded-xl flex items-center justify-center text-sm font-bold text-white transition-all
                        ${table.colorClass}
                        ${isActive ? "ring-4 ring-white" : "opacity-70 hover:opacity-100"}
                      `}
                    >
                      {table.name}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="card-duo p-6">
              <h2 className="text-xl font-bold text-white mb-6">Dos de Cartes</h2>
              <div className="grid grid-cols-3 gap-4">
                {CARD_BACKS.map((card) => {
                  const isActive = activeCard === card.id;
                  return (
                    <button
                      key={card.id}
                      onClick={() => setActiveCard(card.id)}
                      className={`
                        btn-duo aspect-[2.5/3.5] rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all
                        ${card.colorClass} border-b-8 border-x-4
                        ${isActive ? "ring-4 ring-white" : "opacity-70 hover:opacity-100"}
                      `}
                    >
                      <div className="w-full h-full border-2 border-white/20 m-1 rounded bg-white/10 flex items-center justify-center">
                        ♠
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <button className="btn-duo bg-duo-green border-duo-green-dark text-white text-xl font-bold py-4 mt-auto">
              SAUVEGARDER
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
