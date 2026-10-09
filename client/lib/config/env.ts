export const env = {
  API_URL:
    process.env.NEXT_PRIVATE_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000',
  APP_URL:
    process.env.NEXT_PRIVATE_APP_URL ||
    process.env.NEXT_PUBLIC_CLIENT_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000',
  BETTER_AUTH_URL:
    process.env.NEXT_PRIVATE_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PRIVATE_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000',
  GOOGLE_CLIENT_ID:
    process.env.NEXT_PRIVATE_GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PRIVATE_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000',
  NEXT_PUBLIC_CLIENT_URL:
    process.env.NEXT_PRIVATE_APP_URL ||
    process.env.NEXT_PUBLIC_CLIENT_URL ||
    'http://localhost:3000',
  NEXT_PRIVATE_API_URL:
    process.env.NEXT_PRIVATE_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000',
  NEXT_PRIVATE_APP_URL:
    process.env.NEXT_PRIVATE_APP_URL ||
    process.env.NEXT_PUBLIC_CLIENT_URL ||
    'http://localhost:3000',
  NEXT_PUBLIC_GOOGLE_CLIENT_ID:
    process.env.NEXT_PRIVATE_GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '',
  NEXT_PRIVATE_GOOGLE_CLIENT_ID:
    process.env.NEXT_PRIVATE_GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '',
  NEXT_PUBLIC_BETTER_AUTH_URL:
    process.env.NEXT_PRIVATE_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    'http://localhost:5000',
  NEXT_PRIVATE_BETTER_AUTH_URL:
    process.env.NEXT_PRIVATE_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    'http://localhost:5000',
};
