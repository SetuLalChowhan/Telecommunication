import React from "react";

// ==========================================
// Step 1 SVG: Find a Doctor (Search & Specialist Profile)
// ==========================================
export const FindDoctorSvg: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50/90 via-primary/5 to-slate-100/50 dark:from-slate-900/90 dark:via-primary/10 dark:to-slate-900/50 p-2 sm:p-2.5 overflow-hidden">
    {/* Subtle Glow Behind SVG */}
    <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full blur-lg pointer-events-none" />

    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-h-[135px] select-none"
    >
      <defs>
        <linearGradient id="s1-avatar-grad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="s1-glass" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
        <filter id="s1-drop" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Background Doctor Card */}
      <g filter="url(#s1-drop)">
        <rect
          x="24"
          y="24"
          width="152"
          height="112"
          rx="14"
          className="fill-card stroke-border/80"
          strokeWidth="1.5"
        />
      </g>

      {/* Doctor Avatar Circle */}
      <circle cx="62" cy="62" r="20" className="fill-primary/10 stroke-primary/30" strokeWidth="1.5" />
      <circle cx="62" cy="55" r="8" fill="url(#s1-avatar-grad)" />
      <path
        d="M48 74 C48 66, 54 63, 62 63 C70 63, 76 66, 76 74 Z"
        fill="url(#s1-avatar-grad)"
      />
      {/* Stethoscope */}
      <path
        d="M58 65 Q62 71 66 65"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Verified Green Badge */}
      <circle cx="76" cy="73" r="5" className="fill-emerald-500 stroke-card" strokeWidth="1.5" />
      <path d="M74 73 L75.5 74.5 L78 71.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Doctor Info Placeholders */}
      <rect x="92" y="49" width="68" height="8" rx="4" className="fill-foreground" opacity="0.85" />
      <rect x="92" y="63" width="52" height="6" rx="3" className="fill-primary/25" />
      <rect x="94" y="65" width="34" height="2.5" rx="1.2" className="fill-primary" />

      {/* Rating stars line */}
      <g transform="translate(92, 75)">
        <polygon points="3.5,0.5 4.5,2.5 7,2.8 5.2,4.4 5.7,7 3.5,5.7 1.3,7 1.8,4.4 0,2.8 2.5,2.5" fill="#F59E0B" />
        <text x="10" y="6" fontSize="7.5" fontWeight="bold" className="fill-foreground font-sans">4.9</text>
        <text x="24" y="6" fontSize="6.5" className="fill-muted-foreground font-sans">(1.2k+)</text>
      </g>

      {/* Available Specialist Tag */}
      <rect x="36" y="96" width="128" height="22" rx="7" className="fill-primary/10 dark:fill-primary/20 stroke-primary/30" strokeWidth="1" />
      <circle cx="48" cy="107" r="3" className="fill-emerald-500" />
      <text x="56" y="110.5" fontSize="8" fontWeight="600" className="fill-primary font-sans">Verified Doctors Online</text>

      {/* Floating Modern Magnifying Search Glass */}
      <g transform="translate(136, 12)">
        <circle cx="20" cy="20" r="18" fill="url(#s1-glass)" />
        <circle cx="17.5" cy="17.5" r="7.5" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
        <line x1="23" y1="23" x2="29" y2="29" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  </div>
);

