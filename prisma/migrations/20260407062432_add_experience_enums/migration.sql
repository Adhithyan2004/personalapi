-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('INTERN', 'JUNIOR', 'MID', 'SENIOR');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "experienceLevel" "ExperienceLevel";
