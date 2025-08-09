// Upload Service
import { apiClient } from './api';
import { UploadVideoResponse } from './types';

export class UploadService {
  /**
   * Upload video file (creators only)
   */
  async uploadVideo(
    videoFile: File, 
    videoId: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadVideoResponse> {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('videoId', videoId);

      // For progress tracking, we'd need to use XMLHttpRequest instead of fetch
      if (onProgress) {
        return this.uploadWithProgress(formData, onProgress);
      }

      return await apiClient.postFormData<UploadVideoResponse>('/upload/video', formData);
    } catch (error) {
      console.error('Upload video error:', error);
      throw error;
    }
  }

  /**
   * Upload video with progress tracking
   */
  private uploadWithProgress(
    formData: FormData, 
    onProgress: (progress: number) => void
  ): Promise<UploadVideoResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error || `HTTP ${xhr.status}: ${xhr.statusText}`));
          } catch {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred'));
      });

      // Set up request
      const token = localStorage.getItem('authToken');
      xhr.open('POST', 'http://localhost:3000/api/upload/video');
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // Send request
      xhr.send(formData);
    });
  }

  /**
   * Validate video file before upload
   */
  validateVideoFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload MP4, WebM, OGG, AVI, or MOV files.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size too large. Maximum size is 100MB.'
      };
    }

    return { isValid: true };
  }
}

// Export singleton instance
export const uploadService = new UploadService();