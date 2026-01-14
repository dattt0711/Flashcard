import { CourseResponse, CreateCourseRequest } from '@/types';

export const mockCourses: CourseResponse[] = [
  {
    id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    title: 'Japanese N5 Vocabulary',
    description: 'Essential Japanese vocabulary for JLPT N5 level',
    createdById: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    createdByUsername: 'StudyMaster',
    isPublic: true,
    createdAt: '2024-01-15T10:00:00Z',
    collectionCount: 3,
  },
  {
    id: 'c2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d',
    title: 'English Grammar Essentials',
    description: 'Core English grammar rules and patterns',
    createdById: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    createdByUsername: 'StudyMaster',
    isPublic: true,
    createdAt: '2024-01-20T14:30:00Z',
    collectionCount: 2,
  },
  {
    id: 'c3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e',
    title: 'World History',
    description: 'Key events and dates in world history',
    createdById: 'u2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d',
    createdByUsername: 'HistoryBuff',
    isPublic: true,
    createdAt: '2024-02-01T09:00:00Z',
    collectionCount: 4,
  },
  {
    id: 'c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f',
    title: 'My Private Notes',
    description: 'Personal study notes',
    createdById: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    createdByUsername: 'StudyMaster',
    isPublic: false,
    createdAt: '2024-02-10T16:00:00Z',
    collectionCount: 1,
  },
];

export const getMockCourses = (): CourseResponse[] => mockCourses;

export const getMockPublicCourses = (): CourseResponse[] =>
  mockCourses.filter(c => c.isPublic);

export const getMockMyCourses = (userId: string): CourseResponse[] =>
  mockCourses.filter(c => c.createdById === userId);

export const getMockCourseById = (id: string): CourseResponse | undefined =>
  mockCourses.find(c => c.id === id);

export const addMockCourse = (request: CreateCourseRequest): CourseResponse => {
  const newCourse: CourseResponse = {
    id: `c${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: request.title,
    description: request.description || '',
    createdById: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    createdByUsername: 'StudyMaster',
    isPublic: request.isPublic ?? false,
    createdAt: new Date().toISOString(),
    collectionCount: 0,
  };
  mockCourses.push(newCourse);
  return newCourse;
};
