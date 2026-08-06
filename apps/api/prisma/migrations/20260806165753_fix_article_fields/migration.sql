/*
  Warnings:

  - You are about to drop the column `createdAr` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "publishedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAr",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
