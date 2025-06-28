import { Prisma, Program } from "../../../prisma/generated/prisma";
import { prisma } from "../../../prisma/prisma";
import { dbUtil } from "../../shared/utils/db.util";
import { IProgramFilter } from "./programs.models";
import { CreateProgramInput, UpdateProgramInput } from "./programs.validations";

export const programsService = {
  getAll: async (filter: IProgramFilter): Promise<Program[]> => {
    const where: Prisma.ProgramWhereInput = buildWhereClause(filter);

    const take = filter.take ?? 20;
    const skip =
      filter.skip ??
      (filter.page && filter.page > 1 ? (filter.page - 1) * take : 0);

    return await prisma.program.findMany({
      where,
      skip,
      take,
      include: {
        programExercises: {
          include: {
            exercise: true,
            coreSets: true,
          },
        },
      },
    });
  },

  getById: async (id: string): Promise<Program | null> => {
    return await prisma.program.findUnique({
      where: { id },
      include: {
        programExercises: {
          include: {
            exercise: true,
            coreSets: true,
          },
        },
      },
    });
  },

  create: async (dto: CreateProgramInput, userId: string): Promise<Program> => {
    return await prisma.program.create({
      data: {
        name: dto.name,
        notes: dto.notes,
        isActive: dto.isActive,
        startDate: dto.startDate,
        endDate: dto.endDate,
        owner: {
          connect: { id: userId },
        },
        programExercises: {
          create: dto.programExercises
            .filter((pe) => pe.curdOperation === "create")
            .map((pe) => ({
              order: pe.order,
              notes: pe.notes,
              isActive: pe.isActive,
              daysOfWeek: pe.daysOfWeek,
              exercise: {
                connect: { id: pe.exerciseId },
              },
              coreSets: {
                create: pe.coreSets
                  .filter((cs) => cs.curdOperation === "create")
                  .map((cs) => ({
                    reps: cs.reps,
                    weight: cs.weight,
                    restTime: cs.restTime,
                    order: cs.order,
                    isWarmup: cs.isWarmup,
                    repsInReserve: cs.repsInReserve,
                  })),
              },
            })),
        },
      },
    });
  },

  update: async (id: string, dto: UpdateProgramInput): Promise<Program> => {
    const programData = dbUtil.cleanData({
      name: dto.name,
      notes: dto.notes,
      isActive: dto.isActive,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });
    return await prisma.program.update({
      where: { id },
      data: {
        ...programData,
        programExercises: {
          upsert: (dto?.programExercises ?? []).map((pe) => ({
            where: { id: pe.id ?? "test-pe" },
            update: {
              // Clean programExercise data
              ...dbUtil.cleanData({
                order: pe.order,
                notes: pe.notes,
                isActive: pe.isActive,
                daysOfWeek: pe.daysOfWeek,
              }),
              exercise: pe.exerciseId
                ? {
                    connect: { id: pe.exerciseId },
                  }
                : undefined,
              coreSets: {
                upsert: pe.coreSets.map((cs) => ({
                  where: { id: cs.id ?? "test-cs" },
                  update: {
                    // Clean coreSet data
                    ...dbUtil.cleanData({
                      reps: cs.reps,
                      weight: cs.weight,
                      restTime: cs.restTime,
                      order: cs.order,
                      isWarmup: cs.isWarmup,
                      repsInReserve: cs.repsInReserve,
                    }),
                  },
                  create: {
                    reps: cs.reps,
                    weight: cs.weight,
                    restTime: cs.restTime,
                    order: cs.order,
                    isWarmup: cs.isWarmup,
                    repsInReserve: cs.repsInReserve,
                  },
                })),
                deleteMany: pe.coreSets
                  .filter((cs) => cs.curdOperation === "delete")
                  .map((cs) => ({ id: cs.id })),
              },
            },
            create: {
              order: pe.order,
              notes: pe.notes,
              isActive: pe.isActive,
              daysOfWeek: pe.daysOfWeek,
              exerciseId: pe.exerciseId,
              coreSets: {
                create: pe.coreSets.map((cs) => ({
                  reps: cs.reps,
                  weight: cs.weight,
                  restTime: cs.restTime,
                  order: cs.order,
                  isWarmup: cs.isWarmup,
                  repsInReserve: cs.repsInReserve,
                })),
              },
            },
          })),
          deleteMany: (dto?.programExercises ?? [])
            .filter((pe) => pe.curdOperation === "delete")
            .map((pe) => ({ id: pe.id })),
        },
      },
    });
  },

  delete: async (id: string): Promise<Program> => {
    return await prisma.program.delete({
      where: { id },
    });
  },
};

const buildWhereClause = (filter: IProgramFilter): Prisma.ProgramWhereInput => {
  const where: Prisma.ProgramWhereInput = {};

  if (filter.name) {
    where.name = { contains: filter.name, mode: "insensitive" };
  }
  if (filter.exerciseTypes) {
    where.programExercises = {
      some: {
        exercise: {
          types: {
            hasSome: filter.exerciseTypes.split(",") as any[],
          },
        },
      },
    };
  }
  if (filter.exerciseEquipment) {
    where.programExercises = {
      some: {
        exercise: {
          equipment: {
            hasSome: filter.exerciseEquipment.split(",") as any[],
          },
        },
      },
    };
  }
  if (filter.exerciseMuscles) {
    where.programExercises = {
      some: {
        exercise: {
          muscles: {
            hasSome: filter.exerciseMuscles.split(",") as any[],
          },
        },
      },
    };
  }
  if (filter.exerciseName) {
    where.programExercises = {
      some: {
        exercise: {
          name: { contains: filter.exerciseName, mode: "insensitive" },
        },
      },
    };
  }

  return where;
};
