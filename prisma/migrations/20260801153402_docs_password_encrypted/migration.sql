/*
  Warnings:

  - You are about to drop the column `docsPasswordHash` on the `FamilyMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FamilyMember" DROP COLUMN "docsPasswordHash",
ADD COLUMN     "docsPasswordEnc" TEXT;
