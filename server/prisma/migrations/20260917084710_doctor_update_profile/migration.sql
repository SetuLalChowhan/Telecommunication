-- AlterTable
ALTER TABLE "DoctorProfile" ADD COLUMN     "bmdcNumber" TEXT,
ADD COLUMN     "clinicAddress" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "hospitalAffiliation" TEXT;

-- AlterTable
ALTER TABLE "DoctorSpecialty" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DoctorQualification" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "field" TEXT,
    "institute" TEXT NOT NULL,
    "passingYear" INTEGER,
    "result" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorQualification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DoctorQualification_doctorId_idx" ON "DoctorQualification"("doctorId");

-- AddForeignKey
ALTER TABLE "DoctorQualification" ADD CONSTRAINT "DoctorQualification_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "DoctorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
