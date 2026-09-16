export interface MockBooking {
  id: string;
  doctor: {
    name: string;
    specialty: string;
    avatar: string;
    fee: number;
  };
  slotStart: string;
  slotEnd: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  meetLink?: string;
  notes?: string;
}

export interface MockMedicalReport {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  doctorName?: string;
}

export const MOCK_BOOKINGS: MockBooking[] = [
  {
    id: "book-1",
    doctor: {
      name: "Dr. Farhana Rahman",
      specialty: "Internal Medicine",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      fee: 800,
    },
    slotStart: "16 Sep 2026, 04:30 PM",
    slotEnd: "16 Sep 2026, 05:00 PM",
    status: "CONFIRMED",
    meetLink: "https://meet.google.com/abc-telehealth-med",
    notes: "Follow up review for seasonal cough",
  },
  {
    id: "book-2",
    doctor: {
      name: "Dr. Sarah Jenkins",
      specialty: "Cardiology",
      avatar: "https://images.unsplash.com/photo-1594824813515-7798c1995815?auto=format&fit=crop&w=400&q=80",
      fee: 1200,
    },
    slotStart: "20 Sep 2026, 11:00 AM",
    slotEnd: "20 Sep 2026, 11:30 AM",
    status: "PENDING",
    notes: "Routine blood pressure consultation",
  },
  {
    id: "book-3",
    doctor: {
      name: "Prof. Dr. Tariqul Islam",
      specialty: "General Medicine",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
      fee: 1500,
    },
    slotStart: "02 Sep 2026, 06:00 PM",
    slotEnd: "02 Sep 2026, 06:30 PM",
    status: "COMPLETED",
    meetLink: "https://meet.google.com/med-triage-call",
    notes: "Acidity and reflux symptoms",
  },
];

export const MOCK_MEDICAL_REPORTS: MockMedicalReport[] = [
  {
    id: "rep-1",
    fileName: "Complete_Blood_Count_CBC.pdf",
    fileUrl: "#",
    uploadedAt: "15 Sep 2026",
    doctorName: "Dr. Farhana Rahman",
  },
  {
    id: "rep-2",
    fileName: "Fasting_Lipid_Profile.pdf",
    fileUrl: "#",
    uploadedAt: "10 Sep 2026",
    doctorName: "Dr. Sarah Jenkins",
  },
  {
    id: "rep-3",
    fileName: "Chest_XRay_Digital_Scan.pdf",
    fileUrl: "#",
    uploadedAt: "01 Sep 2026",
    doctorName: "Prof. Dr. Tariqul Islam",
  },
];
