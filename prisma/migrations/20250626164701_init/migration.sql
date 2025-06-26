-- CreateEnum
CREATE TYPE "ExerciseMuscle" AS ENUM ('ABS', 'BACK', 'BICEPS', 'CALVES', 'CHEST', 'CORE', 'FOREARMS', 'GLUTES', 'HAMSTRINGS', 'HIP_FLEXORS', 'LOWER_BACK', 'NECK', 'OBLIQUES', 'QUADS', 'REAR_DELTS', 'SHOULDERS', 'SHINS', 'TRAPS', 'TRICEPS', 'UPPER_BACK');

-- CreateEnum
CREATE TYPE "ExerciseEquipment" AS ENUM ('BARBELL', 'BODY_WEIGHT', 'CABLE', 'DUMBBELL', 'KETTLEBELL', 'MEDICINE_BALL', 'NONE', 'RESISTANCE_BAND');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BALANCE');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "type" "ExerciseType" NOT NULL,
    "equipment" "ExerciseEquipment"[],
    "muscles" "ExerciseMuscle"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);
