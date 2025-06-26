/*
  Warnings:

  - The `equipment` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `muscles` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `types` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ExerciseMuscle" AS ENUM ('abs', 'back', 'biceps', 'calves', 'chest', 'core', 'forearms', 'glutes', 'hamstrings', 'hip_flexors', 'lower_back', 'neck', 'obliques', 'quads', 'rear_delts', 'shoulders', 'shins', 'traps', 'triceps', 'upper_back');

-- CreateEnum
CREATE TYPE "ExerciseEquipment" AS ENUM ('barbell', 'body_weight', 'cable', 'dumbbell', 'kettlebell', 'medicine_ball', 'none', 'resistance_band');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('strength', 'cardio', 'flexibility', 'balance');

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "equipment",
ADD COLUMN     "equipment" "ExerciseEquipment"[],
DROP COLUMN "muscles",
ADD COLUMN     "muscles" "ExerciseMuscle"[],
DROP COLUMN "types",
ADD COLUMN     "types" "ExerciseType"[];
