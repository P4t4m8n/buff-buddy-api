/*
  Warnings:

  - You are about to drop the column `note` on the `Program` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Program" DROP COLUMN "note",
ADD COLUMN     "notes" TEXT;
