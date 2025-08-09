// API Type Definitions

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'CREATOR' | 'CONSUMER';
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'CREATOR' | 'CONSUMER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number | null;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  averageRating: number;
  totalRatings: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  creatorId?: string;
  creator: {
    id: string;
    email?: string;
    username: string;
    role?: 'CREATOR' | 'CONSUMER';
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
    createdAt?: string;
  };
}

export interface VideoRequest {
  title: string;
  description: string;
  isPublic: boolean;
}

export interface VideosResponse {
  videos: Video[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VideoFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'title' | 'views' | 'averageRating';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  creatorId?: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
}

export interface CommentRequest {
  content: string;
}

export interface Rating {
  id: string;
  videoId: string;
  userId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
  };
}

export interface RatingRequest {
  rating: number;
}

export interface UploadVideoResponse {
  message: string;
  video: Video;
}

export interface ApiError {
  error: string;
  details?: any;
}