import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "FlashLearn - Gamified Learning",
  description: "Learn smarter with flashcards, streaks, and leaderboards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>
          <Navigation />
          <main className="pt-24 pb-8 px-4">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
