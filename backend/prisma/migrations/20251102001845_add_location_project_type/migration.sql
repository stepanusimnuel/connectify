/*
  Warnings:

  - You are about to drop the column `role` on the `Job` table. All the data in the column will be lost.
  - Added the required column `specialty` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('JOB', 'COURSE');

-- AlterEnum
ALTER TYPE "Location" ADD VALUE 'Online';

-- DropForeignKey
ALTER TABLE "public"."Job" DROP CONSTRAINT "Job_hiredFreelancerId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "role",
ADD COLUMN     "specialty" TEXT NOT NULL,
ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT 'JOB';
