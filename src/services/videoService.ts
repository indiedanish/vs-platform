// Video Service
import { apiClient } from './api';
import { Video, VideoRequest, VideosResponse, VideoFilters } from './types';

export class VideoService {
  /**
   * Get list of videos with filters and pagination
   */
  async getVideos(filters: VideoFilters = {}): Promise<VideosResponse> {
    try {
      const params: Record<string, string> = {};
      
      if (filters.page) params.page = filters.page.toString();
      if (filters.limit) params.limit = filters.limit.toString();
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters.search) params.search = filters.search;
      if (filters.creatorId) params.creatorId = filters.creatorId;

      return await apiClient.get<VideosResponse>('/videos', params);
    } catch (error) {
      console.error('Get videos error:', error);
      throw error;
    }
  }

  /**
   * Create new video metadata (creators only)
   */
  async createVideo(videoData: VideoRequest): Promise<Video> {
    try {
      return await apiClient.post<Video>('/videos', videoData);
    } catch (error) {
      console.error('Create video error:', error);
      throw error;
    }
  }

  /**
   * Get video details by ID
   */
  async getVideoById(videoId: string): Promise<Video> {
    try {
      return await apiClient.get<Video>(`/videos/${videoId}`);
    } catch (error) {
      console.error('Get video by ID error:', error);
      throw error;
    }
  }

  /**
   * Search videos by title or description
   */
  async searchVideos(query: string, filters: Omit<VideoFilters, 'search'> = {}): Promise<VideosResponse> {
    try {
      return await this.getVideos({ ...filters, search: query });
    } catch (error) {
      console.error('Search videos error:', error);
      throw error;
    }
  }

  /**
   * Get videos by creator
   */
  async getVideosByCreator(creatorId: string, filters: Omit<VideoFilters, 'creatorId'> = {}): Promise<VideosResponse> {
    try {
      return await this.getVideos({ ...filters, creatorId });
    } catch (error) {
      console.error('Get videos by creator error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const videoService = new VideoService();