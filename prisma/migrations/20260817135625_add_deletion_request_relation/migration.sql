-- AddForeignKey
ALTER TABLE "MemberDeletionRequest" ADD CONSTRAINT "MemberDeletionRequest_familyUnitId_fkey" FOREIGN KEY ("familyUnitId") REFERENCES "FamilyUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
