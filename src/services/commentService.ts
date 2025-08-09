// Comment Service
import { apiClient, PaginationParams } from "./api";
import { Comment, CommentRequest } from "./types";

export class CommentService {
  /**
   * Get comments for a video
   */
  async getVideoComments(
    videoId: string,
    pagination: PaginationParams = {}
  ): Promise<Comment[]> {
    try {
      const params: Record<string, string> = {};

      if (pagination.page) params.page = pagination.page.toString();
      if (pagination.limit) params.limit = pagination.limit.toString();

      return await apiClient.get<Comment[]>(
        `/videos/${videoId}/comments`,
        params
      );
    } catch (error) {
      console.error("Get video comments error:", error);
      throw error;
    }
  }

  /**
   * Add comment to video
   */
  async addComment(
    videoId: string,
    commentData: CommentRequest
  ): Promise<Comment> {
    try {
      return await apiClient.post<Comment>(
        `/videos/${videoId}/comments`,
        commentData
      );
    } catch (error) {
      console.error("Add comment error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const commentService = new CommentService();
