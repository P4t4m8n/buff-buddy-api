/*
  Warnings:

  - The `equipment` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `muscles` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "equipment",
ADD COLUMN     "equipment" TEXT[],
DROP COLUMN "muscles",
ADD COLUMN     "muscles" TEXT[];

-- DropEnum
DROP TYPE "ExerciseEquipment";

-- DropEnum
DROP TYPE "ExerciseMuscle";

-- DropEnum
DROP TYPE "ExerciseType";
