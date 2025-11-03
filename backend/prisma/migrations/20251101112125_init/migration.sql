-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "hiredFreelancerId" INTEGER,
ADD COLUMN     "paymentAmount" INTEGER;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_hiredFreelancerId_fkey" FOREIGN KEY ("hiredFreelancerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
