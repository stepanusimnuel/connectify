-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('POTENTIAL', 'PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "jobId" INTEGER,
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'POTENTIAL';

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
