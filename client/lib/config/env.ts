import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .default('http://localhost:5000'),
  NEXT_PUBLIC_CLIENT_URL: z
    .string()
    .url()
    .default('http://localhost:3000'),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z
    .string()
    .optional()
    .default(''),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

function parseEnv() {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    console.error('❌ Invalid client environment variables:', result.error.format());
    throw new Error('Invalid client environment variables');
  }

  return result.data;
}

export const env = parseEnv();
