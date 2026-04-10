import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokerDuo - Apprends, Pratique, Domine",
  description: "Plateforme d'apprentissage du poker gamifiée",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
