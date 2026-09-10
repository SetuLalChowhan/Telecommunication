-- CreateTable
CREATE TABLE "DoctorDayOff" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorDayOff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DoctorDayOff_doctorId_idx" ON "DoctorDayOff"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorDayOff_doctorId_date_key" ON "DoctorDayOff"("doctorId", "date");

-- AddForeignKey
ALTER TABLE "DoctorDayOff" ADD CONSTRAINT "DoctorDayOff_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "DoctorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
