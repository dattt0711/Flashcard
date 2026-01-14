"use client";

import { LeaderboardList } from "./components/leaderboard-list";

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you rank against other learners
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <LeaderboardList />
      </div>
    </div>
  );
}
