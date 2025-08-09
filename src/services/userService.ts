// User Service
import { apiClient } from './api';
import { User, UpdateUserRequest } from './types';

export class UserService {
  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<User> {
    try {
      return await apiClient.get<User>(`/users/${userId}`);
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, userData: UpdateUserRequest): Promise<User> {
    try {
      return await apiClient.put<User>(`/users/${userId}`, userData);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();