import {
  Exercise,
  Prisma,
  ExerciseType,
  ExerciseEquipment,
  ExerciseMuscle,
} from "../../../prisma/generated/prisma";
import { prisma } from "../../../prisma/prisma";
import { IExerciseFilter } from "./exercises.models";
import {
  CreateExerciseInput,
  UpdateExerciseInput,
} from "./exercises.validations";

export const exerciseService = {
  getAll: async (filter: IExerciseFilter): Promise<Exercise[]> => {
    const where: Prisma.ExerciseWhereInput = {};

    if (filter.name) {
      where.name = { contains: filter.name, mode: "insensitive" };
    }
    if (filter.types) {
      const matchedTypes = Object.values(ExerciseType).filter((type) =>
        type.toLowerCase().includes(filter.types!.toLowerCase())
      );
      if (matchedTypes.length > 0) {
        where.types = { hasSome: matchedTypes };
      } else {
        return [];
      }
    }
    if (filter.equipment) {
      const matchedEquipment = Object.values(ExerciseEquipment).filter((eq) =>
        eq.toLowerCase().includes(filter.equipment!.toLowerCase())
      );
      if (matchedEquipment.length > 0) {
        where.equipment = { hasSome: matchedEquipment };
      } else {
        return [];
      }
    }
    if (filter.muscles) {
      const matchedMuscles = Object.values(ExerciseMuscle).filter((muscle) =>
        muscle.toLowerCase().includes(filter.muscles!.toLowerCase())
      );
      if (matchedMuscles.length > 0) {
        where.muscles = { hasSome: matchedMuscles };
      } else {
        return [];
      }
    }

    const take = 20;
    const skip =
      filter.skip ??
      (filter.page && filter.page > 1 ? (filter.page - 1) * take : 0);

    return prisma.exercise.findMany({
      where,
      skip,
      take,
    });
  },
  getBtyId: async (id: string): Promise<Exercise | null> => {
    return await prisma.exercise.findUnique({
      where: { id },
    });
  },
  create: async (dto: CreateExerciseInput): Promise<Exercise> => {
    return await prisma.exercise.create({
      data: {
        name: dto.name,
        youtubeUrl: dto.youtubeUrl,
        muscles: dto.muscles,
        equipment: dto.equipment,
        types: dto.types,
      },
    });
  },
  update: async (id: string, dto: UpdateExerciseInput): Promise<Exercise> => {
    return await prisma.exercise.update({
      where: { id },
      data: dto,
    });
  },
  delete: async (id: string): Promise<Exercise> => {
    return await prisma.exercise.delete({
      where: { id },
    });
  },
};
