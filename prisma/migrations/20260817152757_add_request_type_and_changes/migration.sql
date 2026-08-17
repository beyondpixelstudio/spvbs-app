-- CreateEnum
CREATE TYPE "MemberRequestType" AS ENUM ('ADD', 'EDIT', 'DELETE');

-- AlterTable
ALTER TABLE "MemberDeletionRequest" ADD COLUMN     "proposedChanges" JSONB,
ADD COLUMN     "requestType" "MemberRequestType" NOT NULL DEFAULT 'DELETE',
ALTER COLUMN "memberId" DROP NOT NULL;
