import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PRIVATE_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000',
    NEXT_PUBLIC_BETTER_AUTH_URL:
      process.env.NEXT_PRIVATE_BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.NEXT_PRIVATE_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000',
    NEXT_PUBLIC_CLIENT_URL:
      process.env.NEXT_PRIVATE_APP_URL ||
      process.env.NEXT_PUBLIC_CLIENT_URL ||
      'http://localhost:3000',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.NEXT_PRIVATE_GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      process.env.GOOGLE_CLIENT_ID ||
      '',
    NEXT_PRIVATE_API_URL:
      process.env.NEXT_PRIVATE_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000',
    NEXT_PRIVATE_BETTER_AUTH_URL:
      process.env.NEXT_PRIVATE_BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.NEXT_PRIVATE_API_URL ||
      'http://localhost:5000',
    NEXT_PRIVATE_APP_URL:
      process.env.NEXT_PRIVATE_APP_URL ||
      process.env.NEXT_PUBLIC_CLIENT_URL ||
      'http://localhost:3000',
    NEXT_PRIVATE_GOOGLE_CLIENT_ID:
      process.env.NEXT_PRIVATE_GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      process.env.GOOGLE_CLIENT_ID ||
      '',
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;

