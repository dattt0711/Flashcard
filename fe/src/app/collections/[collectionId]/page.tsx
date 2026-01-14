"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  Layers,
  Plus,
  Loader2,
  Play,
  Trash2,
  CreditCard,
} from "lucide-react";
import { collectionsService, cardsService } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface CollectionPageProps {
  params: Promise<{ collectionId: string }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { collectionId } = use(params);
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({
    frontText: "",
    backText: "",
  });

  const { data: collection, isLoading: loadingCollection } = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => collectionsService.getCollection(collectionId),
    select: (res) => res.data,
  });

  const { data: cards, isLoading: loadingCards } = useQuery({
    queryKey: ["cards", collectionId],
    queryFn: () => cardsService.getCardsByCollection(collectionId),
    select: (res) => res.data,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      cardsService.createCard({
        collectionId,
        frontText: newCard.frontText,
        backText: newCard.backText,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", collectionId] });
      queryClient.invalidateQueries({ queryKey: ["collection", collectionId] });
      setIsCreateOpen(false);
      setNewCard({ frontText: "", backText: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cardId: string) => cardsService.deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", collectionId] });
      queryClient.invalidateQueries({ queryKey: ["collection", collectionId] });
      setDeleteCardId(null);
    },
  });

  const isLoading = loadingCollection || loadingCards;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Layers className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Collection not found</h3>
        <Link href="/courses">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href={`/courses/${collection.courseId}`}>
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to {collection.courseTitle}
        </Button>
      </Link>

      {/* Collection Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{collection.title}</h1>
            {collection.description && (
              <p className="text-muted-foreground">{collection.description}</p>
            )}
          </div>
          <Link href={`/study/${collectionId}`}>
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              Start Study
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            <span>{collection.cardCount} cards</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cards</h2>
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </div>
        {cards && cards.length > 0 ? (
          <div className="grid gap-4">
            {cards.map((card) => (
              <Card key={card.id} className="group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-medium">
                      {card.frontText}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      onClick={() => setDeleteCardId(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{card.backText}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center border rounded-lg bg-muted/20">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No cards yet</h3>
            <p className="text-muted-foreground">
              Add cards to start learning
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Card
            </Button>
          </div>
        )}
      </div>

      {/* Create Card Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent onClose={() => setIsCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create New Card</DialogTitle>
            <DialogDescription>
              Add a new flashcard to this collection.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
            className="space-y-4 p-6 pt-4"
          >
            <div className="space-y-2">
              <Label htmlFor="frontText">Front (Question)</Label>
              <Textarea
                id="frontText"
                placeholder="Enter the question or term"
                value={newCard.frontText}
                onChange={(e) =>
                  setNewCard({ ...newCard, frontText: e.target.value })
                }
                required
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backText">Back (Answer)</Label>
              <Textarea
                id="backText"
                placeholder="Enter the answer or definition"
                value={newCard.backText}
                onChange={(e) =>
                  setNewCard({ ...newCard, backText: e.target.value })
                }
                required
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Card"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteCardId} onOpenChange={() => setDeleteCardId(null)}>
        <DialogContent onClose={() => setDeleteCardId(null)}>
          <DialogHeader>
            <DialogTitle>Delete Card</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this card? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="p-6 pt-0">
            <Button variant="outline" onClick={() => setDeleteCardId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteCardId && deleteMutation.mutate(deleteCardId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
