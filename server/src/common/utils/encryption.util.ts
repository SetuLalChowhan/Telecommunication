import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits standard for AES-GCM
const PREFIX = 'enc:v1:';

const MIN_SECRET_LENGTH = 32;

/**
 * Derives the 256-bit AES key from a caller-supplied secret.
 *
 * There is intentionally no hardcoded fallback: a fixed key baked into the
 * source would let anyone decrypt stored OAuth tokens. Missing or weak secrets
 * fail loudly instead of silently degrading to an insecure key.
 */
function getDerivedKey(secret: string): Buffer {
  if (!secret || secret.trim().length < MIN_SECRET_LENGTH) {
    throw new Error(
      `Encryption secret must be at least ${MIN_SECRET_LENGTH} characters. Set TOKEN_ENCRYPTION_KEY (or BETTER_AUTH_SECRET).`,
    );
  }
  return createHash('sha256').update(secret).digest();
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
