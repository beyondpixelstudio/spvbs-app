-- CreateEnum
CREATE TYPE "CommitteeLevel" AS ENUM ('TALUKA', 'CENTRAL');

-- CreateEnum
CREATE TYPE "CommitteeType" AS ENUM ('ADVISOR', 'CORE', 'FINANCE', 'MANDIR_PARICHALANA', 'YOUTH_CELL');

-- CreateEnum
CREATE TYPE "CommitteeDesignation" AS ENUM ('PRESIDENT', 'SECRETARY', 'JOINT_SECRETARY', 'CASHIER', 'MEMBER');

-- CreateTable
CREATE TABLE "CommitteeAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "CommitteeLevel" NOT NULL,
    "type" "CommitteeType" NOT NULL,
    "designation" "CommitteeDesignation" NOT NULL DEFAULT 'MEMBER',
    "taluka" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommitteeAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommitteeAssignment" ADD CONSTRAINT "CommitteeAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
