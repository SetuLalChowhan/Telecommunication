export interface DashboardAppointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  doctorHospital?: string;
  doctorDegrees?: string[];
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientAvatar?: string;
  dateFormatted: string;
  timeFormatted: string;
  consultationType: "Video Consultation" | "In-Person Consultation" | "Audio Consultation";
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
  meetLink?: string;
  symptoms?: string;
  fee: number;
  notes?: string;
  isToday?: boolean;
}

export interface RecommendedDoctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviewsCount: number;
  fee: number;
  avatar: string;
  availabilityToday: boolean;
}

export interface PatientMedicalRecord {
  id: string;
  title: string;
  fileType: string;
  fileSize: string;
  uploadedDate: string;
  doctorName: string;
}

export interface DoctorScheduleItem {
  id: string;
  time: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientAvatar: string;
  consultationType: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
  symptoms: string;
  meetLink?: string;
  fee: number;
}

export interface DoctorPatientSummary {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  bloodGroup: string;
  lastVisit: string;
  condition: string;
  totalConsultations: number;
  avatar: string;
}

export interface DoctorWeeklySlot {
  id: string;
  day: string;
  timeRange: string;
  isActive: boolean;
  durationMinutes: number;
}

// ---------------------------------------------------------------------------
// Patient Mock Data
// ---------------------------------------------------------------------------

export const PATIENT_UPCOMING_APPOINTMENT: DashboardAppointment = {
  id: "appt-p-01",
  doctorName: "Dr. Sarah Ahmed",
  doctorSpecialty: "Cardiologist",
  doctorAvatar: "https://images.unsplash.com/photo-1594824813515-7798c1995815?auto=format&fit=crop&w=400&q=80",
  doctorHospital: "National Heart Foundation & Research Hospital",
  doctorDegrees: ["MBBS", "FCPS (Cardiology)", "MRCP (UK)"],
  patientName: "Setulal Chowhan",
  dateFormatted: "Today",
  timeFormatted: "4:30 PM",
  consultationType: "Video Consultation",
  status: "CONFIRMED",
  meetLink: "https://meet.google.com/tele-sarah-med",
  symptoms: "Follow-up review for blood pressure monitoring & ECG",
  fee: 1200,
  notes: "Please have your latest blood pressure log available before joining the call.",
  isToday: true,
};

export const PATIENT_RECENT_APPOINTMENTS: DashboardAppointment[] = [
  PATIENT_UPCOMING_APPOINTMENT,
  {
    id: "appt-p-02",
    doctorName: "Dr. Farhana Rahman",
    doctorSpecialty: "Internal Medicine",
    doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    doctorHospital: "Dhaka Medical College Hospital",
    doctorDegrees: ["MBBS", "FCPS (Medicine)"],
    patientName: "Setulal Chowhan",
    dateFormatted: "Sep 21, 2026",
    timeFormatted: "11:00 AM",
    consultationType: "Video Consultation",
    status: "PENDING",
    symptoms: "Seasonal allergy and chronic cough checkup",
    fee: 800,
    notes: "Awaiting confirmation from clinic assistant.",
    isToday: false,
  },
  {
    id: "appt-p-03",
    doctorName: "Prof. Dr. Tariqul Islam",
    doctorSpecialty: "General Medicine",
    doctorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    doctorHospital: "Square Hospital Dhaka",
    doctorDegrees: ["MBBS", "FRCP (Glasg)", "FACP (USA)"],
    patientName: "Setulal Chowhan",
    dateFormatted: "Sep 02, 2026",
    timeFormatted: "6:00 PM",
    consultationType: "Video Consultation",
    status: "COMPLETED",
    meetLink: "https://meet.google.com/med-triage-call",
    symptoms: "Digestive discomfort & acid reflux consultation",
    fee: 1500,
    notes: "Prescription and dietary advice provided.",
    isToday: false,
  },
];

export const RECOMMENDED_DOCTORS: RecommendedDoctor[] = [
  {
    id: "rec-1",
    name: "Dr. Farhana Rahman",
    specialty: "Internal Medicine",
    hospital: "Dhaka Medical College Hospital",
    rating: 4.9,
    reviewsCount: 128,
    fee: 800,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    availabilityToday: true,
  },
  {
    id: "rec-2",
    name: "Prof. Dr. Tariqul Islam",
    specialty: "General Medicine",
    hospital: "Square Hospital Dhaka",
    rating: 4.8,
    reviewsCount: 94,
    fee: 1500,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    availabilityToday: false,
  },
  {
    id: "rec-3",
    name: "Dr. Mahbubur Rahman",
    specialty: "Neurology",
    hospital: "National Institute of Neurosciences",
    rating: 4.9,
    reviewsCount: 76,
    fee: 1000,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    availabilityToday: true,
  },
];

