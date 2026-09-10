-- Ensure physical database constraint prevents duplicate active bookings for same doctor at same slotStart
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_doctor_slot 
ON "Booking" ("doctorId", "slotStart") 
WHERE status != 'CANCELLED';
