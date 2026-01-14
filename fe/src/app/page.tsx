"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BookOpen, Trophy, Sparkles, ArrowRight, Target } from "lucide-react";
import { statsService } from "@/services";
import { useUserStore } from "@/stores/user-store";
import { StreakTracker } from "@/components/streak-tracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user, setUserStats } = useUserStore();

  const { data: userStats } = useQuery({
    queryKey: ["userStats"],
    queryFn: () => statsService.getUserStats(),
    select: (res) => res.data,
  });

  useEffect(() => {
    if (userStats) {
      setUserStats(userStats);
    }
  }, [userStats]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back{user ? `, ${user.username}` : ""}!
          </h1>
          <p className="text-white/80 text-lg mb-6">
            Ready to continue your learning journeyyy?
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/courses">
              <Button size="xl" variant="secondary" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Start Studying
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                size="xl"
                variant="ghost"
                className="gap-2 text-white hover:text-white hover:bg-white/20"
              >
                <Trophy className="h-5 w-5" />
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <StreakTracker />

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/courses" className="cursor-pointer">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                Browse Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Explore courses and study flashcards to learn new things.
              </p>
              <Button variant="outline" className="w-full gap-2">
                View Courses
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/leaderboard" className="cursor-pointer">
          <Card className="h-full transition-all hover:shadow-lg hover:border-gold/50 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gold/10">
                  <Trophy className="h-5 w-5 text-gold" />
                </div>
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                See how you rank against other learners worldwide.
              </p>
              <Button variant="outline" className="w-full gap-2">
                View Rankings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Card className="h-full transition-all hover:shadow-lg hover:border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Target className="h-5 w-5 text-accent" />
              </div>
              Daily Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Complete daily challenges to maintain your streak.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Study 10 cards</span>
                <span className="text-accent font-medium">
                  {Math.min(user?.todayCardsStudied || 0, 10)}/10
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Complete 5 reviews</span>
                <span className="text-accent font-medium">
                  {Math.min(user?.todayReviewCards || 0, 5)}/5
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Banner */}
      <Card className="bg-gradient-to-r from-xp/10 via-combo/10 to-streak/10 border-none">
        <CardContent className="flex items-center justify-center gap-4 py-8">
          <Sparkles className="h-8 w-8 text-xp" />
          <p className="text-lg font-medium text-center">
            Keep up the great work! Every card you study brings you closer to
            mastery.
          </p>
          <Sparkles className="h-8 w-8 text-combo" />
        </CardContent>
      </Card>
    </div>
  );
}
