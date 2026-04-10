"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const LEVELS = [
  { id: 1, type: "start", status: "completed", top: 0, left: 50 },
  { id: 2, type: "lesson", status: "completed", top: 100, left: 35 },
  { id: 3, type: "lesson", status: "current", top: 200, left: 65 },
  { id: 4, type: "chest", status: "locked", top: 300, left: 80 },
  { id: 5, type: "lesson", status: "locked", top: 400, left: 50 },
  { id: 6, type: "boss", status: "locked", top: 500, left: 20 },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen flex flex-col items-center overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-lg flex flex-col px-6 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/" className="btn-duo bg-duo-neutral border-[#2a3c44] text-white w-12 h-12 rounded-full hover:bg-duo-card-hover">
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Parcours Gamifié</h1>
            <p className="text-duo-neutral font-medium">Unité 1 : Les bases préflop</p>
          </div>
        </div>

        {/* Path container */}
        <div className="relative w-full h-[600px] flex justify-center mt-8">
          {/* Ligne connectrice SVG */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <path
              d="M 250 35 C 175 135, 325 235, 400 335 C 250 435, 100 535, 100 535"
              fill="transparent"
              stroke="#37464f"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50"
            />
          </svg>

          {/* Nods */}
          {LEVELS.map((level, i) => {
            let bgColor = "bg-duo-neutral";
            let borderColor = "border-[#2a3c44]";
            let icon = "🔒";

            if (level.status === "completed") {
              bgColor = "bg-duo-amber";
              borderColor = "border-duo-amber-dark";
              icon = "⭐";
            } else if (level.status === "current") {
              bgColor = "bg-duo-green";
              borderColor = "border-duo-green-dark";
              icon = "🌟";
            }

            if (level.type === "chest") icon = "🎁";
            if (level.type === "boss") icon = "🏰";

            return (
              <div 
                key={level.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: `${level.top}px`, left: `${level.left}%` }}
              >
                <div className={`
                  btn-duo w-20 h-20 rounded-full flex items-center justify-center text-3xl
                  ${bgColor} border-b-6 ${borderColor} shadow-lx
                  ${level.status === "locked" ? "opacity-60 grayscale cursor-not-allowed" : "cursor-pointer hover:bg-opacity-90 active:-translate-y-2 active:border-b-0"}
                `}>
                  {icon}
                </div>
                
                {/* Petit tooltip "Commencer" sur le niveau actuel */}
                {level.status === "current" && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-duo-green font-bold px-4 py-2 rounded-xl shadow-lg border-2 border-neutral-200 animate-bounce whitespace-nowrap z-20">
                    Commencer !
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-neutral-200 transform rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
