import { ApiResponse } from '@/types';
import { post, get, del } from './api-client';

export interface UploadUrlRequest {
  relatedType?: 'card' | 'user';
  relatedId?: string;
  fileType: 'audio' | 'image';
  mimeType: string;
  fileSize?: number;
}

export interface UploadUrlResponse {
  mediaId: string;
  uploadUrl: string;
  bucket: string;
  objectKey: string;
  expiresIn: number;
}

export interface ConfirmUploadRequest {
  mediaId: string;
  fileSize?: number;
  durationMs?: number;
  relatedType?: string;
  relatedId?: string;
}

export interface MediaFileResponse {
  id: string;
  ownerId: string;
  relatedType: string;
  relatedId: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  durationMs?: number;
  url: string;
  createdAt: string;
}

export const mediaService = {
  // Step 1: Get presigned upload URL from backend
  getUploadUrl: async (request: UploadUrlRequest): Promise<ApiResponse<UploadUrlResponse>> => {
    return post<UploadUrlResponse>('/api/media/upload-url', request);
  },

  // Step 2: Upload file directly to MinIO using presigned URL
  uploadFile: async (uploadUrl: string, file: File): Promise<void> => {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }
  },

  // Step 3: Confirm upload to backend
  confirmUpload: async (request: ConfirmUploadRequest): Promise<ApiResponse<MediaFileResponse>> => {
    return post<MediaFileResponse>('/api/media/confirm', request);
  },

  // Complete upload flow (combines all steps)
  upload: async (
    file: File,
    fileType: 'audio' | 'image',
    relatedType?: 'card' | 'user',
    relatedId?: string
  ): Promise<MediaFileResponse> => {
    // Step 1: Get presigned URL
    const urlResponse = await mediaService.getUploadUrl({
      fileType,
      mimeType: file.type,
      fileSize: file.size,
      relatedType,
      relatedId,
    });

    if (!urlResponse.success) {
      throw new Error(urlResponse.message);
    }

    const { mediaId, uploadUrl } = urlResponse.data;

    // Step 2: Upload to MinIO
    await mediaService.uploadFile(uploadUrl, file);

    // Step 3: Confirm upload
    const confirmResponse = await mediaService.confirmUpload({
      mediaId,
      fileSize: file.size,
      relatedType,
      relatedId,
    });

    if (!confirmResponse.success) {
      throw new Error(confirmResponse.message);
    }

    return confirmResponse.data;
  },

  // Get media file with fresh URL
  getMedia: async (mediaId: string): Promise<ApiResponse<MediaFileResponse>> => {
    return get<MediaFileResponse>(`/api/media/${mediaId}`);
  },

  // Delete media
  deleteMedia: async (mediaId: string): Promise<ApiResponse<void>> => {
    return del<void>(`/api/media/${mediaId}`);
  },
};