// ==========================================
// Step 2 SVG: Book Schedule (Calendar Grid & Time Slots)
// ==========================================
export const BookScheduleSvg: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50/90 via-secondary/5 to-slate-100/50 dark:from-slate-900/90 dark:via-secondary/10 dark:to-slate-900/50 p-2 sm:p-2.5 overflow-hidden">
    {/* Subtle Glow Behind SVG */}
    <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full blur-lg pointer-events-none" />

    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-h-[135px] select-none"
    >
      <defs>
        <linearGradient id="s2-header-grad" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#0F766E" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
        <filter id="s2-drop" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Main Calendar Card */}
      <g filter="url(#s2-drop)">
        <rect
          x="24"
          y="20"
          width="152"
          height="120"
          rx="14"
          className="fill-card stroke-border/80"
          strokeWidth="1.5"
        />
      </g>

      {/* Calendar Header */}
      <rect x="24" y="20" width="152" height="28" rx="14" fill="url(#s2-header-grad)" />
      <rect x="24" y="34" width="152" height="14" fill="url(#s2-header-grad)" />
      <text x="40" y="37.5" fontSize="8.5" fontWeight="bold" fill="#FFFFFF" className="font-sans">Pick Date & Time</text>
      <circle cx="156" cy="34" r="3" fill="#FFFFFF" fillOpacity="0.3" />
      <circle cx="164" cy="34" r="3" fill="#FFFFFF" fillOpacity="0.3" />

      {/* Week Days Row */}
      {/* Day 1 */}
      <g transform="translate(34, 54)">
        <rect width="20" height="22" rx="5" className="fill-muted/70" />
        <text x="10" y="9" fontSize="6" textAnchor="middle" className="fill-muted-foreground font-sans">M</text>
        <text x="10" y="18" fontSize="7.5" fontWeight="bold" textAnchor="middle" className="fill-foreground font-sans">14</text>
      </g>
      {/* Day 2 */}
      <g transform="translate(58, 54)">
        <rect width="20" height="22" rx="5" className="fill-muted/70" />
        <text x="10" y="9" fontSize="6" textAnchor="middle" className="fill-muted-foreground font-sans">T</text>
        <text x="10" y="18" fontSize="7.5" fontWeight="bold" textAnchor="middle" className="fill-foreground font-sans">15</text>
      </g>
      {/* Day 3 (Selected Day) */}
      <g transform="translate(82, 52)">
        <rect width="22" height="25" rx="6" className="fill-secondary shadow-sm" />
        <text x="11" y="10" fontSize="6.5" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" className="font-sans">W</text>
        <text x="11" y="20" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" className="font-sans">16</text>
      </g>
      {/* Day 4 */}
      <g transform="translate(108, 54)">
        <rect width="20" height="22" rx="5" className="fill-muted/70" />
        <text x="10" y="9" fontSize="6" textAnchor="middle" className="fill-muted-foreground font-sans">T</text>
        <text x="10" y="18" fontSize="7.5" fontWeight="bold" textAnchor="middle" className="fill-foreground font-sans">17</text>
      </g>
      {/* Day 5 */}
      <g transform="translate(132, 54)">
        <rect width="20" height="22" rx="5" className="fill-muted/70" />
        <text x="10" y="9" fontSize="6" textAnchor="middle" className="fill-muted-foreground font-sans">F</text>
        <text x="10" y="18" fontSize="7.5" fontWeight="bold" textAnchor="middle" className="fill-foreground font-sans">18</text>
      </g>

      {/* Time Slots Area */}
      {/* Selected Slot */}
      <g transform="translate(34, 88)">
        <rect width="60" height="20" rx="6" className="fill-secondary/15 stroke-secondary" strokeWidth="1.2" />
        <circle cx="10" cy="10" r="3" className="fill-secondary" />
        <path d="M8.5 10 L9.8 11.2 L11.8 8.8" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
        <text x="18" y="13" fontSize="7.5" fontWeight="bold" className="fill-secondary font-sans">10:00 AM</text>
      </g>

      {/* Available Slot */}
      <g transform="translate(100, 88)">
        <rect width="60" height="20" rx="6" className="fill-muted/40 stroke-border" strokeWidth="1.2" />
        <circle cx="10" cy="10" r="3" className="fill-muted stroke-muted-foreground/30" strokeWidth="1" />
        <text x="18" y="13" fontSize="7.5" fontWeight="500" className="fill-foreground font-sans">02:30 PM</text>
      </g>

      {/* Floating Confirmed Pill */}
      <g transform="translate(122, 112)" filter="url(#s2-drop)">
        <rect width="62" height="22" rx="11" className="fill-emerald-600" />
        <circle cx="10" cy="11" r="5" fill="#FFFFFF" fillOpacity="0.25" />
        <path d="M7.5 11 L9.5 13 L13 9" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="19" y="14" fontSize="7" fontWeight="bold" fill="#FFFFFF" className="font-sans">Booked</text>
      </g>
    </svg>
  </div>
);

