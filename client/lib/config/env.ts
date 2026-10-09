import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5000'),
  NEXT_PUBLIC_CLIENT_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional().default(''),
  NEXT_PRIVATE_API_URL: z.string().url().default('http://localhost:5000'),
  NEXT_PRIVATE_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PRIVATE_BETTER_AUTH_URL: z.string().url().optional(),
  NEXT_PRIVATE_GOOGLE_CLIENT_ID: z.string().optional().default(''),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

function parseEnv() {
  const apiUrl =
    process.env.NEXT_PRIVATE_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:5000';

  const clientUrl =
    process.env.NEXT_PRIVATE_APP_URL ||
    process.env.NEXT_PUBLIC_CLIENT_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000';

  const betterAuthUrl =
    process.env.NEXT_PRIVATE_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    apiUrl;

  const googleClientId =
    process.env.NEXT_PRIVATE_GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    '';

  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_CLIENT_URL: clientUrl,
    NEXT_PUBLIC_BETTER_AUTH_URL: betterAuthUrl,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: googleClientId,
    NEXT_PRIVATE_API_URL: apiUrl,
    NEXT_PRIVATE_APP_URL: clientUrl,
    NEXT_PRIVATE_BETTER_AUTH_URL: betterAuthUrl,
    NEXT_PRIVATE_GOOGLE_CLIENT_ID: googleClientId,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    console.error('❌ Invalid client environment variables:', result.error.format());
    throw new Error('Invalid client environment variables');
  }

  return result.data;
}

export const env = parseEnv();
