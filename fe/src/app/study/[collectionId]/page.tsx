"use client";

import { use, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { studyService, collectionsService } from "@/services";
import { useStudyStore } from "@/stores/study-store";
import { StudyFlashcard } from "./components/study-flashcard";
import { SessionComplete } from "./components/session-complete";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface StudyPageProps {
  params: Promise<{ collectionId: string }>;
}

export default function StudyPage({ params }: StudyPageProps) {
  const { collectionId } = use(params);

  const {
    cards,
    currentIndex,
    correctCount,
    incorrectCount,
    isSessionComplete,
    setCards,
    nextCard,
    resetSession,
  } = useStudyStore();

  // Fetch collection info
  const { data: collection } = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => collectionsService.getCollection(collectionId),
    select: (res) => res.data,
  });

  // Fetch study session
  const {
    data: studySession,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["studySession", collectionId],
    queryFn: () => studyService.getStudySessionByCollection(collectionId),
    select: (res) => res.data,
  });

  // Initialize cards when data is loaded
  useEffect(() => {
    if (studySession?.cards && studySession.cards.length > 0) {
      setCards(studySession.cards);
    }
  }, [studySession, setCards]);

  const handleRestart = () => {
    resetSession();
    refetch();
  };

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading study session...</p>
        </div>
      </div>
    );
  }

  if (!studySession || studySession.cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Layers className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No cards to study</h3>
        <p className="text-muted-foreground mb-4">
          This collection has no cards or you&apos;ve completed all reviews for now
        </p>
        <Link href="/courses">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  if (isSessionComplete) {
    return (
      <div className="space-y-6">
        <Link href={`/courses/${collection?.courseId || ""}`}>
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Button>
        </Link>
        <SessionComplete
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          totalCards={cards.length}
          collectionId={collectionId}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/courses/${collection?.courseId || ""}`}>
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-bold">{collection?.title || "Study"}</h1>
          <p className="text-sm text-muted-foreground">
            {studySession.totalNewCards} new, {studySession.totalReviewCards} review
          </p>
        </div>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span>
            <span className="text-green-600">{correctCount}</span>
            {" / "}
            <span className="text-red-600">{incorrectCount}</span>
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      {currentCard && (
        <StudyFlashcard card={currentCard} onAnswered={nextCard} />
      )}
    </div>
  );
}
