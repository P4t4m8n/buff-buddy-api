-- DropForeignKey
ALTER TABLE "CoreSet" DROP CONSTRAINT "CoreSet_programExerciseId_fkey";

-- AddForeignKey
ALTER TABLE "CoreSet" ADD CONSTRAINT "CoreSet_programExerciseId_fkey" FOREIGN KEY ("programExerciseId") REFERENCES "ProgramExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