// ==========================================
// Step 3 SVG: Get Consultation (Live HD Video Call & Digital Rx)
// ==========================================
export const GetConsultationSvg: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50/90 via-primary/5 to-slate-100/50 dark:from-slate-900/90 dark:via-primary/10 dark:to-slate-900/50 p-2 sm:p-2.5 overflow-hidden">
    {/* Subtle Glow Behind SVG */}
    <div className="absolute -top-4 -right-4 w-16 h-16 bg-indigo-500/20 rounded-full blur-lg pointer-events-none" />

    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-h-[135px] select-none"
    >
      <defs>
        <linearGradient id="s3-screen" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="s3-pulse" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
        <filter id="s3-drop" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Main Video Call Screen Card */}
      <g filter="url(#s3-drop)">
        <rect
          x="22"
          y="18"
          width="156"
          height="124"
          rx="14"
          fill="url(#s3-screen)"
          className="stroke-border/70"
          strokeWidth="1.5"
        />
      </g>

      {/* Video Call Header Bar */}
      <circle cx="36" cy="32" r="3" fill="#EF4444" className="animate-pulse" />
      <text x="43" y="34.5" fontSize="7" fontWeight="bold" fill="#F8FAFC" className="font-sans">LIVE CONSULT</text>

      {/* HD Badge */}
      <rect x="134" y="26" width="34" height="12" rx="6" fill="#334155" />
      <text x="142" y="34.5" fontSize="6" fontWeight="bold" fill="#38BDF8" className="font-sans">1080p</text>

      {/* Central Doctor Avatar on Screen */}
      <g transform="translate(100, 68)">
        <circle cx="0" cy="0" r="24" stroke="#38BDF8" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="0" cy="0" r="18" className="fill-slate-800 stroke-primary/40" strokeWidth="1.5" />
        <circle cx="0" cy="-5" r="6.5" fill="#38BDF8" />
        <path d="M-10 12 C-10 4, -6 1.5, 0 1.5 C6 1.5, 10 4, 10 12 Z" fill="#38BDF8" />
        {/* Stethoscope */}
        <path d="M-3 3 Q0 7 3 3" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" fill="none" />
      </g>

      {/* Heartbeat / Audio Wave */}
      <path
        d="M34 88 L52 88 L57 80 L62 96 L67 84 L72 90 L77 88 L85 88"
        stroke="url(#s3-pulse)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Patient PIP (Picture in Picture) */}
      <g transform="translate(136, 72)">
        <rect width="32" height="26" rx="6" className="fill-slate-800 stroke-slate-600" strokeWidth="1" />
        <circle cx="16" cy="10" r="4.5" fill="#94A3B8" />
        <path d="M8 21 C8 16, 11 15, 16 15 C21 15, 24 16, 24 21 Z" fill="#94A3B8" />
      </g>

      {/* Screen Control Icons */}
      <g transform="translate(68, 112)">
        <rect width="64" height="20" rx="10" fill="#0B1120" />
        {/* Mic */}
        <circle cx="14" cy="10" r="5" fill="#334155" />
        <path d="M14 8 V11 M12 9.5 C12 11 16 11 16 9.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
        {/* Video */}
        <circle cx="32" cy="10" r="5" fill="#334155" />
        <rect x="29.5" y="8" width="5" height="4" rx="1" fill="#FFFFFF" />
        {/* End */}
        <circle cx="50" cy="10" r="5" fill="#EF4444" />
        <path d="M47.5 10 C49 8.8 51 8.8 52.5 10" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Floating Rx Digital Prescription Badge */}
      <g transform="translate(14, 88)" filter="url(#s3-drop)">
        <rect width="44" height="38" rx="9" className="fill-card stroke-primary/30" strokeWidth="1" />
        <rect x="6" y="6" width="14" height="6" rx="3" className="fill-primary" />
        <text x="9.5" y="10.5" fontSize="4.5" fontWeight="bold" fill="#FFFFFF" className="font-sans">Rx</text>
        <line x1="6" y1="17" x2="36" y2="17" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="6" y1="22" x2="28" y2="22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="34" cy="28" r="4" className="fill-emerald-500" />
        <path d="M32.5 28 L33.8 29.3 L36 27" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  </div>
);
