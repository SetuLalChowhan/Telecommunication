"use client";

import React, { useState, useSyncExternalStore } from "react";
import { DoctorProfile, DoctorAvailability } from "@/types/doctor";
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

  const [selectedDate, setSelectedDate] = useState<Date>(
    () => days[0]?.date ?? new Date()
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedSlotItem, setSelectedSlotItem] = useState<AvailableSlotItem | null>(null);
  const [notes, setNotes] = useState("");
  const [bookedDetails, setBookedDetails] = useState<RawBooking | null>(null);

  const selectedDateStr = toDateInputValue(selectedDate);

  const { data: slotsData, isLoading: isSlotsLoading } = useAvailableSlots(
    doctor.id,
    selectedDateStr
  );
  // The API returns the whole day (available + unavailable), so every slot is
  // rendered and the unavailable ones are disabled rather than hidden.
  const slots: AvailableSlotItem[] = slotsData?.slots || [];

  const bookingMutation = useCreateAppointmentBooking();

  const handleBookingSubmit = async () => {
    if (!selectedSlotItem) {
      toast.error("Please select an available consultation slot");
      return;
    }

    try {
      const booking = await bookingMutation.mutateAsync({
        doctorId: doctor.id,
        slotStart: selectedSlotItem.slotStart,
        slotEnd: selectedSlotItem.slotEnd,
        notes: notes.trim() || undefined,
      });

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

      <BookingDateStrip
        days={days}
        selectedDate={selectedDate}
        onSelectDate={(d) => {
          setSelectedDate(d);
          setSelectedSlotItem(null);
        }}
        isCalendarOpen={isCalendarOpen}
        onCalendarOpenChange={setIsCalendarOpen}
      />

      <BookingSlotGrid
        slots={slots}
        selectedSlot={selectedSlotItem}
        onSelectSlot={setSelectedSlotItem}
        isLoading={isSlotsLoading}
        dayOffReason={slotsData?.isDayOff ? slotsData.reason : undefined}
        unavailableMessage={slotsData?.message}
      />

      <BookingFeeSummary
        fee={doctor.fee}
        notes={notes}
        onNotesChange={setNotes}
        selectedSlot={selectedSlotItem}
        isAuthenticated={isAuthenticated}
        isPatient={isPatient}
        isSubmitting={bookingMutation.isPending}
        isMounted={mounted}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
};

export default DoctorBookingSidebar;
