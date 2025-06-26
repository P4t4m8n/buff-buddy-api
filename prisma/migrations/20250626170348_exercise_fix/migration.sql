/*
  Warnings:

  - You are about to drop the column `description` on the `Exercise` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `youtubeUrl` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Exercise` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "description",
ADD COLUMN     "youtubeUrl" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");
