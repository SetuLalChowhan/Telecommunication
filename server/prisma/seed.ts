import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { auth } from '../src/auth/auth.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Specialties
  const specialties = [
    { name: 'General Physician', slug: 'general-physician' },
    { name: 'Cardiology', slug: 'cardiology' },
    { name: 'Dermatology', slug: 'dermatology' },
    { name: 'Pediatrics', slug: 'pediatrics' },
    { name: 'Gynecology & Obstetrics', slug: 'gynecology-obstetrics' },
    { name: 'Orthopedics', slug: 'orthopedics' },
    { name: 'Neurology', slug: 'neurology' },
    { name: 'Psychiatry', slug: 'psychiatry' },
  ];

  console.log(' Seeding specialties...');
  for (const s of specialties) {
    await prisma.specialty.upsert({
      where: { slug: s.slug },
      update: { name: s.name, isActive: true },
      create: { name: s.name, slug: s.slug, isActive: true },
    });
  }

  // 2. Seed Super Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@telemed.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminName = 'Super Admin';

  console.log(` Checking Super Admin (${adminEmail})...`);
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    console.log(' Creating Super Admin account via Better-Auth...');
    try {
      const authResult = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      });

      if (authResult?.user?.id) {
        await prisma.user.update({
          where: { id: authResult.user.id },
          data: {
            role: Role.ADMIN,
            emailVerified: true,
          },
        });
        console.log(` Super Admin created with ID: ${authResult.user.id}`);
      }
    } catch (err: any) {
      console.warn(' Better-Auth signup encountered error or email exists:', err?.message || err);
    }
  } else {
    // Ensure role is ADMIN and email is verified
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        role: Role.ADMIN,
        emailVerified: true,
      },
    });
    console.log(` Super Admin already exists (${adminEmail}), role set to ADMIN.`);
  }

  console.log(' Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
