/*
  Warnings:

  - Added the required column `chapterOrder` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonOrder` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Chapter" ADD COLUMN     "chapterOrder" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Lesson" ADD COLUMN     "lessonOrder" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserCourses" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;
