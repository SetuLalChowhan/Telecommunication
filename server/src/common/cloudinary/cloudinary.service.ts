import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'node:stream';
import { existsSync, unlink } from 'node:fs';
import { promisify } from 'node:util';

const unlinkAsync = promisify(unlink);

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  resourceType?: 'image' | 'raw' | 'auto' | 'video';
  transformation?: any[];
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY') || process.env.CLOUDINARY_API_KEY;
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET') || process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.warn('Cloudinary credentials are not fully configured in environment variables.');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  /**
   * Upload an in-memory Multer file buffer to Cloudinary using streaming
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'telehealth/general',
    options?: CloudinaryUploadOptions,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: options?.resourceType || 'auto',
          transformation: options?.transformation,
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            this.logger.error(`Cloudinary upload failed: ${error.message}`, error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary upload returned no result.'));
          }

          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        },
      );

      const bufferStream = Readable.from(file.buffer);
      bufferStream.pipe(uploadStream);
    });
  }

  /**
   * Extract Cloudinary public_id from a full URL
   * Example URL: https://res.cloudinary.com/ddged1k3w/image/upload/v1726388/telehealth/avatars/xyz123.jpg
   * Returns: telehealth/avatars/xyz123
   */
  extractPublicId(urlOrPublicId: string): { publicId: string; resourceType: 'image' | 'raw' | 'video' } {
    if (!urlOrPublicId.includes('res.cloudinary.com')) {
      return { publicId: urlOrPublicId, resourceType: 'image' };
    }

    // Determine resource type from URL (image, raw, video)
    let resourceType: 'image' | 'raw' | 'video' = 'image';
    if (urlOrPublicId.includes('/raw/upload/')) {
      resourceType = 'raw';
    } else if (urlOrPublicId.includes('/video/upload/')) {
      resourceType = 'video';
    }

    // Split after upload/ or upload/v[0-9]+/
    const uploadIndex = urlOrPublicId.indexOf('/upload/');
    if (uploadIndex === -1) {
      return { publicId: urlOrPublicId, resourceType };
    }

    let remainder = urlOrPublicId.substring(uploadIndex + 8); // length of '/upload/' is 8
    // Strip version prefix e.g., 'v123456789/'
    if (remainder.match(/^v\d+\//)) {
      remainder = remainder.replace(/^v\d+\//, '');
    }

    // Strip file extension if present for images
    const lastDotIndex = remainder.lastIndexOf('.');
    if (lastDotIndex !== -1 && resourceType === 'image') {
      remainder = remainder.substring(0, lastDotIndex);
    }

    return { publicId: remainder, resourceType };
  }

  /**
   * Safely delete a file from Cloudinary (or fallback legacy local file)
   */
  async deleteFile(urlOrPublicId?: string | null): Promise<boolean> {
    if (!urlOrPublicId) return false;

    // Handle legacy local uploads path (/uploads/avatars/...)
    if (urlOrPublicId.startsWith('/uploads/') || urlOrPublicId.startsWith('./uploads/')) {
      try {
        const normalized = urlOrPublicId.startsWith('/') ? `.${urlOrPublicId}` : urlOrPublicId;
        if (existsSync(normalized)) {
          await unlinkAsync(normalized);
          return true;
        }
      } catch (err) {
        this.logger.warn(`Failed to unlink local legacy file ${urlOrPublicId}: ${err}`);
      }
      return false;
    }

    // Skip non-Cloudinary external URLs (e.g., Google OAuth profile pictures like googleusercontent.com)
    if (!urlOrPublicId.includes('res.cloudinary.com') && urlOrPublicId.startsWith('http')) {
      return false;
    }

    try {
      const { publicId, resourceType } = this.extractPublicId(urlOrPublicId);
      const res = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
      });

      if (res.result === 'ok') {
        this.logger.log(`Deleted Cloudinary asset: ${publicId}`);
        return true;
      } else {
        this.logger.warn(`Cloudinary destroy returned result: ${res.result} for ${publicId}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Error deleting Cloudinary asset ${urlOrPublicId}:`, error);
      return false;
    }
  }
}
