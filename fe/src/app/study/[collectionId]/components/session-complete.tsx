"use client";

import Link from "next/link";
import { Trophy, RotateCcw, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SessionCompleteProps {
  correctCount: number;
  incorrectCount: number;
  totalCards: number;
  collectionId: string;
  onRestart: () => void;
}

export function SessionComplete({
  correctCount,
  incorrectCount,
  totalCards,
  collectionId,
  onRestart,
}: SessionCompleteProps) {
  const accuracy = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

  const getMessage = () => {
    if (accuracy >= 90) return "Excellent work!";
    if (accuracy >= 70) return "Great job!";
    if (accuracy >= 50) return "Keep practicing!";
    return "Don't give up!";
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Session Complete!</CardTitle>
          <p className="text-muted-foreground">{getMessage()}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalCards}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Accuracy</span>
              <span className="font-semibold">{accuracy}%</span>
            </div>
            <Progress value={accuracy} className="h-3" />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button onClick={onRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Study Again
            </Button>
            <Link href={`/courses`}>
              <Button variant="outline" className="w-full gap-2">
                <ArrowRight className="h-4 w-4" />
                Browse Courses
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full gap-2">
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
