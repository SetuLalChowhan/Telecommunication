import {
  AboutLeadershipContent,
  AboutPrinciplesContent,
  AboutStatsContent,
  AdviceSectionContent,
  BlogSectionContent,
  DoctorsSectionContent,
  HeroSection,
  HowItWorksSection,
  SectionHeading,
  SpecialtiesSectionContent,
  TestimonialsSectionContent,
} from "./types";

/**
 * Fallback content, identical to the previously hard-coded sections.
 * Any field the CMS omits falls back to these values.
 */

export const DEFAULT_HERO: HeroSection = {
  badge: "Verified physicians · 24/7 care",
  title: "Find trusted doctors. Consult online from home.",
  subtitle:
    "Connect with experienced specialists across Bangladesh for confidential video consultations, clinical follow-ups, and instant digital prescriptions.",
  imageUrl: "/assets/images/HeroImage2.jpg",
  ctaText: "Find a doctor",
  ctaLink: "/doctors",
  trustItems: [
    { label: "BMDC verified doctors", icon: "ShieldCheck" },
    { label: "Instant slot booking", icon: "CalendarCheck" },
    { label: "HD video consultations", icon: "Video" },
    { label: "Digital prescriptions", icon: "FileCheck2" },
  ],
};

export const DEFAULT_SPECIALTIES: SpecialtiesSectionContent = {
  badge: "Medical specialties",
  title: "Dedicated care for every health need",
  subtitle:
    "Explore verified medical specialists across essential healthcare disciplines. Get timely diagnoses and secure video follow-ups from the comfort of your home.",
  ctaText: "Find specialists",
  ctaLink: "/doctors",
  items: [
    {
      title: "Emergency Dentistry",
      description:
        "Instant video consultation and triage for acute toothaches, dental trauma, and prescriptions.",
      slug: "dentistry",
      icon: "Smile",
    },
    {
      title: "Mental Health",
      description:
        "Confidential therapy, depression management, anxiety counseling, and psychiatric wellness.",
      slug: "neurology",
      icon: "Brain",
    },
    {
      title: "Cardiology Care",
      description:
        "Expert cardiology consultations, blood pressure monitoring, ECG reviews, and cardiac care.",
      slug: "cardiology",
      icon: "HeartPulse",
    },
    {
      title: "Pediatric Care",
      description:
        "Comprehensive medical guidance and wellness consultations for infants, kids, and teenagers.",
      slug: "pediatrics",
      icon: "Baby",
    },
    {
      title: "General Medicine",
      description:
        "Routine checkups, fever treatment, chronic disease management, and digital prescriptions.",
      slug: "general-medicine",
      icon: "Stethoscope",
    },
    {
      title: "Ophthalmology",
      description:
        "Virtual eye strain diagnosis, infection triage, and vision correction recommendations.",
      slug: "ophthalmology",
      icon: "Eye",
    },
    {
      title: "Orthopedic & Joint",
      description:
        "Rehabilitation advice and diagnosis for arthritis, spinal pain, sports injuries, and posture.",
      slug: "orthopedics",
      icon: "Bone",
    },
    {
      title: "Urgent Care Triage",
      description:
        "Immediate triage and symptom checks for urgent medical issues requiring fast attention.",
      slug: "general-medicine",
      icon: "ShieldAlert",
    },
  ],
};

export const DEFAULT_HOW_IT_WORKS: HowItWorksSection = {
  badge: "How it works",
  title: "Consult online in three simple steps",
  subtitle:
    "Connect with leading medical specialists in minutes — schedule an appointment, consult over high-quality video, and receive your digital prescription.",
  imageUrl:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80",
  steps: [
    {
      step: "01",
      title: "Find a doctor",
      subtitle: "Search verified specialists",
    },
    { step: "02", title: "Book a schedule", subtitle: "Pick your date & time slot" },
    {
      step: "03",
      title: "Get consultation",
      subtitle: "HD video call & prescription",
    },
  ],
};

export const DEFAULT_DOCTORS: DoctorsSectionContent = {
  badge: "Top specialists",
  title: "Consult with verified doctors",
  subtitle:
    "Connect directly with verified specialists across medical disciplines. Get personalized video consultations, digital prescriptions, and expert care.",
  ctaText: "Browse all doctors",
  ctaLink: "/doctors",
  limit: 8,
};

export const DEFAULT_ADVICE: AdviceSectionContent = {
  badge: "Online telemedicine",
  title: "Consult with doctors online and skip the waiting room",
  subtitle:
    "Connect with certified medical specialists from home. Get timely virtual diagnosis, digital prescriptions, and expert follow-ups in minutes.",
  imageUrl:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80",
  ctaText: "Contact support",
  benefits: [
    {
      title: "24/7 virtual care",
      description: "Consult anytime, day or night",
      icon: "Video",
    },
    {
      title: "Verified doctors",
      description: "BMDC authorized specialists",
      icon: "ShieldCheck",
    },
    {
      title: "Digital prescription",
      description: "Sent directly to your dashboard",
      icon: "FileText",
    },
    {
      title: "Private & secure",
      description: "Encrypted video consultations",
      icon: "Lock",
    },
  ],
};

