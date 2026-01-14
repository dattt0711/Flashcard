"use client";

import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Flame, Crown, Star } from "lucide-react";
import { statsService } from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LeaderboardList() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => statsService.getLeaderboard(),
    select: (res) => res.data,
  });

  // Mock current user ID for highlighting
  const currentUserId = "u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c";

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-gold" />;
      case 2:
        return <Medal className="h-5 w-5 text-silver" />;
      case 3:
        return <Medal className="h-5 w-5 text-bronze" />;
      default:
        return (
          <span className="w-5 text-center font-bold text-muted-foreground">
            {rank}
          </span>
        );
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "gold";
      case 2:
        return "silver";
      case 3:
        return "bronze";
      default:
        return "secondary";
    }
  };

  // Split into podium (top 3) and rest
  const podium = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  // Generate avatar URL from username
  const getAvatarUrl = (username: string) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold" />
          Daily Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Podium */}
        <div className="flex items-end justify-center gap-4 pb-4">
          {/* 2nd Place */}
          {podium[1] && (
            <div className="flex flex-col items-center">
              <Avatar className="h-16 w-16 ring-4 ring-silver">
                <AvatarImage
                  src={getAvatarUrl(podium[1].username)}
                  alt={podium[1].username}
                />
                <AvatarFallback>{podium[1].username[0]}</AvatarFallback>
              </Avatar>
              <div className="mt-2 w-20 h-16 bg-gradient-to-t from-silver/30 to-silver/10 rounded-t-lg flex items-center justify-center">
                <Medal className="h-8 w-8 text-silver" />
              </div>
              <p className="text-sm font-semibold mt-1 truncate max-w-[80px]">
                {podium[1].username}
              </p>
              <p className="text-xs text-muted-foreground">
                {podium[1].score.toLocaleString()} pts
              </p>
            </div>
          )}

          {/* 1st Place */}
          {podium[0] && (
            <div className="flex flex-col items-center -mt-4">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-gold">
                  <AvatarImage
                    src={getAvatarUrl(podium[0].username)}
                    alt={podium[0].username}
                  />
                  <AvatarFallback>{podium[0].username[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Crown className="h-6 w-6 text-gold animate-pulse" />
                </div>
              </div>
              <div className="mt-2 w-24 h-24 bg-gradient-to-t from-gold/30 to-gold/10 rounded-t-lg flex items-center justify-center">
                <Trophy className="h-10 w-10 text-gold" />
              </div>
              <p className="text-sm font-bold mt-1 truncate max-w-[96px]">
                {podium[0].username}
              </p>
              <p className="text-xs text-muted-foreground">
                {podium[0].score.toLocaleString()} pts
              </p>
            </div>
          )}

          {/* 3rd Place */}
          {podium[2] && (
            <div className="flex flex-col items-center">
              <Avatar className="h-14 w-14 ring-4 ring-bronze">
                <AvatarImage
                  src={getAvatarUrl(podium[2].username)}
                  alt={podium[2].username}
                />
                <AvatarFallback>{podium[2].username[0]}</AvatarFallback>
              </Avatar>
              <div className="mt-2 w-20 h-12 bg-gradient-to-t from-bronze/30 to-bronze/10 rounded-t-lg flex items-center justify-center">
                <Medal className="h-6 w-6 text-bronze" />
              </div>
              <p className="text-sm font-semibold mt-1 truncate max-w-[80px]">
                {podium[2].username}
              </p>
              <p className="text-xs text-muted-foreground">
                {podium[2].score.toLocaleString()} pts
              </p>
            </div>
          )}
        </div>

        {/* Rest of Leaderboard */}
        <div className="space-y-2">
          {rest.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            return (
              <div
                key={entry.userId}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-colors",
                  isCurrentUser && "bg-primary/10 ring-1 ring-primary"
                )}
              >
                <div className="w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={getAvatarUrl(entry.username)}
                    alt={entry.username}
                  />
                  <AvatarFallback>{entry.username[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "font-semibold truncate",
                        isCurrentUser && "text-primary"
                      )}
                    >
                      {entry.username}
                      {isCurrentUser && (
                        <span className="text-xs ml-2 text-muted-foreground">
                          (You)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    variant={
                      getRankBadge(entry.rank) as
                        | "gold"
                        | "silver"
                        | "bronze"
                        | "secondary"
                    }
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {entry.score.toLocaleString()}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
