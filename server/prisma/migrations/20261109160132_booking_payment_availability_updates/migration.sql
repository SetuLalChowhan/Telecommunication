-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('NONE', 'REFUND_PENDING', 'REFUND_INITIATED', 'REFUNDED', 'REFUND_FAILED');

-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'RESCHEDULED';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" TEXT,
ADD COLUMN     "isRescheduled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "originalSlotEnd" TIMESTAMP(3),
ADD COLUMN     "originalSlotStart" TIMESTAMP(3),
ADD COLUMN     "rescheduledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "DoctorProfile" ADD COLUMN     "isAvailabilityVisible" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT NOT NULL DEFAULT 'SIMULATED',
    "transactionId" TEXT,
    "refundStatus" "RefundStatus",
    "refundReason" TEXT,
    "refundedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
