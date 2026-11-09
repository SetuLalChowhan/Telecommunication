"use client";

import React, { useState, useMemo, useCallback, useSyncExternalStore } from "react";
import { DoctorProfile, DoctorAvailability } from "@/features/doctors/types";
import { toDateInputValue } from "@/lib/time";
import { useAuth } from "@/features/auth/api/queries";
import {
  useAvailableSlots,
  useCreateAppointmentBooking,
  AvailableSlotItem,
  RawBooking,
} from "@/features/patients";
import { toast } from "react-toastify";
import {
  BookingDateStrip,
  DayItem,
} from "@/features/appointments/components/booking/BookingDateStrip";
import { BookingSlotGrid } from "@/features/appointments/components/booking/BookingSlotGrid";
import { BookingFeeSummary } from "@/features/appointments/components/booking/BookingFeeSummary";
import { BookingSuccessCard } from "@/features/appointments/components/booking/BookingSuccessCard";
import { BookingPaymentModal } from "@/features/appointments/components/booking/BookingPaymentModal";
import { CalendarOff, EyeOff } from "lucide-react";

interface DoctorBookingSidebarProps {
  doctor: DoctorProfile;
  availabilities?: DoctorAvailability[];
  isLoading?: boolean;
  /**
   * Bookable-day strip, built on the server by `buildBookingDateStrip()`.
   *
   * It is a prop rather than local `new Date()` state because this widget is
   * server-rendered too: deriving the strip from the clock during render made
   * the server and client markup disagree and threw a hydration mismatch.
   */
  days: DayItem[];
}

