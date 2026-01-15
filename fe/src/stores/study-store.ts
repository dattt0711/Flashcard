import { create } from "zustand";
import { StudyCardResponse } from "@/types";

interface StudyState {
  cards: StudyCardResponse[];
  currentIndex: number;
  isFlipped: boolean;
  correctCount: number;
  incorrectCount: number;
  isSessionComplete: boolean;
  startTime: number | null;

  // Actions
  setCards: (cards: StudyCardResponse[]) => void;
  nextCard: () => void;
  flipCard: () => void;
  setFlipped: (flipped: boolean) => void;
  recordAnswer: (correct: boolean) => void;
  resetSession: () => void;
  setCurrentIndex: (index: number) => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  correctCount: 0,
  incorrectCount: 0,
  isSessionComplete: false,
  startTime: null,

  setCards: (cards) =>
    set({
      cards,
      currentIndex: 0,
      isFlipped: false,
      correctCount: 0,
      incorrectCount: 0,
      isSessionComplete: false,
      startTime: Date.now(),
    }),

  nextCard: () => {
    const { cards, currentIndex } = get();
    if (currentIndex < cards.length - 1) {
      set({ currentIndex: currentIndex + 1, isFlipped: false });
    } else {
      set({ isSessionComplete: true });
    }
  },

  flipCard: () => {
    set((state) => ({ isFlipped: !state.isFlipped }));
  },

  setFlipped: (flipped: boolean) => {
    set({ isFlipped: flipped });
  },

  recordAnswer: (correct: boolean) => {
    set((state) => ({
      correctCount: correct ? state.correctCount + 1 : state.correctCount,
      incorrectCount: correct ? state.incorrectCount : state.incorrectCount + 1,
    }));
  },

  resetSession: () => {
    set({
      currentIndex: 0,
      isFlipped: false,
      correctCount: 0,
      incorrectCount: 0,
      isSessionComplete: false,
      startTime: Date.now(),
    });
  },

  setCurrentIndex: (index: number) => {
    set({ currentIndex: index, isFlipped: false });
  },
}));
