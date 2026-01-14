import { ApiResponse, CollectionResponse, CreateCollectionRequest } from '@/types';
import { get, post } from './api-client';
import { API_CONFIG, isMockMode } from './config';
import { getMockCollectionsByCourse, getMockCollectionById, addMockCollection } from '@/mocks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const collectionsService = {
  // Get all collections in a course
  getCollectionsByCourse: async (courseId: string): Promise<ApiResponse<CollectionResponse[]>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Collections retrieved successfully',
        data: getMockCollectionsByCourse(courseId),
      };
    }
    return get<CollectionResponse[]>(`/api/collections/course/${courseId}`);
  },

  // Get collection by ID
  getCollection: async (id: string): Promise<ApiResponse<CollectionResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      const collection = getMockCollectionById(id);
      if (!collection) {
        return {
          success: false,
          message: 'Collection not found',
          data: null as unknown as CollectionResponse,
        };
      }
      return {
        success: true,
        message: 'Collection retrieved successfully',
        data: collection,
      };
    }
    return get<CollectionResponse>(`/api/collections/${id}`);
  },

  // Create a new collection
  createCollection: async (request: CreateCollectionRequest): Promise<ApiResponse<CollectionResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      const newCollection = addMockCollection(request);
      return {
        success: true,
        message: 'Collection created successfully',
        data: newCollection,
      };
    }
    return post<CollectionResponse>('/api/collections', request);
  },
};
