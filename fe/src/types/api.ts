// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Rating enum for review submission
export type Rating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

// Authentication
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  email: string;
  username: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

// Courses
export interface CourseResponse {
  id: string;
  title: string;
  description: string;
  createdById: string;
  createdByUsername: string;
  isPublic: boolean;
  createdAt: string;
  collectionCount: number;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  isPublic?: boolean;
}

// Collections
export interface CollectionResponse {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  createdById: string;
  createdByUsername: string;
  createdAt: string;
  cardCount: number;
}

export interface CreateCollectionRequest {
  courseId: string;
  title: string;
  description?: string;
}

// Cards
export interface CardResponse {
  id: string;
  collectionId: string;
  collectionTitle: string;
  frontText: string;
  frontImageId?: string;
  frontImageUrl?: string;
  frontAudioId?: string;
  frontAudioUrl?: string;
  backText: string;
  backImageId?: string;
  backImageUrl?: string;
  backAudioId?: string;
  backAudioUrl?: string;
  createdAt: string;
}

export interface CreateCardRequest {
  collectionId: string;
  frontText: string;
  frontImageId?: string;
  frontAudioId?: string;
  backText: string;
  backImageId?: string;
  backAudioId?: string;
}

// Study
export interface StudyCardResponse {
  cardId: string;
  frontText: string;
  frontImageUrl?: string;
  frontAudioUrl?: string;
  backText: string;
  backImageUrl?: string;
  backAudioUrl?: string;
  collectionId: string;
  collectionTitle: string;
  repetition: number;
  intervalDays: number;
  easeFactor: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  isNew: boolean;
}

export interface StudySessionResponse {
  totalDueCards: number;
  totalNewCards: number;
  totalReviewCards: number;
  cards: StudyCardResponse[];
}

export interface ReviewRequest {
  cardId: string;
  rating: Rating;
  studyTimeSeconds?: number;
}

export interface ReviewResponse {
  cardId: string;
  newRepetition: number;
  newIntervalDays: number;
  newEaseFactor: number;
  nextReviewAt: string;
  message: string;
}

export interface CollectionProgressResponse {
  collectionId: string;
  collectionTitle: string;
  totalCards: number;
  learnedCards: number;
  dueCards: number;
  newCards: number;
  progressPercent: number;
}

// Statistics
export interface UserStatsResponse {
  totalCardsLearned: number;
  totalReviews: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: string;
  todayCardsStudied: number;
  todayNewCards: number;
  todayReviewCards: number;
  todayStudyTimeSeconds: number;
}

export interface StreakResponse {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: string;
  studiedToday: boolean;
}

export interface LeaderboardEntryResponse {
  rank: number;
  userId: string;
  username: string;
  score: number;
}

export interface DailyStatsResponse {
  date: string;
  cardsStudied: number;
  newCards: number;
  reviewCards: number;
  studyTimeSeconds: number;
}
