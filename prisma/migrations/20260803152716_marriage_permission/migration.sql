-- CreateEnum
CREATE TYPE "MarriageStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "MarriagePermission" (
    "id" TEXT NOT NULL,
    "submittedByUserId" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "groomFather" TEXT,
    "groomAge" TEXT,
    "groomEducation" TEXT,
    "groomVillage" TEXT,
    "groomPosa" TEXT,
    "groomBhaya" TEXT,
    "groomDistrict" TEXT,
    "groomPhone" TEXT,
    "groomPhotoPath" TEXT,
    "brideName" TEXT NOT NULL,
    "brideFather" TEXT,
    "brideAge" TEXT,
    "brideEducation" TEXT,
    "brideVillage" TEXT,
    "bridePosa" TEXT,
    "brideBhaya" TEXT,
    "brideDistrict" TEXT,
    "bridePhone" TEXT,
    "bridePhotoPath" TEXT,
    "marriageDate" TEXT,
    "declaration" TEXT,
    "groomWitnesses" JSONB,
    "brideWitnesses" JSONB,
    "talukaApproved" BOOLEAN NOT NULL DEFAULT false,
    "talukaApprovedBy" TEXT,
    "centralApproved" BOOLEAN NOT NULL DEFAULT false,
    "centralApprovedBy" TEXT,
    "adminApproved" BOOLEAN NOT NULL DEFAULT false,
    "adminApprovedBy" TEXT,
    "status" "MarriageStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarriagePermission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MarriagePermission" ADD CONSTRAINT "MarriagePermission_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
