import { BadRequestException } from '@nestjs/common';
import { memoryStorage, MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';
import { extname } from 'node:path';

export interface UploadPreset {
  maxSizeMb: number;
  mimeTypes: string[];
  extensions: string[];
  label: string;
}

export function createUploadOptions({
  maxSizeMb,
  mimeTypes,
  extensions,
  label,
}: UploadPreset): MulterOptions {
  const normalizedMimes = mimeTypes.map((m) => m.toLowerCase());
  const normalizedExts = extensions.map((e) => e.toLowerCase());

  return {
    storage: memoryStorage(),
    limits: {
      fileSize: maxSizeMb * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();
      const okMime = normalizedMimes.includes(file.mimetype.toLowerCase());
      const okExt = normalizedExts.includes(ext);

      if (okMime || okExt) {
        return cb(null, true);
      }

      return cb(
        new BadRequestException(
          `Invalid file type. Only ${label} files are allowed.`,
        ),
        false,
      );
    },
  };
}
