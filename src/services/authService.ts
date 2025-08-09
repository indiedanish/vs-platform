// Authentication Service
import { apiClient, tokenManager } from './api';
import { SignupRequest, LoginRequest, AuthResponse, User } from './types';

export class AuthService {
  /**
   * Register a new user
   */
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
      
      // Store token after successful signup
      if (response.token) {
        tokenManager.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Store token after successful login
      if (response.token) {
        tokenManager.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user (clear local token)
   */
  logout(): void {
    tokenManager.removeToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!tokenManager.getToken();
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return tokenManager.getToken();
  }

  /**
   * Validate token and get user info (if backend provides this endpoint)
   * For now, we'll decode the user info from the stored token or context
   */
  getCurrentUser(): User | null {
    // This would typically make an API call to validate the token
    // For now, return null if no token exists
    const token = tokenManager.getToken();
    if (!token) return null;

    // In a real implementation, you might decode the JWT or make an API call
    // to get current user info. For now, we'll rely on the auth context
    return null;
  }
}

// Export singleton instance
export const authService = new AuthService();