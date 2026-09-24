import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits standard for AES-GCM
const PREFIX = 'enc:v1:';

function getDerivedKey(secret: string): Buffer {
  return createHash('sha256')
    .update(secret || 'telemedicine-app-encryption-fallback-key-2026')
    .digest();
}

/**
 * Encrypts a sensitive string (e.g. OAuth refresh token) using AES-256-GCM.
 */
export function encryptToken(
  text: string | null | undefined,
  secret: string,
): string | null | undefined {
  if (!text) return text;
  const key = getDerivedKey(secret);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${PREFIX}${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted token.
 * If the input is not encrypted (e.g. legacy plaintext token), returns it safely as-is.
 */
export function decryptToken(
  encryptedText: string | null | undefined,
  secret: string,
): string | null | undefined {
  if (!encryptedText) return encryptedText;
  if (!encryptedText.startsWith(PREFIX)) {
    return encryptedText;
  }

  try {
    const key = getDerivedKey(secret);
    const parts = encryptedText.slice(PREFIX.length).split(':');
    if (parts.length !== 3) {
      return encryptedText;
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return encryptedText;
  }
}
