import {
  ApiResponse,
  StudySessionResponse,
  StudyCardResponse,
  ReviewRequest,
  ReviewResponse,
  CollectionProgressResponse,
  Rating,
} from '@/types';
import { get, post } from './api-client';
import { API_CONFIG, isMockMode } from './config';
import {
  getMockStudySession,
  getMockStudySessionByCollection,
  submitMockReview,
  getMockCollectionProgress,
  startMockLearningCard,
} from '@/mocks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const studyService = {
  // Get study session - cards due for review and new cards
  getStudySession: async (
    collectionId?: string,
    limit: number = 20
  ): Promise<ApiResponse<StudySessionResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Study session retrieved successfully',
        data: getMockStudySession(collectionId, limit),
      };
    }

    let path = `/api/study/session?limit=${limit}`;
    if (collectionId) {
      path += `&collectionId=${collectionId}`;
    }
    return get<StudySessionResponse>(path);
  },

  // Get study session by collection
  getStudySessionByCollection: async (
    collectionId: string,
    limit: number = 20
  ): Promise<ApiResponse<StudySessionResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Study session retrieved successfully',
        data: getMockStudySessionByCollection(collectionId, limit),
      };
    }
    return get<StudySessionResponse>(
      `/api/study/session/collection/${collectionId}?limit=${limit}`
    );
  },

  // Start learning a new card (initialize user_card)
  startLearningCard: async (cardId: string): Promise<ApiResponse<StudyCardResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      const studyCard = startMockLearningCard(cardId);
      if (!studyCard) {
        return {
          success: false,
          message: 'Card not found',
          data: null as unknown as StudyCardResponse,
        };
      }
      return {
        success: true,
        message: 'Started learning card',
        data: studyCard,
      };
    }
    return post<StudyCardResponse>(`/api/study/start/${cardId}`, {});
  },

  // Submit a review with rating (SM-2 algorithm)
  submitReview: async (
    cardId: string,
    rating: Rating,
    studyTimeSeconds?: number
  ): Promise<ApiResponse<ReviewResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Review submitted successfully',
        data: submitMockReview(cardId, rating, studyTimeSeconds),
      };
    }

    const request: ReviewRequest = {
      cardId,
      rating,
      studyTimeSeconds,
    };
    return post<ReviewResponse>('/api/study/review', request);
  },

  // Get collection progress
  getCollectionProgress: async (
    collectionId: string
  ): Promise<ApiResponse<CollectionProgressResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Collection progress retrieved successfully',
        data: getMockCollectionProgress(collectionId),
      };
    }
    return get<CollectionProgressResponse>(
      `/api/study/progress/collection/${collectionId}`
    );
  },
};
