export interface User {
  id: string;
  name: string;
  email: string;
  role: 'consumer' | 'creator';
  avatar?: string;
}

export interface Video {
  id: string;
  title: string;
  publisher: string;
  producer: string;
  genre: string;
  ageRating: string;
  thumbnail: string;
  videoUrl: string;
  rating: number;
  views: number;
  uploadDate: string;
  duration: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'consumer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

// Mock Videos
export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Amazing Sunset Timelapse',
    publisher: 'Nature Studios',
    producer: 'Jane Smith',
    genre: 'Nature',
    ageRating: 'G',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    rating: 4.5,
    views: 12500,
    uploadDate: '2024-01-15',
    duration: '3:24'
  },
  {
    id: '2',
    title: 'Urban Street Art Tour',
    publisher: 'City Vibes',
    producer: 'Mike Johnson',
    genre: 'Art',
    ageRating: 'PG',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    rating: 4.2,
    views: 8900,
    uploadDate: '2024-01-20',
    duration: '5:12'
  },
  {
    id: '3',
    title: 'Cooking Masterclass: Pasta',
    publisher: 'Culinary Arts',
    producer: 'Jane Smith',
    genre: 'Food',
    ageRating: 'G',
    thumbnail: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    rating: 4.8,
    views: 15600,
    uploadDate: '2024-01-25',
    duration: '8:45'
  },
  {
    id: '4',
    title: 'Mountain Hiking Adventure',
    publisher: 'Adventure Co',
    producer: 'Mike Johnson',
    genre: 'Adventure',
    ageRating: 'PG',
    thumbnail: 'https://images.unsplash.com/photo-1464822759844-d150baec3e5e?w=400&h=300&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    rating: 4.3,
    views: 9800,
    uploadDate: '2024-02-01',
    duration: '6:30'
  },
  {
    id: '5',
    title: 'Tech Review: Latest Gadgets',
    publisher: 'Tech Today',
    producer: 'Jane Smith',
    genre: 'Technology',
    ageRating: 'G',
    thumbnail: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    rating: 4.1,
    views: 7200,
    uploadDate: '2024-02-05',
    duration: '4:18'
  },
  {
    id: '6',
    title: 'Dance Tutorial: Hip Hop Basics',
    publisher: 'Dance Studio',
    producer: 'Mike Johnson',
    genre: 'Dance',
    ageRating: 'G',
    thumbnail: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=300&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    rating: 4.6,
    views: 11300,
    uploadDate: '2024-02-10',
    duration: '7:22'
  }
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: '1',
    videoId: '1',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    text: 'Absolutely stunning! The colors are incredible.',
    timestamp: '2024-01-16T10:30:00Z'
  },
  {
    id: '2',
    videoId: '1',
    userId: '3',
    userName: 'Mike Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    text: 'Great work on the timelapse technique!',
    timestamp: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    videoId: '2',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    text: 'Love the street art scene in this city!',
    timestamp: '2024-01-21T09:15:00Z'
  },
  {
    id: '4',
    videoId: '3',
    userId: '2',
    userName: 'Jane Smith',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    text: 'Perfect technique! Going to try this recipe tonight.',
    timestamp: '2024-01-26T16:45:00Z'
  }
];

// Mock API functions (to be replaced with real API calls later)
export const mockApi = {
  // Videos
  getVideos: async (): Promise<Video[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return mockVideos;
  },

  getVideoById: async (id: string): Promise<Video | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockVideos.find(video => video.id === id) || null;
  },

  searchVideos: async (query: string): Promise<Video[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockVideos.filter(video => 
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.genre.toLowerCase().includes(query.toLowerCase()) ||
      video.publisher.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Comments
  getCommentsByVideoId: async (videoId: string): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockComments.filter(comment => comment.videoId === videoId);
  },

  addComment: async (videoId: string, userId: string, text: string): Promise<Comment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => u.id === userId);
    const newComment: Comment = {
      id: Date.now().toString(),
      videoId,
      userId,
      userName: user?.name || 'Anonymous',
      userAvatar: user?.avatar,
      text,
      timestamp: new Date().toISOString()
    };
    mockComments.push(newComment);
    return newComment;
  },

  // Users
  getUserById: async (id: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUsers.find(user => user.id === id) || null;
  },

  // Auth
  login: async (email: string, password: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockUsers.find(user => user.email === email) || null;
  },

  register: async (userData: Omit<User, 'id'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    mockUsers.push(newUser);
    return newUser;
  }
};

// Filter and sort options
export const genreOptions = [
  'All',
  'Nature',
  'Art',
  'Food',
  'Adventure',
  'Technology',
  'Dance',
  'Music',
  'Sports',
  'Education'
];

export const ageRatingOptions = [
  'All',
  'G',
  'PG',
  'PG-13',
  'R'
];

export const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-viewed', label: 'Most Viewed' },
  { value: 'top-rated', label: 'Top Rated' }
];