export const PATIENT_MEDICAL_REPORTS: PatientMedicalRecord[] = [
  {
    id: "rep-1",
    title: "Complete Blood Count (CBC)",
    fileType: "PDF",
    fileSize: "1.4 MB",
    uploadedDate: "Sep 15, 2026",
    doctorName: "Dr. Farhana Rahman",
  },
  {
    id: "rep-2",
    title: "Fasting Lipid Profile",
    fileType: "PDF",
    fileSize: "840 KB",
    uploadedDate: "Sep 10, 2026",
    doctorName: "Dr. Sarah Ahmed",
  },
  {
    id: "rep-3",
    title: "Chest X-Ray Digital Scan",
    fileType: "PDF",
    fileSize: "3.2 MB",
    uploadedDate: "Sep 01, 2026",
    doctorName: "Prof. Dr. Tariqul Islam",
  },
];

// ---------------------------------------------------------------------------
// Doctor Mock Data
// ---------------------------------------------------------------------------

export const DOCTOR_OVERVIEW_METRICS = {
  todayAppointmentsCount: 8,
  upcomingCount: 12,
  completedThisWeekCount: 24,
  totalPatientsCount: 156,
};

export const DOCTOR_TODAY_SCHEDULE: DoctorScheduleItem[] = [
  {
    id: "sch-1",
    time: "09:30 AM",
    patientName: "John Smith",
    patientAge: 42,
    patientGender: "Male",
    patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    consultationType: "General Consultation",
    status: "CONFIRMED",
    symptoms: "Mild hypertension evaluation & lipid profile review",
    meetLink: "https://meet.google.com/doc-sarah-cardio",
    fee: 1200,
  },
  {
    id: "sch-2",
    time: "11:00 AM",
    patientName: "Maria Khan",
    patientAge: 36,
    patientGender: "Female",
    patientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    consultationType: "Follow-up Consultation",
    status: "CONFIRMED",
    symptoms: "Palpitation & post-exercise fatigue follow-up",
    meetLink: "https://meet.google.com/doc-sarah-cardio",
    fee: 1200,
  },
  {
    id: "sch-3",
    time: "02:30 PM",
    patientName: "Rahim Ahmed",
    patientAge: 55,
    patientGender: "Male",
    patientAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    consultationType: "Video Consultation",
    status: "PENDING",
    symptoms: "Chest tightness during morning walks",
    fee: 1200,
  },
  {
    id: "sch-4",
    time: "04:30 PM",
    patientName: "Setulal Chowhan",
    patientAge: 30,
    patientGender: "Male",
    patientAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    consultationType: "Video Consultation",
    status: "CONFIRMED",
    symptoms: "Blood pressure monitoring & medication check",
    meetLink: "https://meet.google.com/tele-sarah-med",
    fee: 1200,
  },
];

export const DOCTOR_RECENT_PATIENTS: DoctorPatientSummary[] = [
  {
    id: "dp-1",
    name: "John Smith",
    age: 42,
    gender: "Male",
    phone: "+880 1711-234567",
    bloodGroup: "O+",
    lastVisit: "Sep 14, 2026",
    condition: "Essential Hypertension (Stage 1)",
    totalConsultations: 3,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "dp-2",
    name: "Maria Khan",
    age: 36,
    gender: "Female",
    phone: "+880 1819-876543",
    bloodGroup: "A+",
    lastVisit: "Sep 12, 2026",
    condition: "Sinus Tachycardia & Fatigue",
    totalConsultations: 2,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "dp-3",
    name: "Rahim Ahmed",
    age: 55,
    gender: "Male",
    phone: "+880 1912-334455",
    bloodGroup: "B+",
    lastVisit: "Sep 08, 2026",
    condition: "Stable Angina Evaluation",
    totalConsultations: 4,
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "dp-4",
    name: "Setulal Chowhan",
    age: 30,
    gender: "Male",
    phone: "+880 1622-445566",
    bloodGroup: "O+",
    lastVisit: "Today",
    condition: "Routine Cardiovascular Screening",
    totalConsultations: 1,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  },
];

export const DOCTOR_WEEKLY_AVAILABILITY: DoctorWeeklySlot[] = [
  {
    id: "avail-1",
    day: "Monday",
    timeRange: "09:00 AM — 05:00 PM",
    isActive: true,
    durationMinutes: 30,
  },
  {
    id: "avail-2",
    day: "Tuesday",
    timeRange: "09:00 AM — 05:00 PM",
    isActive: true,
    durationMinutes: 30,
  },
  {
    id: "avail-3",
    day: "Wednesday",
    timeRange: "09:00 AM — 01:00 PM",
    isActive: true,
    durationMinutes: 30,
  },
  {
    id: "avail-4",
    day: "Thursday",
    timeRange: "Unavailable",
    isActive: false,
    durationMinutes: 30,
  },
  {
    id: "avail-5",
    day: "Friday",
    timeRange: "04:00 PM — 08:00 PM",
    isActive: true,
    durationMinutes: 30,
  },
  {
    id: "avail-6",
    day: "Saturday",
    timeRange: "10:00 AM — 02:00 PM",
    isActive: true,
    durationMinutes: 30,
  },
];
