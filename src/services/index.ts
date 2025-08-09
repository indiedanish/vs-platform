// Services Index - Export all services and types
export * from "./api";
export * from "./types";
export * from "./authService";
export * from "./userService";
export * from "./videoService";
export * from "./commentService";
export * from "./ratingService";
export * from "./uploadService";

// Re-export service instances for easy importing
export { authService } from "./authService";
export { userService } from "./userService";
export { videoService } from "./videoService";
export { commentService } from "./commentService";
export { ratingService } from "./ratingService";
export { uploadService } from "./uploadService";
