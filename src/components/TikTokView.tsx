import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Heart, MessageCircle, Share, Star, Eye, MoreHorizontal, ArrowLeft, Grid3X3, Loader2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Video, Comment } from '../services/types';
import { commentService } from '../services';

interface TikTokViewProps {
  videos: Video[];
  onBackToGrid?: () => void;
  onVideoUpdate?: (videoId: string, updates: Partial<Video>) => void; // Add this prop
}

const TikTokView: React.FC<TikTokViewProps> = ({ videos, onBackToGrid }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});
  const [loadingVideos, setLoadingVideos] = useState<{ [key: string]: boolean }>({});
  const [loadedVideos, setLoadedVideos] = useState<{ [key: string]: boolean }>({});
  const [showComments, setShowComments] = useState(false);
  const [currentVideoForComments, setCurrentVideoForComments] = useState<Video | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const currentVideo = videos[currentVideoIndex] || videos[0];

  // Initialize loading state for first video
  useEffect(() => {
    if (videos.length > 0) {
      const firstVideoId = videos[0]?.id || 'video-0';
      setLoadingVideos(prev => ({ ...prev, [firstVideoId]: true }));
      preloadVideo(firstVideoId);
    }
  }, [videos]);

  // Auto-play first video when component mounts
  useEffect(() => {
    if (videos.length > 0) {
      const firstVideoId = videos[0]?.id || 'video-0';
      const firstVideoElement = videoRefs.current[firstVideoId];
      if (firstVideoElement) {
        firstVideoElement.play().catch(() => {
          setIsPlaying(false);
          setLoadingVideos(prev => ({ ...prev, [firstVideoId]: false }));
        });
      }
    }
  }, [videos]);

  const preloadVideo = useCallback(async (videoId: string) => {
    const video = videos.find(v => (v.id || `video-${videos.indexOf(v)}`) === videoId);
    if (!video?.videoUrl) return;

    // Check if already loaded
    if (loadedVideos[videoId]) {
      setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
      return;
    }

    try {
      // Check if video is already being loaded
      if (loadingVideos[videoId]) return;

      setLoadingVideos(prev => ({ ...prev, [videoId]: true }));

      // Simple preload by creating a video element
      const videoElement = document.createElement('video');
      videoElement.src = video.videoUrl;
      videoElement.preload = 'metadata';

      videoElement.onloadedmetadata = () => {
        setLoadedVideos(prev => ({ ...prev, [videoId]: true }));
        setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
      };

      videoElement.onerror = () => {
        setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
      };

    } catch (error) {
      console.error('Failed to preload video:', error);
      setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
    }
  }, [videos, loadingVideos, loadedVideos]);

  // Preload nearby videos
  const preloadNearbyVideos = useCallback((currentIndex: number) => {
    const preloadRange = 2; // Preload 2 videos ahead and behind
    const startIndex = Math.max(0, currentIndex - preloadRange);
    const endIndex = Math.min(videos.length - 1, currentIndex + preloadRange);

    for (let i = startIndex; i <= endIndex; i++) {
      const videoId = videos[i]?.id || `video-${i}`;
      if (!loadedVideos[videoId] && !loadingVideos[videoId]) {
        preloadVideo(videoId);
      }
    }
  }, [videos, loadingVideos, loadedVideos, preloadVideo]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const videoHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / videoHeight);

      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
        // Pause current video
        const currentVideoElement = videoRefs.current[videos[currentVideoIndex]?.id || `video-${currentVideoIndex}`];
        if (currentVideoElement) {
          currentVideoElement.pause();
        }

        setCurrentVideoIndex(newIndex);
        setIsPlaying(false);

        // Set loading state for new video
        const newVideoId = videos[newIndex]?.id || `video-${newIndex}`;
        if (!loadedVideos[newVideoId]) {
          setLoadingVideos(prev => ({ ...prev, [newVideoId]: true }));
          preloadVideo(newVideoId);
        }

        // Preload nearby videos
        preloadNearbyVideos(newIndex);

        // Auto-play new video
        setTimeout(() => {
          const newVideoElement = videoRefs.current[newVideoId];
          if (newVideoElement) {
            newVideoElement.play().catch(() => {
              setIsPlaying(false);
              setLoadingVideos(prev => ({ ...prev, [newVideoId]: false }));
            });
          }
        }, 100);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentVideoIndex, videos, loadedVideos, preloadVideo, preloadNearbyVideos]);

  const togglePlayPause = () => {
    const videoElement = videoRefs.current[currentVideo?.id || `video-${currentVideoIndex}`];
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        const videoId = currentVideo?.id || `video-${currentVideoIndex}`;
        if (!loadedVideos[videoId]) {
          setLoadingVideos(prev => ({ ...prev, [videoId]: true }));
          preloadVideo(videoId);
        }
        videoElement.play().catch(() => {
          setIsPlaying(false);
          setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLike = (videoId: string) => {
    const wasLiked = liked[videoId];

    setLiked(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));

    // Update the like count directly in the videos array
    const videoIndex = videos.findIndex(v => (v.id || `video-${videos.indexOf(v)}`) === videoId);
    if (videoIndex !== -1) {
      if (wasLiked) {
        // If currently liked, decrease count by 1
        videos[videoIndex].likeCount = Math.max(0, (videos[videoIndex].likeCount || 0) - 1);
      } else {
        // If not currently liked, increase count by 1
        videos[videoIndex].likeCount = (videos[videoIndex].likeCount || 0) + 1;
      }
      // Force a re-render by updating state
      setCurrentVideoIndex(currentVideoIndex);
    }
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const openComments = async (video: Video) => {
    setCurrentVideoForComments(video);
    setShowComments(true);
    setNewComment('');
    // Load comments when opening the panel
    await loadComments(video.id || `video-${videos.indexOf(video)}`);
  };

  const loadComments = async (videoId: string) => {
    setIsCommentsLoading(true);
    try {
      const commentsData = await commentService.getVideoComments(videoId, { limit: 50 });
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentVideoForComments) return;

    const videoId = currentVideoForComments.id || `video-${videos.indexOf(currentVideoForComments)}`;
    setIsSubmittingComment(true);

    try {
      const comment = await commentService.addComment(videoId, { content: newComment.trim() });
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(false);
      //add 1 to the comment count
      const video = videos.find(v => v.id === videoId);
      if (video) {
        video.commentCount = (video.commentCount || 0) + 1;
      }

    }
  };

  const formatCommentDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const closeComments = () => {
    setShowComments(false);
    setCurrentVideoForComments(null);
  };

  if (videos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Play className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No videos available</h3>
          <p className="text-gray-400">Check back later for new content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Back to Grid Button */}
      <Button
        onClick={onBackToGrid}
        variant="default"
        size="sm"
        className="fixed top-4 left-4 z-[9999] bg-white text-black hover:bg-gray-100 transition-all duration-200 shadow-xl border-2 border-gray-300"
        style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 9999 }}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <Grid3X3 className="h-4 w-4 mr-1" />
        Back to Grid
      </Button>

      <div
        ref={containerRef}
        className="tiktok-scroll h-screen overflow-y-scroll snap-y snap-mandatory bg-black"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .tiktok-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {videos.map((video, index) => {
          const videoId = video.id || `video-${index}`;
          const isLoading = loadingVideos[videoId];
          const isLoaded = loadedVideos[videoId];
          const isCurrentVideo = index === currentVideoIndex;

          return (
            <div
              key={videoId}
              className="relative h-screen w-full snap-start flex items-center justify-center"
            >
              {/* Background Video */}
              <div className="absolute inset-0 bg-black">
                {video.videoUrl ? (
                  <video
                    ref={(el) => (videoRefs.current[videoId] = el)}
                    src={video.videoUrl}
                    poster={video.thumbnailUrl || undefined}
                    className="w-full h-full object-cover"
                    autoPlay={isCurrentVideo}
                    muted
                    playsInline
                    loop
                    preload={isCurrentVideo ? "auto" : "metadata"}
                    onLoadStart={() => {
                      if (!isLoaded) {
                        setLoadingVideos(prev => ({ ...prev, [videoId]: true }));
                      }
                    }}
                    onLoadedData={() => {
                      setLoadedVideos(prev => ({ ...prev, [videoId]: true }));
                      setLoadingVideos(prev => ({ ...prev, [videoId]: false }));

                      // Auto-play current video when it loads
                      if (isCurrentVideo) {
                        const videoElement = videoRefs.current[videoId];
                        if (videoElement) {
                          videoElement.play().catch(() => {
                            setIsPlaying(false);
                            setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
                          });
                        }
                      }
                    }}
                    onPlay={() => {
                      if (isCurrentVideo) {
                        setIsPlaying(true);
                        setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
                      }
                    }}
                    onPause={() => {
                      if (isCurrentVideo) {
                        setIsPlaying(false);
                      }
                    }}
                    onError={() => {
                      setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-center">
                      <Play className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-lg">Video not available</p>
                    </div>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </div>

              {/* Loading overlay */}
              {isLoading && isCurrentVideo && !isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-15">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 text-white animate-spin mb-2" />
                    <p className="text-white text-sm">Loading video...</p>
                  </div>
                </div>
              )}

              {/* Play/Pause overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                onClick={togglePlayPause}
              >
                {isCurrentVideo && !isLoading && (
                  <div className="bg-black/30 rounded-full p-3 sm:p-4 transition-opacity duration-200">
                    {isPlaying ? (
                      <Pause className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                    ) : (
                      <Play className="h-8 w-8 sm:h-12 sm:w-12 text-white ml-1" />
                    )}
                  </div>
                )}
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 z-20">
                <div className="flex items-end justify-between">
                  {/* Left side - Video info */}
                  <div className="flex-1 mr-2 sm:mr-4 max-w-[calc(100%-80px)] sm:max-w-[calc(100%-100px)]">
                    <div className="mb-1 sm:mb-2">
                      <Badge variant="secondary" className="bg-white/20 text-white border-none mb-1 sm:mb-2 text-xs">
                        {video.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>

                    <h2 className="text-white text-base sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2">
                      {video.title || 'Untitled Video'}
                    </h2>

                    <p className="text-white/80 text-sm mb-1 sm:mb-2">
                      @{video.creator?.username?.toLowerCase().replace(/\s+/g, '') || 'unknown'}
                    </p>

                    <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-white/70 text-xs sm:text-sm mb-2 sm:mb-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{formatViews(video.views || 0)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span>{(video.averageRating || 0).toFixed(1)}</span>
                      </div>
                      {(video.totalRatings || 0) > 0 && (
                        <Badge variant="outline" className="border-white/30 text-white/70 text-xs">
                          {(video.totalRatings || 0)} rating{(video.totalRatings || 0) !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      <div className="flex items-center space-x-1">
                        <span className="text-white/70 text-xs">
                          {video.createdAt ? formatDate(video.createdAt) : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Action buttons */}
                  <div className="flex flex-col items-center space-y-2 sm:space-y-4 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full h-10 w-10 sm:h-12 sm:w-12 ${liked[videoId]
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      onClick={() => toggleLike(videoId)}
                    >
                      <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${liked[videoId] ? 'fill-current' : ''}`} />
                    </Button>
                    <span className="text-white text-xs">
                      {video.likeCount}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-white/20 text-white hover:bg-white/30"
                      onClick={() => openComments(video)}
                    >
                      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                    <span className="text-white text-xs">
                      {video.commentCount}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-white/20 text-white hover:bg-white/30"
                    >
                      <Share className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-white/20 text-white hover:bg-white/30"
                    >
                      <MoreHorizontal className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Video progress indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{
                    width: isCurrentVideo ? '100%' : '0%',
                    transitionDuration: isCurrentVideo ? '3s' : '0s'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Comments Panel */}
      {showComments && currentVideoForComments && (
        <div className="fixed inset-0 z-[9998] bg-black/50">
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl transform transition-transform duration-300 ease-out flex flex-col"
            style={{
              height: '70vh',
              transform: showComments ? 'translateY(0)' : 'translateY(100%)'
            }}
          >
            {/* Comments Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-lg font-semibold">
                  Comments ({comments.length})
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={closeComments}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Comments Content - Now properly scrollable */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              {isCommentsLoading ? (
                // Loading skeleton
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length > 0 ? (
                // Real comments from API
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium text-gray-600">
                        {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm">{comment.user?.username || 'Unknown'}</span>
                          <span className="text-gray-500 text-xs">
                            {formatCommentDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-red-500">
                            <Heart className="h-3 w-3" />
                            <span>0</span>
                          </button>
                          <button className="hover:text-blue-500">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // No comments message
                <div className="text-center py-8">
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="border-t border-gray-200 p-4 flex-shrink-0">
              <form onSubmit={handleSubmitComment}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium text-gray-600">
                    U
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="text-blue-500 font-semibold text-sm px-4 py-2"
                    disabled={!newComment.trim() || isSubmittingComment}
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokView;