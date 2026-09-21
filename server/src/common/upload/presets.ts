import { createUploadOptions, UploadPreset } from './create-upload-options.js';

export const AVATAR_PRESET: UploadPreset = {
  maxSizeMb: 5,
  mimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
  extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  label: 'JPG, JPEG, PNG, WEBP, and GIF images',
};

export const DOCUMENT_PRESET: UploadPreset = {
  maxSizeMb: 10,
  mimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
  ],
  extensions: ['.jpg', '.jpeg', '.png', '.pdf'],
  label: 'JPG, PNG, and PDF',
};

export const REPORT_PRESET: UploadPreset = {
  maxSizeMb: 15,
  mimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
  ],
  extensions: ['.jpg', '.jpeg', '.png', '.pdf'],
  label: 'JPG, PNG, and PDF',
};

export const avatarUploadOptions = createUploadOptions(AVATAR_PRESET);
export const doctorDocumentUploadOptions = createUploadOptions(DOCUMENT_PRESET);
export const reportUploadOptions = createUploadOptions(REPORT_PRESET);
