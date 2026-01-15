"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { RotateCcw, ThumbsDown, ThumbsUp, Zap, Volume2, Loader2 } from "lucide-react";
import { StudyCardResponse, Rating } from "@/types";
import { studyService } from "@/services";
import { useStudyStore } from "@/stores/study-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StudyFlashcardProps {
  card: StudyCardResponse;
  onAnswered: () => void;
}

// Rating button configuration
const ratingButtons: {
  rating: Rating;
  label: string;
  description: string;
  color: string;
  hoverColor: string;
  icon: React.ReactNode;
}[] = [
  {
    rating: "AGAIN",
    label: "Again",
    description: "< 1 min",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
    icon: <RotateCcw className="h-4 w-4" />,
  },
  {
    rating: "HARD",
    label: "Hard",
    description: "< 6 min",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    icon: <ThumbsDown className="h-4 w-4" />,
  },
  {
    rating: "GOOD",
    label: "Good",
    description: "< 10 min",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    icon: <ThumbsUp className="h-4 w-4" />,
  },
  {
    rating: "EASY",
    label: "Easy",
    description: "4 days",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    icon: <Zap className="h-4 w-4" />,
  },
];

export function StudyFlashcard({ card, onAnswered }: StudyFlashcardProps) {
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayCard, setDisplayCard] = useState<StudyCardResponse | null>(card);
  const { isFlipped, flipCard, setFlipped, recordAnswer } = useStudyStore();
  // When new card data arrives while loading, show it
  useEffect(() => {
    if (isLoading && card.cardId !== displayCard?.cardId) {
      setDisplayCard(card);
      setIsLoading(false);
      setSelectedRating(null);
    }
  }, [card, isLoading, displayCard?.cardId]);

  const transitionToNextCard = async () => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(450); // Show rating feedback
    setFlipped(false); // Flip back to front
    await delay(300); // Wait for flip animation
    setDisplayCard(null); // Clear card content - show loading
    setIsLoading(true);
    setSelectedRating(null);
    onAnswered(); // Trigger fetch next card
  };

  const reviewMutation = useMutation({
    mutationFn: ({ cardId, rating }: { cardId: string; rating: Rating }) =>
      studyService.submitReview(cardId, rating),
    onSuccess: (_, variables) => {
      const isCorrect = variables.rating !== "AGAIN";
      recordAnswer(isCorrect);
      transitionToNextCard();
    },
    onError: (error) => {
      setSelectedRating(null);
      toast.error("Failed to submit review. Please try again.");
      console.error("Review error:", error);
    },
  });

  const handleRating = (rating: Rating, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRating(rating);
    reviewMutation.mutate({ cardId: card.cardId, rating });
  };

  const playAudio = (url: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  };

  const getResultColor = () => {
    if (!selectedRating) return "";
    switch (selectedRating) {
      case "AGAIN":
        return "ring-4 ring-red-500";
      case "HARD":
        return "ring-4 ring-orange-500";
      case "GOOD":
        return "ring-4 ring-green-500";
      case "EASY":
        return "ring-4 ring-blue-500";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Flashcard */}
      <div
        className="flip-card h-80 cursor-pointer"
        onClick={!isLoading ? flipCard : undefined}
      >
        <div
          className={cn(
            "flip-card-inner relative w-full h-full",
            isFlipped && "flipped"
          )}
        >
          {/* Front - Question */}
          <Card
            className={cn(
              "flip-card-front absolute w-full h-full flex flex-col items-center justify-center p-8 transition-all",
              getResultColor()
            )}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading next card...</p>
              </div>
            ) : displayCard ? (
              <>
                <div className="absolute top-4 left-4 text-xs text-muted-foreground">
                  {displayCard.collectionTitle}
                </div>
                {displayCard.isNew && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      New
                    </span>
                  </div>
                )}
                {displayCard.frontAudioUrl && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={(e) => playAudio(displayCard.frontAudioUrl, e)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
                <h2 className="text-2xl font-bold text-center leading-relaxed">
                  {displayCard.frontText}
                </h2>
                <p className="absolute bottom-4 text-sm text-muted-foreground">
                  Tap to reveal answer
                </p>
              </>
            ) : null}
          </Card>

          {/* Back - Answer */}
          <Card
            className={cn(
              "flip-card-back absolute w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-primary/10",
              getResultColor()
            )}
          >
            {displayCard && (
              <>
                <p className="absolute top-4 left-4 text-sm text-muted-foreground">
                  Answer
                </p>
                {displayCard.backAudioUrl && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={(e) => playAudio(displayCard.backAudioUrl, e)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
                <h2 className="text-3xl font-bold text-center text-primary">
                  {displayCard.backText}
                </h2>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Rating Buttons - Only show when flipped and card is displayed */}
      {isFlipped && displayCard && !isLoading && (
        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground">
            How well did you know this?
          </p>
          <div className="flex justify-center gap-2 sm:gap-3">
            {ratingButtons.map((btn) => (
              <Button
                key={btn.rating}
                onClick={(e) => handleRating(btn.rating, e)}
                disabled={reviewMutation.isPending || selectedRating !== null}
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-3 px-3 sm:px-5 text-white transition-all",
                  btn.color,
                  btn.hoverColor,
                  selectedRating === btn.rating && "ring-2 ring-offset-2 ring-white scale-105"
                )}
              >
                {btn.icon}
                <span className="text-sm font-medium">{btn.label}</span>
                <span className="text-xs opacity-80">{btn.description}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
