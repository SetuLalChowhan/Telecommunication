import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer, oneTap } from 'better-auth/plugins';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

import { sendEmail } from './email.js';
import { firstFreeSlug, generateDoctorSlug } from '../common/utils/slug.utils.js';

const authPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const adapter = new PrismaPg(authPool);

const prisma = new PrismaClient({
  adapter,
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',

  trustedOrigins: process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'],

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },

  plugins: [
    oneTap(),
    // Allow first-party SPAs (admin/) to authenticate with
    // `Authorization: Bearer <session token>` instead of cookies. This is still
    // a Better Auth session resolved by the normal guard — not a second auth
    // system. The token is exposed via the `set-auth-token` response header.
    bearer(),
  ],


  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.role === 'DOCTOR') {
            // Clean, name-based public URL (`dr-ithika`). Uniqueness is only
            // resolved on an actual collision, so names never pick up an
            // opaque suffix as their default URL.
            const baseSlug = generateDoctorSlug(user.name);
            const taken = await prisma.doctorProfile.findMany({
              where: { slug: { startsWith: baseSlug } },
              select: { slug: true },
            });

            await prisma.doctorProfile.create({
              data: {
                userId: user.id,
                fee: 0,
                slug: firstFreeSlug(
                  baseSlug,
                  taken
                    .map((row) => row.slug)
                    .filter((slug): slug is string => Boolean(slug)),
                ),
              },
            });
          } else if (user.role === 'PATIENT') {
            await prisma.patientProfile.create({
              data: { userId: user.id },
            });
          }
        },
      },
    },
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'PATIENT',
      },
      phone: {
        type: 'string',
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, token }: any) => {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      const resetLink = `${clientUrl}/reset-password?token=${encodeURIComponent(token)}`;

      await sendEmail(
        user.email,
        'Reset your password',
        `
          <h2>Hello, ${user.name || 'User'}!</h2>

          <p>Please click the link below to reset your password:</p>

          <p>
            <a href="${resetLink}">Reset Password</a>
          </p>

          <p>If you did not request a password reset, you can safely ignore this email.</p>
        `,
      );
    },
  },

  emailVerification: {
    sendOnSignUp: true,

    sendVerificationEmail: async ({ user, url }) => {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      const targetUrl = new URL(url);
      const userRole = (user as any)?.role;
      if (userRole) {
        targetUrl.searchParams.set('role', userRole);
      }
      const verificationLink = `${clientUrl}${targetUrl.pathname}${targetUrl.search}`;

      await sendEmail(
        user.email,
        'Verify your email address',
        `
          <h2>Welcome, ${user.name}!</h2>

          <p>Please verify your email address:</p>

          <p>
            <a href="${verificationLink}">Verify Email</a>
          </p>

          <p>If you did not create this account, you can ignore this email.</p>
        `,
      );
    },
  },
});