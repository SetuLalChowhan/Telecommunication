import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DB_POOL_MAX: z.coerce.number().min(1).max(50).default(10),

  // Authentication & Session
  BETTER_AUTH_URL: z.string().url().default('http://localhost:5000'),
  BETTER_AUTH_SECRET: z.string().optional(),
  TRUSTED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173,http://localhost:5000'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),

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
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_SECURE: z.coerce.boolean().default(false),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

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
