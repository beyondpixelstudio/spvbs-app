-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'TALUKA_ADMIN', 'FAMILY_HEAD', 'MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'MEMBERS_ONLY', 'HIDDEN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('MARRIED', 'UNMARRIED', 'WIDOWED', 'DIVORCED');

-- CreateEnum
CREATE TYPE "CurrentStatus" AS ENUM ('STUDYING', 'EMPLOYED', 'HOMEMAKER', 'RETIRED', 'UNEMPLOYED');

-- CreateEnum
CREATE TYPE "MatrimonialPrivacyMode" AS ENUM ('BLURRED', 'ADMIN_MEDIATED', 'OPEN');

-- CreateEnum
CREATE TYPE "MatrimonialStatus" AS ENUM ('ACTIVE', 'MATCHED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "InterestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('GOING', 'MAYBE', 'NOT_GOING');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "GrievanceStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "BroadcastChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "BroadcastScope" AS ENUM ('ALL', 'TALUKA', 'FAMILY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "languagePref" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyUnit" (
    "id" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "familyHeadUserId" TEXT NOT NULL,
    "taluka" TEXT NOT NULL,
    "villageTown" TEXT NOT NULL,
    "declarationAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "familyUnitId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" "Gender",
    "dob" TIMESTAMP(3),
    "maritalStatus" "MaritalStatus",
    "qualification" TEXT,
    "occupation" TEXT,
    "mobileNumber" TEXT,
    "bloodGroup" TEXT,
    "currentStatus" "CurrentStatus",
    "villageTown" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'MEMBERS_ONLY',
    "photoUrl" TEXT,
    "isMatrimonialEligible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JanamKundli" (
    "id" TEXT NOT NULL,
    "familyMemberId" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "birthTime" TEXT,
    "birthPlace" TEXT,
    "chartData" JSONB,
    "visibility" "Visibility" NOT NULL DEFAULT 'HIDDEN',
    "accessRestrictions" JSONB,

    CONSTRAINT "JanamKundli_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateDocument" (
    "id" TEXT NOT NULL,
    "familyMemberId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "isSharedWhenLoggedIn" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivateDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatrimonialProfile" (
    "id" TEXT NOT NULL,
    "familyMemberId" TEXT NOT NULL,
    "privacyMode" "MatrimonialPrivacyMode" NOT NULL DEFAULT 'BLURRED',
    "bio" TEXT,
    "preferences" JSONB,
    "status" "MatrimonialStatus" NOT NULL DEFAULT 'ACTIVE',
    "verifiedBadge" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MatrimonialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatrimonialInterest" (
    "id" TEXT NOT NULL,
    "fromProfileId" TEXT NOT NULL,
    "toProfileId" TEXT NOT NULL,
    "status" "InterestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatrimonialInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "taluka" TEXT,
    "rsvpCapacity" INTEGER,
    "createdByAdminId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRSVP" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" "RsvpStatus" NOT NULL DEFAULT 'GOING',
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventRSVP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryAlbum" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "photoUrls" TEXT[],
    "uploadedByAdminId" TEXT NOT NULL,

    CONSTRAINT "GalleryAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "goalAmount" DECIMAL(12,2) NOT NULL,
    "raisedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "utilizationReceipts" TEXT[],
    "status" "CampaignStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "donorMemberId" TEXT,
    "campaignId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paymentRef" TEXT,
    "isDonorNamed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grievance" (
    "id" TEXT NOT NULL,
    "submittedByMemberId" TEXT,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "GrievanceStatus" NOT NULL DEFAULT 'OPEN',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grievance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipCard" (
    "id" TEXT NOT NULL,
    "familyMemberId" TEXT NOT NULL,
    "qrCodeToken" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfUrl" TEXT,

    CONSTRAINT "MembershipCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Broadcast" (
    "id" TEXT NOT NULL,
    "sentByAdminId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "channel" "BroadcastChannel" NOT NULL,
    "targetScope" "BroadcastScope" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Broadcast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyUnit_familyHeadUserId_key" ON "FamilyUnit"("familyHeadUserId");

-- CreateIndex
CREATE UNIQUE INDEX "JanamKundli_familyMemberId_key" ON "JanamKundli"("familyMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "MatrimonialProfile_familyMemberId_key" ON "MatrimonialProfile"("familyMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRSVP_eventId_memberId_key" ON "EventRSVP"("eventId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryAlbum_eventId_key" ON "GalleryAlbum"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipCard_familyMemberId_key" ON "MembershipCard"("familyMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipCard_qrCodeToken_key" ON "MembershipCard"("qrCodeToken");

-- AddForeignKey
ALTER TABLE "FamilyUnit" ADD CONSTRAINT "FamilyUnit_familyHeadUserId_fkey" FOREIGN KEY ("familyHeadUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyUnitId_fkey" FOREIGN KEY ("familyUnitId") REFERENCES "FamilyUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JanamKundli" ADD CONSTRAINT "JanamKundli_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateDocument" ADD CONSTRAINT "PrivateDocument_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrimonialProfile" ADD CONSTRAINT "MatrimonialProfile_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrimonialInterest" ADD CONSTRAINT "MatrimonialInterest_fromProfileId_fkey" FOREIGN KEY ("fromProfileId") REFERENCES "MatrimonialProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrimonialInterest" ADD CONSTRAINT "MatrimonialInterest_toProfileId_fkey" FOREIGN KEY ("toProfileId") REFERENCES "MatrimonialProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRSVP" ADD CONSTRAINT "EventRSVP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRSVP" ADD CONSTRAINT "EventRSVP_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "FamilyMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryAlbum" ADD CONSTRAINT "GalleryAlbum_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryAlbum" ADD CONSTRAINT "GalleryAlbum_uploadedByAdminId_fkey" FOREIGN KEY ("uploadedByAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorMemberId_fkey" FOREIGN KEY ("donorMemberId") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_submittedByMemberId_fkey" FOREIGN KEY ("submittedByMemberId") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipCard" ADD CONSTRAINT "MembershipCard_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Broadcast" ADD CONSTRAINT "Broadcast_sentByAdminId_fkey" FOREIGN KEY ("sentByAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
