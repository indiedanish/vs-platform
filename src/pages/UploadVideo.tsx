import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Video, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../hooks/useAuth';
import { videoService, uploadService } from '../services';

const UploadVideo: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: true,
    videoFile: null as File | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or not a creator
    if (!isAuthenticated || user?.role !== 'CREATOR') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use upload service validation
      const validation = uploadService.validateVideoFile(file);
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          videoFile: validation.error || 'Invalid file'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        videoFile: file
      }));
      
      if (errors.videoFile) {
        setErrors(prev => ({
          ...prev,
          videoFile: ''
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.videoFile) {
      newErrors.videoFile = 'Please select a video file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!formData.videoFile) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Create video metadata
      const video = await videoService.createVideo({
        title: formData.title.trim(),
        description: formData.description.trim() || '',
        isPublic: formData.isPublic
      });

      // Step 2: Upload video file
      await uploadService.uploadVideo(
        formData.videoFile,
        video.id,
        (progress) => setUploadProgress(progress)
      );

      setUploadComplete(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ general: 'Upload failed. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isAuthenticated || user?.role !== 'CREATOR') {
    return null; // Will redirect in useEffect
  }

  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete!</h2>
              <p className="text-gray-600 mb-4">
                Your video has been uploaded successfully and is now available for viewing.
              </p>
              <Button asChild>
                <Link to="/">Go to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-6 w-6" />
              <span>Upload Video</span>
            </CardTitle>
            <CardDescription>
              Share your video with the CloudVideoShare community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Video File Upload */}
              <div className="space-y-2">
                <Label htmlFor="videoFile">Video File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="videoFile"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-10 w-10 text-gray-400" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Click to upload a video
                      </span>
                      <p className="text-xs text-gray-500">
                        MP4, WebM, OGG, AVI, MOV up to 100MB
                      </p>
                    </div>
                  </Label>
                </div>
                {formData.videoFile && (
                  <div className="text-sm text-gray-600">
                    Selected: {formData.videoFile.name} ({formatFileSize(formData.videoFile.size)})
                  </div>
                )}
                {errors.videoFile && (
                  <p className="text-sm text-red-600">{errors.videoFile}</p>
                )}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Video Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter video title"
                    className={errors.title ? 'border-red-500' : ''}
                    disabled={isUploading}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isPublic">Visibility</Label>
                  <Select
                    value={formData.isPublic ? 'public' : 'private'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, isPublic: value === 'public' }))}
                    disabled={isUploading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can view</SelectItem>
                      <SelectItem value="private">Private - Only you can view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter video description (optional)"
                  rows={4}
                  disabled={isUploading}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={isUploading}
                >
                  <Link to="/">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="min-w-[120px]"
                >
                  {isUploading ? (
                    'Uploading...'
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadVideo;