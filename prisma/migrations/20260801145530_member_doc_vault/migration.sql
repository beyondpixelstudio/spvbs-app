/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `PrivateDocument` table. All the data in the column will be lost.
  - You are about to drop the column `isSharedWhenLoggedIn` on the `PrivateDocument` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `PrivateDocument` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `PrivateDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `PrivateDocument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PrivateDocument" DROP CONSTRAINT "PrivateDocument_familyMemberId_fkey";

-- AlterTable
ALTER TABLE "FamilyMember" ADD COLUMN     "docsPasswordHash" TEXT,
ADD COLUMN     "docsSharedWhenLoggedIn" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PrivateDocument" DROP COLUMN "fileUrl",
DROP COLUMN "isSharedWhenLoggedIn",
DROP COLUMN "passwordHash",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "filePath" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PrivateDocument" ADD CONSTRAINT "PrivateDocument_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
