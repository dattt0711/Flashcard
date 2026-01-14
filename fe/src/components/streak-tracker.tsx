"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flame, Target, Trophy, Zap, TrendingUp } from "lucide-react";
import { statsService } from "@/services";
import { useUserStore } from "@/stores/user-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StreakTracker() {
  const { user, setUserStats } = useUserStore();

  const { data } = useQuery({
    queryKey: ["userStats"],
    queryFn: () => statsService.getUserStats(),
  });

  useEffect(() => {
    if (data?.data) {
      setUserStats(data.data);
    }
  }, [data, setUserStats]);

  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const xpProgress = (user.xp / user.xpToNextLevel) * 100;
  const accuracy =
    user.totalReviews > 0
      ? Math.round((user.totalCardsLearned / user.totalReviews) * 100)
      : 0;

  // Streak milestones
  const streakMilestones = [7, 14, 30, 60, 100];
  const nextMilestone =
    streakMilestones.find((m) => m > user.currentStreak) || 100;
  const streakProgress = Math.min(
    (user.currentStreak / nextMilestone) * 100,
    100
  );

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-streak/20 to-transparent" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={cn(
                  "p-2 rounded-lg bg-streak/20",
                  user.currentStreak > 0 && "animate-flame"
                )}
              >
                <Flame className="h-5 w-5 text-streak" />
              </div>
              <span className="text-sm text-muted-foreground">Streak</span>
            </div>
            <p className="text-3xl font-bold text-streak">
              {user.currentStreak}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Best: {user.longestStreak} days
            </p>
          </CardContent>
        </Card>

        {/* Level */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-xp/20 to-transparent" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-xp/20">
                <Zap className="h-5 w-5 text-xp" />
              </div>
              <span className="text-sm text-muted-foreground">Level</span>
            </div>
            <p className="text-3xl font-bold text-xp">{user.level}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {user.xp} / {user.xpToNextLevel} XP
            </p>
          </CardContent>
        </Card>

        {/* Cards Studied */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Studied</span>
            </div>
            <p className="text-3xl font-bold text-primary">
              {user.totalCardsLearned}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total cards</p>
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-level-up/20 to-transparent" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-level-up/20">
                <TrendingUp className="h-5 w-5 text-level-up" />
              </div>
              <span className="text-sm text-muted-foreground">Accuracy</span>
            </div>
            <p className="text-3xl font-bold text-level-up">{accuracy}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {user.totalReviews} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-xp" />
              Level Progress
            </span>
            <Badge variant="xp">Level {user.level}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={xpProgress}
            className="h-3"
            indicatorClassName="bg-gradient-to-r from-xp to-combo"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-muted-foreground">{user.xp} XP</span>
            <span className="text-muted-foreground">
              {user.xpToNextLevel - user.xp} XP to Level {user.level + 1}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Streak Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold" />
              Next Milestone
            </span>
            <Badge variant="streak">{nextMilestone} Days</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={streakProgress}
            className="h-3"
            indicatorClassName="bg-gradient-to-r from-streak to-gold"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-muted-foreground">
              {user.currentStreak} day streak
            </span>
            <span className="text-muted-foreground">
              {nextMilestone - user.currentStreak} days to go
            </span>
          </div>

          {/* Milestone Markers */}
          <div className="flex justify-between mt-4">
            {streakMilestones.map((milestone) => (
              <div
                key={milestone}
                className={cn(
                  "flex flex-col items-center",
                  user.currentStreak >= milestone
                    ? "text-gold"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2",
                    user.currentStreak >= milestone
                      ? "bg-gold/20 border-gold"
                      : "bg-muted border-muted-foreground/30"
                  )}
                >
                  {milestone}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
