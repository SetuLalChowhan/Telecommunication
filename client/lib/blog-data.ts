export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bmdcReg?: string;
  bio: string;
}

export interface BlogReviewer {
  name: string;
  title: string;
  avatar: string;
  reviewDate: string;
}

export interface BlogContentBlock {
  type: "paragraph" | "heading" | "subheading" | "quote" | "list" | "callout";
  text?: string;
  items?: string[];
  author?: string;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "Telehealth & Care" | "Heart & Cardiovascular" | "Family & Pediatrics" | "Mental Wellness" | "Preventative Health" | "Nutrition & Lifestyle";
  author: BlogAuthor;
  reviewer: BlogReviewer;
  publishedAt: string;
  readTime: string;
  featuredImage: string;
  imageCaption: string;
  excerpt: string;
  tags: string[];
  featured?: boolean;
  keyTakeaways: string[];
  content: BlogContentBlock[];
  faqs?: BlogFAQ[];
}

export const BLOG_CATEGORIES = [
  "All Articles",
  "Telehealth & Care",
  "Heart & Cardiovascular",
  "Family & Pediatrics",
  "Mental Wellness",
  "Preventative Health",
  "Nutrition & Lifestyle",
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "improve-quickly-online-consultations",
    title: "How to Prepare for Your Online Doctor Video Consultation",
    subtitle: "A practical clinician guide to logging symptoms, setting up lighting, and getting precise diagnostic advice from home.",
    category: "Telehealth & Care",
    featured: true,
    author: {
      name: "Dr. Farhana Rahman",
      role: "Internal Medicine Specialist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      bmdcReg: "BMDC-A-48921",
      bio: "Dr. Farhana is a practicing consultant physician with over 11 years of clinical and virtual triage experience in Dhaka Medical College Hospital.",
    },
    reviewer: {
      name: "Prof. Dr. Tariqul Islam",
      title: "Chief Medical Officer, MBBS, FCPS",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
      reviewDate: "September 14, 2026",
    },
    publishedAt: "September 16, 2026",
    readTime: "5 min read",
    featuredImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "A patient reviewing diagnostic vitals during a telehealth video consultation.",
    excerpt: "Discover proven preparation steps, symptom timelines, and vital check routines to ensure your telemedicine session is as accurate and efficient as an in-person clinic visit.",
    tags: ["Telehealth", "Patient Guide", "Virtual Care", "Health Tips"],
    keyTakeaways: [
      "Prepare a chronological log of when your symptoms started and what triggers or relieves them.",
      "Have previous lab reports, current prescription bottles, and allergy history within arm's reach.",
      "Check vital signs beforehand: resting pulse, blood pressure, temperature, or blood sugar if available.",
      "Position your device in a quiet room with frontal light so the doctor can clearly examine visible signs.",
    ],
    content: [
      {
        type: "paragraph",
        text: "Telemedicine has transitioned from a convenience to a cornerstone of modern healthcare delivery. When planned properly, a video consultation provides the exact same diagnostic depth for non-emergency medical evaluations as a traditional clinic visit, while sparing patients hours of traffic and waiting room exposure.",
      },
      {
        type: "heading",
        text: "1. Structure Your Symptom History Chronologically",
      },
      {
        type: "paragraph",
        text: "The most valuable asset in clinical diagnosis is a well-structured patient history. Before joining the video room, take two minutes to write down three essential points:",
      },
      {
        type: "list",
        items: [
          "Onset & Duration: When did the first symptom appear? Was it sudden or gradual?",
          "Severity & Triggers: On a scale of 1 to 10, how intense is the discomfort? Does exertion, food, or rest change it?",
          "Associated Symptoms: Have you had fever, nausea, fatigue, localized rashes, or sleep disruption?",
        ],
      },
      {
        type: "quote",
        text: "A patient who presents clear timeline notes allows the physician to dedicate more time to differential diagnosis and personalized treatment options rather than guessing symptom sequences.",
        author: "Dr. Farhana Rahman, Internal Medicine Consultant",
      },
      {
        type: "heading",
        text: "2. Have Current Medications and Recent Lab Tests Ready",
      },
      {
        type: "paragraph",
        text: "Drug-to-drug interactions and dosage nuances are critical safety points. Keep your actual medication packets or high-resolution photos of your previous prescriptions ready to upload into the consultation chat window.",
      },
      {
        type: "callout",
        text: "Clinical Safety Tip: If you have chronic conditions such as Hypertension, Diabetes, or Asthma, measure your current readings (e.g., BP: 125/82 mmHg, Fasting Glucose: 6.1 mmol/L) immediately prior to the call and share them with the doctor.",
      },
      {
        type: "heading",
        text: "3. Optimize Video Lighting and Audio Quality",
      },
      {
        type: "paragraph",
        text: "Natural front-facing illumination allows physicians to inspect throat redness, conjunctival pallor, skin texture, or breathing patterns. Avoid backlighting from windows behind you, and use standard earphones with a built-in microphone for clear communication.",
      },
    ],
    faqs: [
      {
        question: "Can doctors prescribe medication digitally in Bangladesh?",
        answer: "Yes, verified BMDC-registered physicians can legally issue signed digital e-prescriptions with unique verification IDs directly to your telehealth dashboard.",
      },
      {
        question: "What if my condition requires an in-person physical examination?",
        answer: "If the doctor determines that hands-on palpation, emergency auscultation, or urgent imaging is required, they will immediately triage and refer you to an affiliated hospital or urgent care clinic.",
      },
    ],
  },
  {
    id: "blog-2",
    slug: "preventive-care-healthy-heart-strategy",
    title: "Essential Preventative Health Habits for Long-Term Cardiovascular Vitality",
    subtitle: "Evidence-based lifestyle interventions, early screening intervals, and lipid management protocols.",
    category: "Heart & Cardiovascular",
    featured: false,
    author: {
      name: "Dr. Sarah Jenkins",
      role: "Consultant Cardiologist",
      avatar: "https://images.unsplash.com/photo-1594824813515-7798c1995815?auto=format&fit=crop&w=400&q=80",
      bmdcReg: "BMDC-A-39104",
      bio: "Dr. Sarah Jenkins specializes in preventative cardiology, non-invasive cardiac imaging, and post-infarction rehabilitation.",
    },
    reviewer: {
      name: "Dr. Rezaul Karim",
      title: "Senior Interventional Cardiologist",
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
      reviewDate: "September 11, 2026",
    },
    publishedAt: "September 12, 2026",
    readTime: "7 min read",
    featuredImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Cardiologist analyzing non-invasive ECG waveforms and blood pressure telemetry.",
    excerpt: "Understand the subtle warning signs of cardiovascular strain and how regular lipid screenings combined with 150 minutes of weekly moderate exercise protect your heart.",
    tags: ["Cardiology", "Heart Health", "Hypertension", "Wellness"],
    keyTakeaways: [
      "Hypertension is known as the 'silent killer' because significant vascular strain develops with zero outward symptoms.",
      "Adults over 30 should monitor their fasting lipid panel (LDL, HDL, Triglycerides) annually.",
      "150 minutes of moderate aerobic activity weekly reduces cardiovascular mortality by up to 35%.",
      "Managing chronic stress and securing 7-8 hours of restorative sleep lowers nocturnal arterial pressure.",
    ],
    content: [
      {
        type: "paragraph",
        text: "Cardiovascular disease remains the leading cause of preventable mortality globally. However, up to 80% of premature heart attacks and strokes are preventable through early detection, blood pressure optimization, and sustained lifestyle adjustments.",
      },
      {
        type: "heading",
        text: "The Importance of Routine Blood Pressure Monitoring",
      },
      {
        type: "paragraph",
        text: "Many individuals assume that high blood pressure will cause headaches or dizziness. In reality, stage 1 and stage 2 hypertension can persist silently for years, gradually stiffening arterial walls and straining the left ventricle.",
      },
      {
        type: "quote",
        text: "Do not wait for chest tightness to assess your vascular health. Routine bi-monthly home blood pressure tracking provides invaluable trends for your physician.",
        author: "Dr. Sarah Jenkins, Cardiologist",
      },
      {
        type: "heading",
        text: "Actionable Pillars for Arterial Health",
      },
      {
        type: "list",
        items: [
          "Dietary Sodium Control: Restrict daily sodium intake below 2,000 mg (about 1 teaspoon of table salt).",
          "Fiber-Rich Complex Carbohydrates: Incorporate whole grains, oats, and legumes to bind intestinal cholesterol.",
          "Targeted Exercise: 30 minutes of brisk walking 5 days a week maintains endothelial flexibility.",
          "Tobacco Cessation: Complete avoidance of cigarette smoke and vaping reverses arterial constriction within weeks.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is an ideal target blood pressure reading?",
        answer: "According to international clinical cardiology guidelines, standard resting blood pressure should ideally measure below 120/80 mmHg in healthy adults.",
      },
    ],
  },
  {
    id: "blog-3",
    slug: "financial-audit-planning-family-treatment",
    title: "Managing Family Healthcare: Telehealth Benefits & Pediatric Access",
    subtitle: "How digital triage, rapid prescription renewals, and regular pediatric checkups simplify family wellness.",
    category: "Family & Pediatrics",
    featured: false,
    author: {
      name: "Dr. Tanvir Ahmed",
      role: "Pediatric & Family Medicine Consultant",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
      bmdcReg: "BMDC-A-51203",
      bio: "Dr. Tanvir is dedicated to compassionate child healthcare, immunization tracking, and comprehensive pediatric growth monitoring.",
    },
    reviewer: {
      name: "Dr. Farhana Rahman",
      title: "Internal Medicine Specialist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      reviewDate: "September 07, 2026",
    },
    publishedAt: "September 08, 2026",
    readTime: "6 min read",
    featuredImage: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Family physician conducting a pediatric developmental review via telehealth.",
    excerpt: "From midnight fever questions to routine immunization schedules, explore how continuous access to family physicians provides peace of mind and reduces unnecessary ER visits.",
    tags: ["Pediatrics", "Family Health", "Child Care", "Prescriptions"],
    keyTakeaways: [
      "Virtual pediatric triage quickly distinguishes between mild seasonal viruses and red-flag symptoms requiring emergency care.",
      "Centralized electronic health records ensure all family members' immunization histories are always accessible.",
      "Regular online follow-ups streamline chronic asthma, eczema, and allergy management without disrupting school schedules.",
    ],
    content: [
      {
        type: "paragraph",
        text: "Caring for a household often feels like managing a mini healthcare system: organizing child vaccination dates, elderly parents' blood sugar records, and seasonal infections. Telehealth bridges the gap by placing trusted doctors one tap away.",
      },
      {
        type: "heading",
        text: "Triage: When to Consult Online vs. Head to the ER",
      },
      {
        type: "paragraph",
        text: "Online consultations are ideal for mild fevers, rashes, coughs, ear discomfort, digestive upset, and behavioral queries. For sudden breathing difficulty, persistent lethargy, or severe dehydration, immediate in-person emergency care is mandatory.",
      },
    ],
  },
  {
    id: "blog-4",
    slug: "mental-health-workplace-stress-burnout",
    title: "Recognizing Workplace Burnout & Practical Steps for Mental Resilience",
    subtitle: "Clinical insights into cognitive fatigue, emotional exhaustion, and evidence-backed recovery habits.",
    category: "Mental Wellness",
    featured: false,
    author: {
      name: "Dr. Samira Chowdhury",
      role: "Consultant Psychiatrist & Behavioral Therapist",
      avatar: "https://images.unsplash.com/photo-1594824813515-7798c1995815?auto=format&fit=crop&w=400&q=80",
      bmdcReg: "BMDC-A-42109",
      bio: "Dr. Samira specializes in cognitive behavioral therapy, anxiety disorders, and occupational stress management.",
    },
    reviewer: {
      name: "Prof. Dr. Tariqul Islam",
      title: "Chief Medical Officer",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
      reviewDate: "September 02, 2026",
    },
    publishedAt: "September 03, 2026",
    readTime: "6 min read",
    featuredImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Mindfulness and intentional pauses help regulate nervous system overload.",
    excerpt: "Learn how continuous cognitive overdrive impacts executive function, sleep architecture, and gut health, plus 4 clinical strategies to restore psychological balance.",
    tags: ["Mental Health", "Burnout", "Stress Relief", "Mindfulness"],
    keyTakeaways: [
      "Burnout is an occupational syndrome characterized by energy depletion, mental distancing from tasks, and reduced efficacy.",
      "Unmanaged chronic stress elevates cortisol, altering sleep cycles and immune regulation.",
      "Micro-breaks of 5 minutes every 90 minutes prevent cognitive saturation and decision fatigue.",
      "Confidential tele-counseling provides a safe space for psychological decompression.",
    ],
    content: [
      {
        type: "paragraph",
        text: "In hyper-connected work cultures, the boundaries between professional demands and personal restorative time have dissolved. Chronic high-stakes output without emotional recovery leads inexorably to clinical burnout.",
      },
      {
        type: "heading",
        text: "The Neurological Impact of Unchecked Stress",
      },
      {
        type: "paragraph",
        text: "Sustained cortisol elevation suppresses the prefrontal cortex—the brain region responsible for working memory and emotional regulation—while hyper-sensitizing the amygdala.",
      },
    ],
  },
  {
    id: "blog-5",
    slug: "managing-type-2-diabetes-nutritional-guide",
    title: "Type 2 Diabetes Management: Nutrition, Glycemic Index & Daily Habits",
    subtitle: "A practical guide to meal balancing, HbA1c targets, and preventing long-term microvascular complications.",
    category: "Nutrition & Lifestyle",
    featured: false,
    author: {
      name: "Dr. Farhana Rahman",
      role: "Internal Medicine Specialist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      bmdcReg: "BMDC-A-48921",
      bio: "Dr. Farhana manages complex metabolic and endocrine disorders with personalized nutrition-first protocols.",
    },
    reviewer: {
      name: "Dr. Rezaul Karim",
      title: "Senior Interventional Cardiologist",
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
      reviewDate: "August 28, 2026",
    },
    publishedAt: "August 30, 2026",
    readTime: "8 min read",
    featuredImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Fresh nutrient-dense balanced whole foods are fundamental for glycemic regulation.",
    excerpt: "Understand how pairing fiber with lean proteins prevents post-prandial blood glucose spikes and why routine HbA1c tests remain the gold standard in metabolic health.",
    tags: ["Diabetes", "Nutrition", "Metabolic Health", "HbA1c"],
    keyTakeaways: [
      "HbA1c tests reflect average blood glucose over a 90-day cycle; the recommended target is generally below 6.5% - 7.0%.",
      "Pairing carbohydrates with dietary protein or healthy fats substantially lowers the post-meal glycemic curve.",
      "Post-meal 10-minute walks accelerate muscular glucose uptake without requiring additional insulin.",
    ],
    content: [
      {
        type: "paragraph",
        text: "Effective type 2 diabetes management is not about extreme deprivation; it centers around predictable meal timing, macronutrient balance, and consistent physical movement.",
      },
      {
        type: "heading",
        text: "The Plate Method for Glucose Stability",
      },
      {
        type: "paragraph",
        text: "Fill half your plate with non-starchy vegetables (spinach, broccoli, cucumbers), one quarter with lean protein (fish, skinless poultry, eggs, tofu), and the remaining quarter with complex whole grains.",
      },
    ],
  },
  {
    id: "blog-6",
    slug: "preventative-screenings-age-by-age-checklist",
    title: "The Essential Preventative Health Screening Checklist by Age Group",
    subtitle: "From your 20s to your 60s: recommended blood panels, cancer screenings, and bone density tests.",
    category: "Preventative Health",
    featured: false,
    author: {
      name: "Prof. Dr. Tariqul Islam",
      role: "Chief Medical Officer, MBBS, FCPS",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
      bmdcReg: "BMDC-A-21045",
      bio: "Prof. Islam has over 22 years of clinical leadership guiding clinical governance and national healthcare initiatives.",
    },
    reviewer: {
      name: "Dr. Sarah Jenkins",
      title: "Consultant Cardiologist",
      avatar: "https://images.unsplash.com/photo-1594824813515-7798c1995815?auto=format&fit=crop&w=400&q=80",
      reviewDate: "August 20, 2026",
    },
    publishedAt: "August 22, 2026",
    readTime: "7 min read",
    featuredImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Preventative lab diagnostics provide early baseline indicators for systemic health.",
    excerpt: "Catching chronic illnesses before symptoms appear saves lives and drastically reduces healthcare expenses. Here is your definitive decade-by-decade screening blueprint.",
    tags: ["Screenings", "Preventative Care", "Checkups", "Longevity"],
    keyTakeaways: [
      "In your 20s & 30s: Complete Blood Count (CBC), Fasting Lipid Profile, Fasting Blood Sugar, and STI panels.",
      "In your 40s: Add baseline ECG, Liver & Renal Function tests, and Mammography/Pap smears for women.",
      "In your 50s & beyond: Add Colonoscopy screening, Bone Mineral Density (DEXA), and Prostate-specific antigen (PSA) for men.",
    ],
    content: [
      {
        type: "paragraph",
        text: "The greatest triumph of modern medicine is not merely curing advanced disease—it is intercepting cellular and metabolic dysfunctions years before they cause irreversible organ damage.",
      },
      {
        type: "heading",
        text: "Your 20s and 30s: Establishing Vital Baselines",
      },
      {
        type: "paragraph",
        text: "Even when feeling completely healthy, establishing baseline metrics for your lipid panel, kidney filtration (eGFR), and fasting glucose allows your doctor to detect subtle 5-year trends.",
      },
    ],
  },
];
