// Rating Service
import { apiClient, PaginationParams } from './api';
import { Rating, RatingRequest } from './types';

export class RatingService {
  /**
   * Get ratings for a video
   */
  async getVideoRatings(
    videoId: string, 
    pagination: PaginationParams = {}
  ): Promise<Rating[]> {
    try {
      const params: Record<string, string> = {};
      
      if (pagination.page) params.page = pagination.page.toString();
      if (pagination.limit) params.limit = pagination.limit.toString();

      return await apiClient.get<Rating[]>(`/videos/${videoId}/ratings`, params);
    } catch (error) {
      console.error('Get video ratings error:', error);
      throw error;
    }
  }

  /**
   * Rate a video (create or update rating)
   */
  async rateVideo(videoId: string, ratingData: RatingRequest): Promise<Rating> {
    try {
      return await apiClient.post<Rating>(`/videos/${videoId}/ratings`, ratingData);
    } catch (error) {
      console.error('Rate video error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const ratingService = new RatingService();