import { ApiResponse, CardResponse, CreateCardRequest } from '@/types';
import { get, post, del } from './api-client';
import { API_CONFIG, isMockMode } from './config';
import { getMockCardsByCollection, getMockCardById } from '@/mocks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const cardsService = {
  // Get all cards in a collection
  getCardsByCollection: async (collectionId: string): Promise<ApiResponse<CardResponse[]>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Cards retrieved successfully',
        data: getMockCardsByCollection(collectionId),
      };
    }
    return get<CardResponse[]>(`/api/cards/collection/${collectionId}`);
  },

  // Get card by ID
  getCard: async (id: string): Promise<ApiResponse<CardResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      const card = getMockCardById(id);
      if (!card) {
        return {
          success: false,
          message: 'Card not found',
          data: null as unknown as CardResponse,
        };
      }
      return {
        success: true,
        message: 'Card retrieved successfully',
        data: card,
      };
    }
    return get<CardResponse>(`/api/cards/${id}`);
  },

  // Create a new card
  createCard: async (request: CreateCardRequest): Promise<ApiResponse<CardResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      const newCard: CardResponse = {
        id: `card-${Date.now()}`,
        collectionId: request.collectionId,
        collectionTitle: 'Mock Collection',
        frontText: request.frontText,
        frontAudioUrl: request.frontAudioUrl,
        backText: request.backText,
        backAudioUrl: request.backAudioUrl,
        createdAt: new Date().toISOString(),
      };
      return {
        success: true,
        message: 'Card created successfully',
        data: newCard,
      };
    }
    return post<CardResponse>('/api/cards', request);
  },

  // Delete a card
  deleteCard: async (id: string): Promise<ApiResponse<void>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Card deleted successfully',
        data: undefined as unknown as void,
      };
    }
    return del<void>(`/api/cards/${id}`);
  },
};
