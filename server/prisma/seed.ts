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
        headers: new Headers({
          origin: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
        }),
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
      console.error(' Better-Auth signup encountered error:', err?.message || err);
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

  // 3. Seed Website Sections CMS
  console.log(' Seeding default Website Sections CMS...');
  const defaultSections = [
    {
      key: 'home_hero',
      title: 'Find the Right Doctor. Get Care From Anywhere.',
      subtitle: 'Discover verified doctors, choose a convenient appointment time, and connect through secure online video consultation — all from the comfort of your home.',
      badge: 'Trusted Online Healthcare',
      imageUrl: '/assets/images/HeroImage2.jpg',
      ctaText: 'Find a Doctor',
      ctaLink: '/doctors',
      content: [
        { label: 'Verified Doctors', icon: 'BadgeCheck' },
        { label: 'Easy Online Booking', icon: 'CalendarCheck' },
        { label: 'Video Consultation', icon: 'Video' },
        { label: 'Medical Reports', icon: 'FileText' },
      ],
      isActive: true,
    },
    {
      key: 'home_how_it_works',
      title: 'Simple 3-Step Process to Consult Online',
      subtitle: 'Connecting with leading medical specialists has never been simpler. Follow these 3 easy steps to schedule an appointment, consult online via high-quality video call, and receive instant digital care.',
      badge: 'How It Works',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
      content: [
        { step: '01', title: 'Find a Doctor', subtitle: 'Search verified specialists & ratings' },
        { step: '02', title: 'Book Schedule', subtitle: 'Pick your preferred date & time slot' },
        { step: '03', title: 'Get Consultation', subtitle: 'HD video call & digital prescription' },
      ],
      isActive: true,
    },
    {
      key: 'home_advice',
      title: 'Consult with Doctors Online & Skip the Waiting Room',
      subtitle: 'Connect with certified medical specialists from the comfort of your home. Get timely virtual diagnosis, digital prescriptions, and expert medical follow-ups in minutes.',
      badge: 'Online Telemedicine',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80',
      content: [
        { title: '24/7 Virtual Care', subtitle: 'Consult anytime, day or night', icon: 'Video' },
        { title: 'Verified Doctors', subtitle: 'BMDC authorized specialists', icon: 'ShieldCheck' },
        { title: 'Digital Prescription', subtitle: 'Sent directly to your dashboard', icon: 'FileText' },
        { title: '100% Private & Safe', subtitle: 'Encrypted video consultations', icon: 'Lock' },
      ],
      isActive: true,
    },
    {
      key: 'about_stats',
      title: 'Our Clinical Impact Across Bangladesh',
      subtitle: 'Delivering accessible, verified, and secure virtual healthcare nationwide.',
      badge: 'Platform Statistics',
      content: [
        { value: '50,000+', label: 'Successful Consultations', subtext: 'Across general & specialist care' },
        { value: '250+', label: 'BMDC-Verified Doctors', subtext: 'Stringently credentialed physicians' },
        { value: '< 10 min', label: 'Average Response Time', subtext: 'Instant virtual queue connection' },
        { value: '98.4%', label: 'Patient Satisfaction', subtext: 'Based on verified post-consult reviews' },
      ],
      isActive: true,
    },
  ];

  for (const s of defaultSections) {
    await prisma.websiteSection.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }
  console.log(` Seeded ${defaultSections.length} website CMS sections.`);

  // 4. Seed Healthcare Blog Posts
  console.log(' Seeding sample CMS blog articles...');
  const sampleBlogs = [
    {
      slug: 'understanding-hypertension-silent-killer',
      title: 'Understanding Hypertension: Managing the Silent Killer in Urban Life',
      subtitle: 'Comprehensive guide to blood pressure monitoring, dietary sodium, and virtual cardiology care.',
      excerpt: 'High blood pressure affects over 1 in 4 adults. Learn how early detection, low-sodium diets, and regular telemedicine check-ins keep your cardiovascular health in optimal shape.',
      category: 'Heart & Cardiovascular',
      tags: ['Hypertension', 'Cardiology', 'Preventative Health', 'Diet'],
      readTime: '6 min read',
      published: true,
      publishedAt: new Date('2026-08-15'),
      featured: true,
      viewsCount: 1420,
      featuredImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
      authorName: 'Dr. Sarah Jenkins',
      authorRole: 'Senior Cardiologist',
      authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      authorBio: 'Dr. Sarah Jenkins is an interventional cardiologist with 14+ years of clinical experience.',
      reviewerName: 'Dr. Michael Chen',
      reviewerTitle: 'Consultant Neurologist & Clinical Director',
      reviewerAvatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
      reviewerDate: 'August 18, 2026',
      keyTakeaways: [
        'Normal blood pressure is under 120/80 mmHg; stage 1 hypertension starts at 130/80 mmHg.',
        'Reducing dietary sodium to under 2,000 mg daily significantly reduces stroke risk.',
      ],
      content: [
        {
          type: 'heading',
          text: 'The Growing Prevalence of High Blood Pressure',
        },
        {
          type: 'paragraph',
          text: 'Hypertension often develops silently without noticeable symptoms until secondary complications arise. Modern sedentary habits and high sodium diets have accelerated its incidence.',
        },
      ],
    },
    {
      slug: 'telehealth-pediatrics-safe-virtual-child-care',
      title: 'Pediatric Telehealth: When Is Virtual Consultation Safe for Your Child?',
      subtitle: 'A practical parents guide to recognizing symptoms treatable online versus emergency hospital visits.',
      excerpt: 'Virtual consultations can efficiently resolve 80% of common pediatric complaints including rash evaluations, mild fevers, feeding questions, and prescription refills.',
      category: 'Family & Pediatrics',
      tags: ['Pediatrics', 'Child Health', 'Telehealth'],
      readTime: '5 min read',
      published: true,
      publishedAt: new Date('2026-08-28'),
      featured: true,
      viewsCount: 980,
      featuredImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
      authorName: 'Dr. Amanda Miller',
      authorRole: 'Pediatric Specialist',
      authorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      authorBio: 'Dr. Amanda Miller is a consultant pediatrician passionate about child development.',
      reviewerName: 'Dr. Farhana Rahman',
      reviewerTitle: 'Associate Professor of Pediatrics',
      reviewerAvatar: 'https://images.unsplash.com/photo-1594824813590-7892f3922f3f?auto=format&fit=crop&w=400&q=80',
      reviewerDate: 'September 1, 2026',
      keyTakeaways: [
        'Mild fevers, common colds, rash photos, and medication questions are ideal for video visits.',
      ],
      content: [
        {
          type: 'heading',
          text: 'Maximizing Convenience Without Compromising Safety',
        },
        {
          type: 'paragraph',
          text: 'Parents often struggle to decide between a crowded hospital waiting room and waiting out a symptom. Telehealth bridges this gap.',
        },
      ],
    },
  ];

  for (const b of sampleBlogs) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }
  console.log(` Seeded ${sampleBlogs.length} sample blog articles.`);

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
