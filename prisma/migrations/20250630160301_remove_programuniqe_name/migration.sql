/*
  Warnings:

  - The values [rear_delts] on the enum `ExerciseMuscle` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExerciseMuscle_new" AS ENUM ('abs', 'back', 'biceps', 'calves', 'chest', 'core', 'forearms', 'glutes', 'hamstrings', 'hip_flexors', 'lower_back', 'neck', 'obliques', 'quads', 'shoulders', 'shins', 'traps', 'triceps', 'upper_back');
ALTER TABLE "Exercise" ALTER COLUMN "muscles" TYPE "ExerciseMuscle_new"[] USING ("muscles"::text::"ExerciseMuscle_new"[]);
ALTER TYPE "ExerciseMuscle" RENAME TO "ExerciseMuscle_old";
ALTER TYPE "ExerciseMuscle_new" RENAME TO "ExerciseMuscle";
DROP TYPE "ExerciseMuscle_old";
COMMIT;

-- DropIndex
DROP INDEX "Program_name_key";
