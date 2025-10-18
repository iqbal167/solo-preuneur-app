export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
  ENDPOINTS: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
} as const;

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ApiError {
  error: string;
}
