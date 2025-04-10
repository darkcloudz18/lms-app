/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `position` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Step 1: Drop the old column if it's no longer needed
ALTER TABLE "Lesson" DROP COLUMN "videoUrl";

-- Step 2: Add the new columns with defaults
ALTER TABLE "Lesson" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Lesson" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'text';