export const DoctorBookingSidebar: React.FC<DoctorBookingSidebarProps> = ({
  doctor,
  availabilities = [],
  isLoading = false,
  days,
}) => {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const { user, isAuthenticated } = useAuth();
  const isPatient = user?.role === "PATIENT";

  const DAY_NAMES = useMemo(
    () => ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
    []
  );

  const isAvailabilityVisible = doctor.isAvailabilityVisible !== false;

  const activeDaysSet = useMemo(() => {
    const list = availabilities.length > 0 ? availabilities : doctor.availabilities || [];
    return new Set(
      list.filter((a) => a.isActive).map((a) => String(a.dayOfWeek).toUpperCase())
    );
  }, [availabilities, doctor.availabilities]);

  const daysOffSet = useMemo(() => {
    return new Set(
      (doctor.daysOff || []).map((d: any) =>
        typeof d.date === "string" ? d.date.slice(0, 10) : toDateInputValue(new Date(d.date))
      )
    );
  }, [doctor.daysOff]);

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (!isAvailabilityVisible) return true;
      const dateStr = toDateInputValue(date);
      if (daysOffSet.has(dateStr)) return true;
      const dayName = DAY_NAMES[date.getDay()];
      if (activeDaysSet.size > 0 && !activeDaysSet.has(dayName)) return true;
      return false;
    },
    [isAvailabilityVisible, daysOffSet, activeDaysSet, DAY_NAMES]
  );

  // Find first available day
  const initialDate = useMemo(() => {
    if (!isAvailabilityVisible) return days[0]?.date ?? new Date();
    const firstAvailable = days.find((d) => !isDateDisabled(d.date));
    return firstAvailable?.date ?? days[0]?.date ?? new Date();
  }, [days, isAvailabilityVisible, isDateDisabled]);

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedSlotItem, setSelectedSlotItem] = useState<AvailableSlotItem | null>(null);
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bookedDetails, setBookedDetails] = useState<RawBooking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Seed the phone field from the signed-in profile the first time it loads.
  const [isPhoneSeeded, setIsPhoneSeeded] = useState(false);
  if (!isPhoneSeeded && user?.phone) {
    setIsPhoneSeeded(true);
    setPhone(user.phone);
  }

  const selectedDateStr = toDateInputValue(selectedDate);

  const { data: slotsData, isLoading: isSlotsLoading } = useAvailableSlots(
    doctor.id,
    selectedDateStr
  );
  // The API returns the whole day (available + unavailable), so every slot is
  // rendered and the unavailable ones are disabled rather than hidden.
  const slots: AvailableSlotItem[] = isAvailabilityVisible ? slotsData?.slots || [] : [];

  const bookingMutation = useCreateAppointmentBooking();

  const handleOpenPayment = () => {
    if (!isAvailabilityVisible) {
      toast.error("Doctor has paused online appointments at this time.");
      return;
    }

    if (!selectedSlotItem) {
      toast.error("Please select an available consultation slot");
      return;
    }

    if (!phone.trim() || phone.trim().length < 6) {
      toast.error("Please enter a valid contact phone number (min 6 digits)");
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedSlotItem) return;

    try {
      const booking = await bookingMutation.mutateAsync({
        doctorId: doctor.id,
        slotStart: selectedSlotItem.slotStart,
        slotEnd: selectedSlotItem.slotEnd,
        notes: notes.trim() || undefined,
        phone: phone.trim(),
        paymentMethod: "SIMULATED",
      });

      setIsPaymentModalOpen(false);
      setBookedDetails(booking as unknown as RawBooking);
    } catch {
      // Toast already handled by mutation onError in useCreateAppointmentBooking
    }
  };

  if (bookedDetails) {
    return (
      <BookingSuccessCard
        booking={bookedDetails}
        onBookAnother={() => {
          setBookedDetails(null);
          setSelectedSlotItem(null);
          setNotes("");
        }}
      />
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-card border border-border space-y-5 sticky top-24">
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Schedule consultation</h3>
          <p className="text-xs text-muted-foreground">Select date & time for video call</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">Consultation Fee</span>
          <p className="text-lg font-semibold text-foreground">BDT {doctor.fee}</p>
        </div>
      </div>

      {!isAvailabilityVisible && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-start gap-2.5">
          <EyeOff className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Online Bookings Paused
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
              This doctor has temporarily paused new online consultation bookings. Please check back later.
            </p>
          </div>
        </div>
      )}

      <BookingDateStrip
        days={days}
        selectedDate={selectedDate}
        onSelectDate={(d) => {
          setSelectedDate(d);
          setSelectedSlotItem(null);
        }}
        isCalendarOpen={isCalendarOpen}
        onCalendarOpenChange={setIsCalendarOpen}
        isDateDisabled={isDateDisabled}
      />

      <BookingSlotGrid
        slots={slots}
        selectedSlot={selectedSlotItem}
        onSelectSlot={setSelectedSlotItem}
        isLoading={isSlotsLoading}
        dayOffReason={
          !isAvailabilityVisible
            ? "Doctor availability is currently hidden"
            : slotsData?.isDayOff
            ? slotsData.reason
            : undefined
        }
        unavailableMessage={
          !isAvailabilityVisible
            ? "Online appointments are currently paused for this doctor."
            : slotsData?.message
        }
      />

      <BookingFeeSummary
        fee={doctor.fee}
        notes={notes}
        onNotesChange={setNotes}
        phone={phone}
        onPhoneChange={setPhone}
        selectedSlot={selectedSlotItem}
        isAuthenticated={isAuthenticated}
        isPatient={isPatient}
        isSubmitting={bookingMutation.isPending}
        isMounted={mounted}
        onSubmit={handleOpenPayment}
      />

      <BookingPaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        doctorName={
          doctor.user?.name ||
          `${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}`.trim() ||
          "Dr. Specialist"
        }
        specialty={
          doctor.mainSpecialty?.name ||
          doctor.specialties?.[0]?.specialty?.name
        }
        fee={doctor.fee}
        selectedDate={selectedDate}
        selectedSlot={selectedSlotItem}
        phone={phone}
        notes={notes}
        isSubmitting={bookingMutation.isPending}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
};

export default DoctorBookingSidebar;
