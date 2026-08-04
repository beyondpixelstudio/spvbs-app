-- CreateEnum
CREATE TYPE "GrievanceCategory" AS ENUM ('COMMITTEE', 'MEMBER', 'EVENT', 'FINANCIAL', 'SUGGESTION', 'OTHER');

-- AlterTable
ALTER TABLE "Grievance" ADD COLUMN     "againstWhom" TEXT,
ADD COLUMN     "category" "GrievanceCategory" NOT NULL DEFAULT 'OTHER';
