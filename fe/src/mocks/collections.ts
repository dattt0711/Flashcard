import { CollectionResponse, CreateCollectionRequest } from '@/types';
import { getMockCourseById } from './courses';

export const mockCollections: CollectionResponse[] = [
  // Japanese N5 Vocabulary collections
  {
    id: 'col1-a2b3-c4d5-e6f7-a8b9c0d1e2f3',
    courseId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    courseTitle: 'Japanese N5 Vocabulary',
    title: 'Basic Greetings',
    description: 'Common Japanese greetings and expressions',
    createdById: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    createdByUsername: 'StudyMaster',
    createdAt: '2024-01-15T10:30:00Z',
    cardCount: 10,
  },
  {
    id: 'col2-b3c4-d5e6-f7a8-b9c0d1e2f3a4',
    courseId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    courseTitle: 'Japanese N5 Vocabulary',
    title: 'Numbers 1-100',
    description: 'Japanese number system basics',
    createdById: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    createdByUsername: 'StudyMaster',
    createdAt: '2024-01-16T11:00:00Z',
    cardCount: 15,
  },
  {
    id: 'col3-c4d5-e6f7-a8b9-c0d1e2f3a4b5',
    courseId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    courseTitle: 'Japanese N5 Vocabulary',
    title: 'Days & Months',
    description: 'Days of the week and months in Japanese',
    createdById: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    createdByUsername: 'StudyMaster',
    createdAt: '2024-01-17T09:00:00Z',
    cardCount: 19,
  },
  // English Grammar collections
  {
    id: 'col4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
    courseId: 'c2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d',
    courseTitle: 'English Grammar Essentials',
    title: 'Verb Tenses',
    description: 'Present, past, and future tenses',
    createdById: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    createdByUsername: 'StudyMaster',
    createdAt: '2024-01-20T15:00:00Z',
    cardCount: 12,
  },
  {
    id: 'col5-e6f7-a8b9-c0d1-e2f3a4b5c6d7',
    courseId: 'c2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d',
    courseTitle: 'English Grammar Essentials',
    title: 'Prepositions',
    description: 'Common English prepositions and usage',
    createdById: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    createdByUsername: 'StudyMaster',
    createdAt: '2024-01-21T10:00:00Z',
    cardCount: 8,
  },
];

export const getMockCollections = (): CollectionResponse[] => mockCollections;

export const getMockCollectionsByCourse = (courseId: string): CollectionResponse[] =>
  mockCollections.filter(c => c.courseId === courseId);

export const getMockCollectionById = (id: string): CollectionResponse | undefined =>
  mockCollections.find(c => c.id === id);

export const addMockCollection = (request: CreateCollectionRequest): CollectionResponse => {
  const course = getMockCourseById(request.courseId);
  const newCollection: CollectionResponse = {
    id: `col${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    courseId: request.courseId,
    courseTitle: course?.title || 'Unknown Course',
    title: request.title,
    description: request.description || '',
    createdById: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    createdByUsername: 'StudyMaster',
    createdAt: new Date().toISOString(),
    cardCount: 0,
  };
  mockCollections.push(newCollection);
  return newCollection;
};
