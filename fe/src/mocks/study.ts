import {
  StudyCardResponse,
  StudySessionResponse,
  ReviewResponse,
  CollectionProgressResponse,
  Rating,
} from '@/types';
import { mockCards } from './cards';

// Convert CardResponse to StudyCardResponse with SM-2 data
const createStudyCard = (
  card: typeof mockCards[0],
  isNew: boolean = true,
  repetition: number = 0,
  intervalDays: number = 0,
  easeFactor: number = 2.5
): StudyCardResponse => ({
  cardId: card.id,
  frontText: card.frontText,
  frontAudioUrl: card.frontAudioUrl,
  backText: card.backText,
  backAudioUrl: card.backAudioUrl,
  collectionId: card.collectionId,
  collectionTitle: card.collectionTitle,
  repetition,
  intervalDays,
  easeFactor,
  lastReviewedAt: isNew ? undefined : new Date(Date.now() - intervalDays * 24 * 60 * 60 * 1000).toISOString(),
  nextReviewAt: isNew ? undefined : new Date().toISOString(),
  isNew,
});

// Mock study cards with varied states
export const mockStudyCards: StudyCardResponse[] = [
  // New cards (never studied)
  createStudyCard(mockCards[0], true),
  createStudyCard(mockCards[1], true),
  createStudyCard(mockCards[2], true),
  // Cards due for review
  createStudyCard(mockCards[3], false, 3, 7, 2.5),
  createStudyCard(mockCards[4], false, 2, 3, 2.3),
  createStudyCard(mockCards[5], false, 5, 14, 2.7),
  // More new cards
  createStudyCard(mockCards[6], true),
  createStudyCard(mockCards[7], true),
];

export const getMockStudySession = (
  collectionId?: string,
  limit: number = 20
): StudySessionResponse => {
  let cards = [...mockStudyCards];

  if (collectionId) {
    cards = cards.filter(c => c.collectionId === collectionId);
  }

  cards = cards.slice(0, limit);

  const newCards = cards.filter(c => c.isNew);
  const reviewCards = cards.filter(c => !c.isNew);

  return {
    totalDueCards: cards.length,
    totalNewCards: newCards.length,
    totalReviewCards: reviewCards.length,
    cards,
  };
};

export const getMockStudySessionByCollection = (
  collectionId: string,
  limit: number = 20
): StudySessionResponse => {
  return getMockStudySession(collectionId, limit);
};

// SM-2 algorithm simulation for mock review response
export const submitMockReview = (
  cardId: string,
  rating: Rating,
  studyTimeSeconds?: number
): ReviewResponse => {
  const card = mockStudyCards.find(c => c.cardId === cardId);

  let newRepetition = card?.repetition || 0;
  let newEaseFactor = card?.easeFactor || 2.5;
  let newIntervalDays = card?.intervalDays || 0;
  let message = '';

  // Simplified SM-2 simulation
  switch (rating) {
    case 'AGAIN':
      newRepetition = 0;
      newIntervalDays = 1;
      newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
      message = 'Card will be shown again soon. Keep practicing!';
      break;
    case 'HARD':
      newRepetition += 1;
      newIntervalDays = Math.max(1, Math.floor(newIntervalDays * 1.2));
      newEaseFactor = Math.max(1.3, newEaseFactor - 0.15);
      message = 'Good effort! Review scheduled.';
      break;
    case 'GOOD':
      newRepetition += 1;
      newIntervalDays = newRepetition === 1 ? 1 : newRepetition === 2 ? 6 : Math.floor(newIntervalDays * newEaseFactor);
      message = 'Well done! Keep up the good work!';
      break;
    case 'EASY':
      newRepetition += 1;
      newIntervalDays = newRepetition === 1 ? 4 : Math.floor(newIntervalDays * newEaseFactor * 1.3);
      newEaseFactor = newEaseFactor + 0.15;
      message = 'Excellent! You know this card well!';
      break;
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newIntervalDays);

  return {
    cardId,
    newRepetition,
    newIntervalDays,
    newEaseFactor: Math.round(newEaseFactor * 100) / 100,
    nextReviewAt: nextReviewAt.toISOString(),
    message,
  };
};

export const getMockCollectionProgress = (
  collectionId: string
): CollectionProgressResponse => {
  const collectionCards = mockCards.filter(c => c.collectionId === collectionId);
  const studyCards = mockStudyCards.filter(c => c.collectionId === collectionId);

  const totalCards = collectionCards.length;
  const learnedCards = studyCards.filter(c => !c.isNew && c.repetition > 0).length;
  const dueCards = studyCards.filter(c => !c.isNew).length;
  const newCards = studyCards.filter(c => c.isNew).length;
  const progressPercent = totalCards > 0 ? (learnedCards / totalCards) * 100 : 0;

  const collection = collectionCards[0];

  return {
    collectionId,
    collectionTitle: collection?.collectionTitle || 'Unknown Collection',
    totalCards,
    learnedCards,
    dueCards,
    newCards,
    progressPercent: Math.round(progressPercent * 10) / 10,
  };
};

// Start learning a new card (initialize user_card)
export const startMockLearningCard = (cardId: string): StudyCardResponse | null => {
  const card = mockCards.find(c => c.id === cardId);
  if (!card) return null;

  return createStudyCard(card, true, 0, 0, 2.5);
};
