import { ApiResponse, CourseResponse, CreateCourseRequest } from '@/types';
import { get, post } from './api-client';
import { API_CONFIG, isMockMode } from './config';
import { getMockCourses, getMockPublicCourses, getMockMyCourses, getMockCourseById, addMockCourse } from '@/mocks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const coursesService = {
  // Get all accessible courses (own + public)
  getAllCourses: async (): Promise<ApiResponse<CourseResponse[]>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Courses retrieved successfully',
        data: getMockCourses(),
      };
    }
    return get<CourseResponse[]>('/api/courses');
  },

  // Get public courses only
  getPublicCourses: async (): Promise<ApiResponse<CourseResponse[]>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Public courses retrieved successfully',
        data: getMockPublicCourses(),
      };
    }
    return get<CourseResponse[]>('/api/courses/public');
  },

  // Get current user's courses
  getMyCourses: async (): Promise<ApiResponse<CourseResponse[]>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      // Mock user ID
      const userId = 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c';
      return {
        success: true,
        message: 'My courses retrieved successfully',
        data: getMockMyCourses(userId),
      };
    }
    return get<CourseResponse[]>('/api/courses/my');
  },

  // Get course by ID
  getCourse: async (id: string): Promise<ApiResponse<CourseResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      const course = getMockCourseById(id);
      if (!course) {
        return {
          success: false,
          message: 'Course not found',
          data: null as unknown as CourseResponse,
        };
      }
      return {
        success: true,
        message: 'Course retrieved successfully',
        data: course,
      };
    }
    return get<CourseResponse>(`/api/courses/${id}`);
  },

  // Create a new course
  createCourse: async (request: CreateCourseRequest): Promise<ApiResponse<CourseResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      const newCourse = addMockCourse(request);
      return {
        success: true,
        message: 'Course created successfully',
        data: newCourse,
      };
    }
    return post<CourseResponse>('/api/courses', request);
  },
};
