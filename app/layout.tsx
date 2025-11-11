import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BettingTip - Expert Sports Predictions & Betting Tips",
  description: "Get daily expert sports predictions and betting tips with real-time match data and statistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 BettingTip. All rights reserved.</p>
            <p className="text-sm text-gray-400 mt-2">
              Bet responsibly. Gambling can be addictive.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
