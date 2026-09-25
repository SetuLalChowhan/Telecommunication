import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { extname } from 'node:path';
import type { Request } from 'express';

/** Broad category a caller is willing to accept. */
export type AllowedFileKind = 'image' | 'pdf';

export interface UploadPreset {
  /** Human-readable description used in error messages. */
  label: string;
  maxSizeBytes: number;
  kinds: AllowedFileKind[];
}

/**
 * Detect a file's true type from its leading bytes ("magic bytes") instead of
 * trusting the client-supplied MIME type or extension, both of which are
 * trivially spoofed.
 */
export function sniffFileKind(
  buffer: Buffer | undefined,
): 'pdf' | 'jpeg' | 'png' | 'gif' | 'webp' | null {
  if (!buffer || buffer.length < 12) return null;

  // %PDF
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return 'pdf';
  }
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpeg';
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'png';
  }
  // GIF87a / GIF89a
  const head6 = buffer.subarray(0, 6).toString('ascii');
  if (head6 === 'GIF87a' || head6 === 'GIF89a') {
    return 'gif';
  }
  // WEBP: "RIFF" .... "WEBP"
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }

  return null;
}

function kindToFileKind(kind: ReturnType<typeof sniffFileKind>): AllowedFileKind | null {
  if (kind === 'pdf') return 'pdf';
  if (kind) return 'image';
  return null;
}

/**
 * Verify that an already-buffered upload's real content matches the accepted
 * kinds. Must run before the buffer is forwarded to storage.
 */
export function assertFileSignature(
  file: Pick<Express.Multer.File, 'buffer' | 'originalname'>,
  kinds: AllowedFileKind[],
): void {
  const actualKind = kindToFileKind(sniffFileKind(file.buffer));

  if (!actualKind || !kinds.includes(actualKind)) {
    const accepted = kinds.map((k) => (k === 'pdf' ? 'PDF' : 'images')).join(' / ');
    throw new BadRequestException(
      `File content does not match an accepted format (${accepted}).`,
    );
  }
}

/**
 * Builds a Multer preset that rejects oversized files and unexpected
 * extensions before the buffer is handed to a service. The buffer's real
 * signature is verified separately via {@link assertFileSignature}.
 */
export function createUploadOptions(preset: UploadPreset) {
  const allowedExtensions =
    preset.kinds.length === 2
      ? ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf']
      : preset.kinds[0] === 'pdf'
        ? ['.pdf']
        : ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  const allowedMimeTypes =
    preset.kinds.length === 2
      ? [
          'image/jpeg',
          'image/jpg',
          'image/pjpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'application/pdf',
        ]
      : preset.kinds[0] === 'pdf'
        ? ['application/pdf']
        : ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp', 'image/gif'];

  return {
    storage: memoryStorage(),
    limits: {
      fileSize: preset.maxSizeBytes,
    },
    fileFilter: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      const ext = extname(file.originalname).toLowerCase();
      const mimetype = (file.mimetype || '').toLowerCase();

      if (!allowedExtensions.includes(ext) && !allowedMimeTypes.includes(mimetype)) {
        return cb(
          new BadRequestException(
            `Invalid file type. Allowed: ${preset.label}.`,
          ),
          false,
        );
      }
      cb(null, true);
    },
  };
}

export const avatarUploadOptions = createUploadOptions({
  label: 'JPG, PNG, WEBP or GIF images',
  maxSizeBytes: 5 * 1024 * 1024,
  kinds: ['image'],
});

export const doctorDocumentUploadOptions = createUploadOptions({
  label: 'JPG, PNG or PDF files',
  maxSizeBytes: 10 * 1024 * 1024,
  kinds: ['image', 'pdf'],
});

export const reportUploadOptions = createUploadOptions({
  label: 'JPG, PNG or PDF files',
  maxSizeBytes: 15 * 1024 * 1024,
  kinds: ['image', 'pdf'],
});
