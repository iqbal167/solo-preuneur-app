import { authApi, RegisterRequest, LoginRequest, AuthResponse } from '../api/auth';
import { authStorage } from '../storage/auth';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  data?: AuthResponse;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResult> {
    try {
      // Validate input
      if (!data.email || !data.password || !data.name) {
        return {
          success: false,
          error: 'All fields are required',
        };
      }

      if (!this.isValidEmail(data.email)) {
        return {
          success: false,
          error: 'Please enter a valid email address',
        };
      }

      if (data.password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters',
        };
      }

      // Call API
      const result = await authApi.register(data);

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  },

  async login(data: LoginData): Promise<AuthResult> {
    try {
      // Validate input
      if (!data.email || !data.password) {
        return {
          success: false,
          error: 'Email and password are required',
        };
      }

      if (!this.isValidEmail(data.email)) {
        return {
          success: false,
          error: 'Please enter a valid email address',
        };
      }

      // Call API
      const result = await authApi.login(data);

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const accessToken = await authStorage.getAccessToken();
      const refreshToken = await authStorage.getRefreshToken();

      // Try to call logout API if we have tokens
      if (accessToken) {
        try {
          await authApi.logout(accessToken, refreshToken || undefined);
        } catch (apiError) {
          // Ignore API errors, still clear local tokens
        }
      }

      // Always clear tokens
      await authStorage.clearTokens();

      return { success: true };
    } catch (error: any) {
      // Ensure tokens are cleared even if something goes wrong
      try {
        await authStorage.clearTokens();
      } catch (clearError) {
        // Ignore clear errors
      }

      return {
        success: false,
        error: error.message || 'Logout failed',
      };
    }
  },

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
};