export const DEFAULT_TESTIMONIALS: TestimonialsSectionContent = {
  badge: "Patient stories",
  title: "What our patients say",
  subtitle:
    "Feedback from patients who experienced fast, reliable, and compassionate virtual care.",
  items: [
    {
      name: "Mohammad Rafiqul Islam",
      role: "Patient · Mirpur, Dhaka",
      quote:
        "Consulting Dr. Sarah online saved me hours in Dhaka traffic. The video call was crystal clear, she reviewed my ECG reports instantly, and sent the e-prescription right to my portal.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Nusrat Jahan",
      role: "Patient · Dhanmondi, Dhaka",
      quote:
        "When my child had a sudden high fever at night, getting an immediate pediatric consultation was a lifesaver. The doctor was patient, caring, and guided us every step of the way.",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Tanvir Ahmed",
      role: "Patient · Chittagong",
      quote:
        "Living outside Dhaka often makes accessing top specialists difficult. This platform connected me directly with leading physicians from national institutes without any hassle.",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
  ],
};

export const DEFAULT_BLOG_SECTION: BlogSectionContent = {
  badge: "Health insights & medical articles",
  title: "Latest healthcare articles & tips",
  subtitle:
    "Stay informed with verified medical advice, preventative care tips, and telehealth guidance written and reviewed by certified physicians.",
  ctaText: "Explore all articles",
  ctaLink: "/blogs",
  limit: 3,
};

export const DEFAULT_ABOUT_HERO: SectionHeading = {
  badge: "About DocConnect",
  title: "Bridging the gap between compassionate care & modern medicine.",
  subtitle:
    "We are on a mission to make certified clinical consultations instantly accessible to every individual, regardless of location, background, or mobility.",
};

export const DEFAULT_ABOUT_STATS: AboutStatsContent = {
  badge: "Platform statistics",
  title: "Our clinical impact across Bangladesh",
  subtitle:
    "Delivering accessible, verified, and secure virtual healthcare nationwide.",
  stats: [
    {
      value: "50,000+",
      label: "Successful consultations",
      subtext: "Across general & specialist care",
    },
    {
      value: "250+",
      label: "BMDC-verified doctors",
      subtext: "Stringently credentialed physicians",
    },
    {
      value: "< 10 min",
      label: "Average response time",
      subtext: "Instant virtual queue connection",
    },
    {
      value: "98.4%",
      label: "Patient satisfaction",
      subtext: "Based on verified post-consult reviews",
    },
  ],
};

export const DEFAULT_ABOUT_PRINCIPLES: AboutPrinciplesContent = {
  badge: "Our commitments",
  title: "The principles behind every consultation",
  subtitle:
    "Clinical rigour, privacy and transparency are enforced by default on every booking.",
  items: [
    {
      title: "Clinical Rigor & Verification",
      description:
        "Every physician on our platform undergoes multi-tier credential verification, including BMDC registration checks, specialty certification validation, and peer clinical reviews.",
      icon: "ShieldCheck",
    },
    {
      title: "Strict Health Data Privacy",
      description:
        "We treat patient confidentiality with the utmost seriousness. Consultations and electronic health records are protected with bank-grade encryption and HIPAA-aligned security protocols.",
      icon: "Lock",
    },
    {
      title: "Verified Digital Prescriptions",
      description:
        "Prescriptions issued through the platform contain verifiable doctor digital signatures and registration numbers, making them universally accepted at pharmacies nationwide.",
      icon: "FileCheck",
    },
    {
      title: "Transparent, Fair Pricing",
      description:
        "We believe high-quality healthcare must be accessible. Doctor fees are displayed upfront with zero hidden booking charges or surprise facility fees.",
      icon: "HeartHandshake",
    },
  ],
};

export const DEFAULT_ABOUT_LEADERSHIP: AboutLeadershipContent = {
  badge: "Clinical leadership",
  title: "Meet the team setting our standards",
  subtitle:
    "Experienced clinicians and health informatics specialists guiding platform governance.",
  items: [
    {
      name: "Prof. Dr. Tariqul Islam",
      role: "Chief Medical Officer & Clinical Lead",
      qualifications: "MBBS, FCPS (Medicine), MD, FACP",
      avatar:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
      bmdc: "BMDC-A-21045",
      bio: "Over 22 years of clinical practice and hospital administration. Oversees platform clinical guidelines and physician onboarding quality.",
    },
    {
      name: "Dr. Farhana Rahman",
      role: "Head of Patient Safety & Protocols",
      qualifications: "MBBS, DGO, FCPS (Obs & Gynae)",
      avatar:
        "https://images.unsplash.com/photo-1594824813580-0a2569260c68?auto=format&fit=crop&w=400&q=80",
      bmdc: "BMDC-A-34890",
      bio: "Leading specialist in women's health with 15+ years experience. Champions patient advocacy and maternal telehealth initiatives.",
    },
    {
      name: "Dr. Mahfuzur Khan",
      role: "Director of Digital Health Integration",
      qualifications: "MBBS, MS (Orthopaedics), MPH (Epidemiology)",
      avatar:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
      bmdc: "BMDC-A-18234",
      bio: "Pioneer in health informatics with deep expertise in optimizing remote clinical workflows and electronic health record architecture.",
    },
  ],
};
