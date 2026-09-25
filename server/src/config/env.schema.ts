import { z } from 'zod';

/**
 * A boolean env var that reliably parses `"false"` / `"0"` / `"no"` as `false`.
 * `z.coerce.boolean()` treats any non-empty string as `true`, which silently
 * turns `EMAIL_SECURE=false` into an upgrade to a secure connection.
 */
const booleanEnv = z
  .union([z.boolean(), z.string()])
  .transform((value) => {
    if (typeof value === 'boolean') return value;
    return ['true', '1', 'yes', 'on'].includes(value.trim().toLowerCase());
  });

function isLocalHostname(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local')
  );
}

function isLocalUrl(value: string): boolean {
  try {
    const { hostname } = new URL(value);
    return isLocalHostname(hostname);
  } catch {
    return false;
  }
}

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(5000),

    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    DB_POOL_MAX: z.coerce.number().int().min(1).max(50).default(10),

    // Authentication & Session
    BETTER_AUTH_URL: z.string().url().default('http://localhost:5000'),
    BETTER_AUTH_SECRET: z.string().optional(),
    TRUSTED_ORIGINS: z
      .string()
      .default(
        'http://localhost:3000,http://localhost:5173,http://localhost:5000',
      ),
    CLIENT_URL: z.string().url().default('http://localhost:3000'),

    // Dedicated key for encrypting OAuth refresh tokens at rest (AES-256-GCM).
    // Kept separate from the session secret so either can be rotated alone.
    TOKEN_ENCRYPTION_KEY: z.string().optional(),

    // Number of trusted reverse proxies in front of the app (rate-limiting /
    // client-IP correctness). Omit when the app is directly exposed.
    TRUST_PROXY: z.coerce.number().int().min(0).max(10).optional(),

    // Google Integration
    GOOGLE_CLIENT_ID: z.string().optional().default(''),
    GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
    GOOGLE_CALENDAR_REDIRECT_URI: z.string().optional(),
    GOOGLE_REDIRECT_URI: z.string().optional(),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    // Email / SMTP
    EMAIL_HOST: z.string().optional(),
    EMAIL_PORT: z.coerce.number().int().min(1).max(65535).default(587),
    EMAIL_SECURE: booleanEnv.default(false),
    EMAIL_USER: z.string().optional(),
    EMAIL_PASS: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    const origins = parseTrustedOrigins(env.TRUSTED_ORIGINS);

    // A wildcard origin combined with credentialed requests is never valid.
    if (origins.includes('*')) {
      ctx.addIssue({
        code: 'custom',
        path: ['TRUSTED_ORIGINS'],
        message:
          'Wildcard ("*") is not allowed because credentialed CORS requests are enabled.',
      });
    }

    // Cloudinary is all-or-nothing: a half-configured client fails at runtime.
    const cloudinaryVars = [
      env.CLOUDINARY_CLOUD_NAME,
      env.CLOUDINARY_API_KEY,
      env.CLOUDINARY_API_SECRET,
    ];
    const configuredCloudinary = cloudinaryVars.filter(Boolean).length;
    if (configuredCloudinary > 0 && configuredCloudinary < 3) {
      ctx.addIssue({
        code: 'custom',
        path: ['CLOUDINARY_CLOUD_NAME'],
        message:
          'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must all be set together.',
      });
    }

    // SMTP needs credentials once a host is configured.
    if (env.EMAIL_HOST && (!env.EMAIL_USER || !env.EMAIL_PASS)) {
      ctx.addIssue({
        code: 'custom',
        path: ['EMAIL_USER'],
        message: 'EMAIL_USER and EMAIL_PASS are required when EMAIL_HOST is set.',
      });
    }

    if (env.NODE_ENV !== 'production') {
      return;
    }

    const requireProduction = (condition: boolean, path: string, message: string) => {
      if (!condition) ctx.addIssue({ code: 'custom', path: [path], message });
    };

    requireProduction(
      Boolean(env.BETTER_AUTH_SECRET && env.BETTER_AUTH_SECRET.length >= 32),
      'BETTER_AUTH_SECRET',
      'BETTER_AUTH_SECRET must be set to a high-entropy value of at least 32 characters in production.',
    );
    requireProduction(
      Boolean(env.TOKEN_ENCRYPTION_KEY && env.TOKEN_ENCRYPTION_KEY.length >= 32),
      'TOKEN_ENCRYPTION_KEY',
      'TOKEN_ENCRYPTION_KEY must be set to a high-entropy value of at least 32 characters in production.',
    );
    requireProduction(
      !isLocalUrl(env.DATABASE_URL) && !/localhost|127\.0\.0\.1/i.test(env.DATABASE_URL),
      'DATABASE_URL',
      'DATABASE_URL must not point at localhost in production.',
    );
    requireProduction(
      !isLocalUrl(env.BETTER_AUTH_URL) && env.BETTER_AUTH_URL.startsWith('https://'),
      'BETTER_AUTH_URL',
      'BETTER_AUTH_URL must be a public https URL in production.',
    );
    requireProduction(
      !isLocalUrl(env.CLIENT_URL) && env.CLIENT_URL.startsWith('https://'),
      'CLIENT_URL',
      'CLIENT_URL must be a public https URL in production.',
    );
    requireProduction(
      origins.length > 0,
      'TRUSTED_ORIGINS',
      'TRUSTED_ORIGINS must list at least one origin in production.',
    );
    for (const origin of origins) {
      if (origin === '*') continue;
      requireProduction(
        origin.startsWith('https://') && !isLocalUrl(origin),
        'TRUSTED_ORIGINS',
        `Trusted origin "${origin}" must be a public https origin in production.`,
      );
    }
  });

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Normalizes the comma-separated TRUSTED_ORIGINS value into a clean list:
 * trims whitespace, drops empty entries, removes trailing slashes and
 * de-duplicates. Shared by bootstrap CORS and Better Auth.
 */
export function parseTrustedOrigins(raw?: string | null): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const entry of raw.split(',')) {
    const trimmed = entry.trim().replace(/\/+$/, '');
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }

  return result;
}

export function validateEnv(config: Record<string, unknown> = process.env): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`❌ Environment validation failed:\n${errorDetails}`);
  }

  return result.data;
}
