import { API_CONFIG, ApiResponse, ApiError } from './config';
import { User } from '../types/auth';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

class AuthApiError extends Error {
  constructor(
    public message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

export const authApi = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const error = result as ApiError;
        throw new AuthApiError(error.error, response.status);
      }

      const successResult = result as ApiResponse<AuthResponse>;
      return successResult.data;
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      throw new AuthApiError('Network error occurred');
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const error = result as ApiError;
        throw new AuthApiError(error.error, response.status);
      }

      const successResult = result as ApiResponse<AuthResponse>;
      return successResult.data;
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      throw new AuthApiError('Network error occurred');
    }
  },

  async getUserProfile(accessToken: string): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ME}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        const error = result as ApiError;
        throw new AuthApiError(error.error, response.status);
      }

      const successResult = result as ApiResponse<User>;
      return successResult.data;
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      throw new AuthApiError('Network error occurred');
    }
  },

  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      const body = refreshToken ? { refresh_token: refreshToken } : {};
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        const error = result as ApiError;
        throw new AuthApiError(error.error, response.status);
      }
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      throw new AuthApiError('Network error occurred');
    }
  },
};
