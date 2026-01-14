import { AuthResponse, UserResponse } from '@/types';

export const mockCurrentUser: UserResponse = {
  id: 'u1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
  email: 'studymaster@example.com',
  username: 'StudyMaster',
  createdAt: '2024-01-01T00:00:00Z',
};

export const mockAuthResponse: AuthResponse = {
  accessToken: 'mock-jwt-token-xxxxx',
  tokenType: 'Bearer',
  userId: mockCurrentUser.id,
  email: mockCurrentUser.email,
  username: mockCurrentUser.username,
};

export const getMockCurrentUser = (): UserResponse => ({ ...mockCurrentUser });

export const getMockAuthResponse = (): AuthResponse => ({ ...mockAuthResponse });
