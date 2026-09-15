import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { extname } from 'node:path';
import type { Request } from 'express';

export const avatarUploadOptions = {
  storage: memoryStorage(),
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

export const doctorDocumentUploadOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = extname(file.originalname).toLowerCase();

    if (
      !allowedMimeTypes.includes(file.mimetype.toLowerCase()) &&
      !allowedExtensions.includes(ext)
    ) {
      return cb(
        new BadRequestException(
          'Invalid file type. Only JPG, PNG, and PDF files are allowed.',
        ),
        false,
      );
    }
    cb(null, true);
  },
};

export const reportUploadOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = extname(file.originalname).toLowerCase();

    if (
      !allowedMimeTypes.includes(file.mimetype.toLowerCase()) &&
      !allowedExtensions.includes(ext)
    ) {
      return cb(
        new BadRequestException(
          'Invalid file type. Only JPG, PNG, and PDF files are allowed.',
        ),
        false,
      );
    }
    cb(null, true);
  },
};
