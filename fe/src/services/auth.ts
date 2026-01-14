import {
  ApiResponse,
  AuthResponse,
  UserResponse,
  LoginRequest,
  RegisterRequest,
  GoogleAuthRequest,
} from '@/types';
import { get, post, setToken, removeToken } from './api-client';
import { API_CONFIG, isMockMode } from './config';
import { getMockCurrentUser, getMockAuthResponse } from '@/mocks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Get current authenticated user info
  getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'User retrieved successfully',
        data: getMockCurrentUser(),
      };
    }
    return get<UserResponse>('/api/auth/me');
  },

  // Login with email and password
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      // Simple mock validation
      if (email && password.length >= 6) {
        const authResponse = getMockAuthResponse();
        setToken(authResponse.accessToken);
        return {
          success: true,
          message: 'Login successful',
          data: authResponse,
        };
      }
      return {
        success: false,
        message: 'Invalid credentials',
        data: null as unknown as AuthResponse,
      };
    }

    const request: LoginRequest = { email, password };
    const response = await post<AuthResponse>('/api/auth/login', request, false);
    if (response.success && response.data?.accessToken) {
      setToken(response.data.accessToken);
    }
    return response;
  },

  // Register new user
  register: async (
    email: string,
    username: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      // Simple mock validation
      if (email && username.length >= 3 && password.length >= 6) {
        const authResponse = getMockAuthResponse();
        setToken(authResponse.accessToken);
        return {
          success: true,
          message: 'Registration successful',
          data: authResponse,
        };
      }
      return {
        success: false,
        message: 'Invalid registration data',
        data: null as unknown as AuthResponse,
      };
    }

    const request: RegisterRequest = { email, username, password };
    const response = await post<AuthResponse>('/api/auth/register', request, false);
    if (response.success && response.data?.accessToken) {
      setToken(response.data.accessToken);
    }
    return response;
  },

  // Google OAuth login/register
  googleAuth: async (idToken: string): Promise<ApiResponse<AuthResponse>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      const authResponse = getMockAuthResponse();
      setToken(authResponse.accessToken);
      return {
        success: true,
        message: 'Google authentication successful',
        data: authResponse,
      };
    }

    const request: GoogleAuthRequest = { idToken };
    const response = await post<AuthResponse>('/api/auth/google', request, false);
    if (response.success && response.data?.accessToken) {
      setToken(response.data.accessToken);
    }
    return response;
  },

  // Add password to Google-authenticated account
  addPassword: async (email: string, password: string): Promise<ApiResponse<string>> => {
    if (isMockMode()) {
      await delay(API_CONFIG.mockDelay);
      return {
        success: true,
        message: 'Password added successfully',
        data: 'Password added successfully',
      };
    }

    const request: LoginRequest = { email, password };
    return post<string>('/api/auth/add-password', request);
  },

  // Logout (clear token)
  logout: (): void => {
    removeToken();
  },
};
