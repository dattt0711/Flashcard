// API Configuration

export const API_CONFIG = {
  // Base URL for the backend API
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',

  // Toggle between mock and real API
  // Set to false to use real backend API
  useMock: process.env.NEXT_PUBLIC_USE_MOCK !== 'false',

  // Request timeout in milliseconds
  timeout: 30000,

  // Simulated delay for mock API (ms)
  mockDelay: 300,
};

// Helper to check if using mock mode
export const isMockMode = (): boolean => API_CONFIG.useMock;

// Helper to get full API URL
export const getApiUrl = (path: string): string => {
  const base = API_CONFIG.baseUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};
