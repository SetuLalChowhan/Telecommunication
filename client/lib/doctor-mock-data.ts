export interface DoctorProfileData {
  name: string;
  avatar: string;
  specialization: string;
  bio: string;
  experienceYears: number;
  consultationFee: number;
  bmdcNumber: string;
  designation?: string;
  hospitalAffiliation: string;
  clinicAddress?: string;
  degrees: string[];
  languages: string[];
  isVerified: boolean;
}

export interface DoctorAppointment {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientAvatar: string;
  symptoms: string;
  slotStart: string;
  slotEnd: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
  meetLink?: string;
  consultationFee: number;
  notes?: string;
}

export interface DoctorPatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  bloodGroup: string;
  totalVisits: number;
  lastVisitDate: string;
  lastCondition: string;
  avatar: string;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  consultationDuration: number;
  isActive: boolean;
}

export interface DayOffRecord {
  id: string;
  date: string;
  reason: string;
}

export const MOCK_DOCTOR_PROFILE: DoctorProfileData = {
  name: "Dr. Sarah Jenkins",
  avatar: "https://images.unsplash.com/photo-1594824813515-7798c1995815?auto=format&fit=crop&w=400&q=80",
  specialization: "Cardiologist",
  bio: "Senior Consultant Cardiologist specializing in preventive cardiology, hypertension, arrhythmia management, and digital tele-triage.",
  experienceYears: 12,
  consultationFee: 1200,
  bmdcNumber: "BMDC-A-48921",
  designation: "Senior Consultant - Cardiology",
  hospitalAffiliation: "National Heart Foundation & Research Hospital",
  clinicAddress: "Plot 4, Road 2, Section 2, Mirpur, Dhaka 1216",
  degrees: ["MBBS (Dhaka)", "FCPS (Cardiology)", "MRCP (UK)"],
  languages: ["English", "Bengali"],
  isVerified: true,
};

export const MOCK_DOCTOR_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: "appt-101",
    patientName: "Tanvir Hossain",
    patientAge: 38,
    patientGender: "Male",
    patientAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    symptoms: "Elevated blood pressure, mild dizziness in morning",
    slotStart: "17 Sep 2026, 10:30 AM",
    slotEnd: "17 Sep 2026, 11:00 AM",
    status: "CONFIRMED",
    meetLink: "https://meet.google.com/doc-heart-care",
    consultationFee: 1200,
    notes: "Patient reported reading 145/95 mmHg yesterday.",
  },
  {
    id: "appt-102",
    patientName: "Farzana Yasmin",
    patientAge: 45,
    patientGender: "Female",
    patientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    symptoms: "Post-exercise palpitation and fatigue",
    slotStart: "17 Sep 2026, 02:00 PM",
    slotEnd: "17 Sep 2026, 02:30 PM",
    status: "CONFIRMED",
    meetLink: "https://meet.google.com/doc-sarah-cardio",
    consultationFee: 1200,
    notes: "Needs review of recent ECG and lipid profile.",
  },
  {
    id: "appt-103",
    patientName: "Kamrul Islam",
    patientAge: 52,
    patientGender: "Male",
    patientAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    symptoms: "Chest tightness during brisk walking",
    slotStart: "18 Sep 2026, 11:30 AM",
    slotEnd: "18 Sep 2026, 12:00 PM",
    status: "PENDING",
    consultationFee: 1200,
    notes: "Awaiting patient confirmation.",
  },
  {
    id: "appt-104",
    patientName: "Nusrat Jahan",
    patientAge: 29,
    patientGender: "Female",
    patientAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    symptoms: "Routine cardiac screening & cholesterol advice",
    slotStart: "15 Sep 2026, 04:00 PM",
    slotEnd: "15 Sep 2026, 04:30 PM",
    status: "COMPLETED",
    meetLink: "https://meet.google.com/sarah-cardio-archive",
    consultationFee: 1200,
    notes: "Prescribed lifestyle modification & repeat test in 3 months.",
  },
  {
    id: "appt-105",
    patientName: "Arif Chowdhury",
    patientAge: 61,
    patientGender: "Male",
    patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    symptoms: "Medication adjustment review",
    slotStart: "12 Sep 2026, 03:00 PM",
    slotEnd: "12 Sep 2026, 03:30 PM",
    status: "COMPLETED",
    consultationFee: 1200,
    notes: "Dosage calibrated for beta-blockers.",
  },
];

export const MOCK_DOCTOR_PATIENTS: DoctorPatientRecord[] = [
  {
    id: "pat-1",
    name: "Tanvir Hossain",
    age: 38,
    gender: "Male",
    phone: "+880 1712-345678",
    bloodGroup: "O+",
    totalVisits: 3,
    lastVisitDate: "17 Sep 2026",
    lastCondition: "Primary Hypertension (Grade 1)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "pat-2",
    name: "Farzana Yasmin",
    age: 45,
    gender: "Female",
    phone: "+880 1819-876543",
    bloodGroup: "A+",
    totalVisits: 2,
    lastVisitDate: "17 Sep 2026",
    lastCondition: "Sinus Tachycardia & Fatigue",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "pat-3",
    name: "Kamrul Islam",
    age: 52,
    gender: "Male",
    phone: "+880 1911-223344",
    bloodGroup: "B+",
    totalVisits: 1,
    lastVisitDate: "18 Sep 2026",
    lastCondition: "Stable Angina Evaluation",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "pat-4",
    name: "Nusrat Jahan",
    age: 29,
    gender: "Female",
    phone: "+880 1622-998877",
    bloodGroup: "AB+",
    totalVisits: 4,
    lastVisitDate: "15 Sep 2026",
    lastCondition: "Hypercholesterolemia Management",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "pat-5",
    name: "Arif Chowdhury",
    age: 61,
    gender: "Male",
    phone: "+880 1515-443322",
    bloodGroup: "O-",
    totalVisits: 5,
    lastVisitDate: "12 Sep 2026",
    lastCondition: "Post-Angioplasty Monitoring",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
];

export const MOCK_AVAILABILITY_SLOTS: AvailabilitySlot[] = [
  {
    id: "slot-1",
    dayOfWeek: "MONDAY",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    consultationDuration: 30,
    isActive: true,
  },
  {
    id: "slot-2",
    dayOfWeek: "TUESDAY",
    startTime: "02:00 PM",
    endTime: "06:00 PM",
    consultationDuration: 30,
    isActive: true,
  },
  {
    id: "slot-3",
    dayOfWeek: "WEDNESDAY",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    consultationDuration: 30,
    isActive: true,
  },
  {
    id: "slot-4",
    dayOfWeek: "THURSDAY",
    startTime: "02:00 PM",
    endTime: "06:00 PM",
    consultationDuration: 30,
    isActive: false,
  },
  {
    id: "slot-5",
    dayOfWeek: "FRIDAY",
    startTime: "04:00 PM",
    endTime: "08:00 PM",
    consultationDuration: 30,
    isActive: true,
  },
  {
    id: "slot-6",
    dayOfWeek: "SATURDAY",
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    consultationDuration: 30,
    isActive: true,
  },
];

export const MOCK_DAYS_OFF: DayOffRecord[] = [
  {
    id: "dayoff-1",
    date: "25 Sep 2026",
    reason: "National Cardiology Conference, Dhaka",
  },
  {
    id: "dayoff-2",
    date: "04 Oct 2026",
    reason: "Annual Hospital Training Seminar",
  },
];
