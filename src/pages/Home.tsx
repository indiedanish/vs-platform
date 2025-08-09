import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Eye, Calendar, Grid3X3, Smartphone } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Toggle } from '../components/ui/toggle';
import TikTokView from '../components/TikTokView';
import { Video } from '../services/types';
import { videoService } from '../services';
import { genreOptions, ageRatingOptions, sortOptions } from '../data/mockData';

const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedAgeRating, setSelectedAgeRating] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'tiktok'>('grid');

  useEffect(() => {
    loadVideos();
  }, []);

  const filterAndSortVideos = useCallback(() => {
    let filtered = [...videos];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.creator.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Note: Genre and age rating filters are disabled for now since the API doesn't provide these fields
    // They can be re-enabled when the backend supports these fields

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'most-viewed':
          return b.views - a.views;
        case 'top-rated':
          return b.averageRating - a.averageRating;
        default:
          return 0;
      }
    });

    setFilteredVideos(filtered);
  }, [videos, searchQuery, selectedGenre, selectedAgeRating, sortBy]);

  useEffect(() => {
    filterAndSortVideos();
  }, [filterAndSortVideos]);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const response = await videoService.getVideos({
        page: 1,
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setVideos(response.videos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const VideoCard: React.FC<{ video: Video }> = ({ video }) => (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/video/${video.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={video.thumbnailUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VmlkZW8gVGh1bWJuYWlsPC90ZXh0Pgo8L3N2Zz4='}
            alt={video.title}
            className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-12 w-12" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{video.creator.username}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{formatViews(video.views)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(video.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {video.isPublic ? 'Public' : 'Private'}
              </Badge>
              {video.totalRatings > 0 && (
                <Badge variant="outline" className="text-xs">
                  {video.totalRatings} rating{video.totalRatings !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{video.averageRating.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  const VideoSkeleton: React.FC = () => (
    <Card>
      <Skeleton className="w-full h-48 rounded-t-lg" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-8" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Discover Videos</h1>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'tiktok' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('tiktok')}
                  className="h-8 px-3"
                >
                  <Smartphone className="h-4 w-4 mr-1" />
                  TikTok
                </Button>
              </div>
            </div>

            {viewMode === 'grid' && (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genreOptions.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedAgeRating} onValueChange={setSelectedAgeRating}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Age Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageRatingOptions.map((rating) => (
                      <SelectItem key={rating} value={rating}>
                        {rating}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Results count */}
          {!isLoading && viewMode === 'grid' && (
            <div className="mt-4 text-sm text-muted-foreground">
              {filteredVideos.length === 0 ? (
                searchQuery ? `No videos found for "${searchQuery}"` : 'No videos found'
              ) : (
                `Showing ${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''}`
              )}
            </div>
          )}
        </div>

        {/* Video Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, index) => (
                <VideoSkeleton key={index} />
              ))
            ) : filteredVideos.length > 0 ? (
              // Video cards
              filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            ) : (
              // Empty state
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <Play className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery
                      ? `Try adjusting your search or filters to find what you're looking for.`
                      : 'There are no videos available at the moment.'
                    }
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedGenre('All');
                        setSelectedAgeRating('All');
                        setSortBy('newest');
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          // TikTok View
          <div className="fixed inset-0 top-16 z-40">
            {isLoading ? (
              <div className="h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Loading videos...</p>
                </div>
              </div>
            ) : (
              <TikTokView videos={filteredVideos} onBackToGrid={() => setViewMode('grid')} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;