import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync, unlink } from 'node:fs';
import { extname, join } from 'node:path';
import { promisify } from 'node:util';
import type { Request } from 'express';

const unlinkAsync = promisify(unlink);

export const AVATAR_UPLOAD_DIR = './uploads/avatars';

// Ensure the upload directory exists
if (!existsSync(AVATAR_UPLOAD_DIR)) {
  mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
}

export const avatarUploadOptions = {
  storage: diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
      cb(null, AVATAR_UPLOAD_DIR);
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `avatar-${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/pjpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    const ext = extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    if (
      !allowedMimeTypes.includes(file.mimetype.toLowerCase()) &&
      !allowedExtensions.includes(ext)
    ) {
      return cb(
        new BadRequestException(
          'Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF images are allowed.',
        ),
        false,
      );
    }
    cb(null, true);
  },
};

/**
 * Helper to delete an existing file from disk safely
 */
export async function deleteFileFromDisk(filePath?: string | null): Promise<void> {
  if (!filePath) return;

  try {
    // If given a relative URL like /uploads/avatars/file.png, resolve to local path
    const normalizedPath = filePath.startsWith('/') ? `.${filePath}` : filePath;
    if (existsSync(normalizedPath)) {
      await unlinkAsync(normalizedPath);
    }
  } catch (error) {
    console.error(`Failed to delete old file at ${filePath}:`, error);
  }
}
