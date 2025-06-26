import { z } from "zod";
import sanitizeHtml from "sanitize-html";

// Enum validations based on Prisma schema
export const ExerciseMuscleSchema = z.enum([
  "abs",
  "back",
  "biceps",
  "calves",
  "chest",
  "core",
  "forearms",
  "glutes",
  "hamstrings",
  "hip_flexors",
  "lower_back",
  "neck",
  "obliques",
  "quads",
  "rear_delts",
  "shoulders",
  "shins",
  "traps",
  "triceps",
  "upper_back",
]);

export const ExerciseEquipmentSchema = z.enum([
  "barbell",
  "body_weight",
  "cable",
  "dumbbell",
  "kettlebell",
  "medicine_ball",
  "none",
  "resistance_band",
]);

export const ExerciseTypeSchema = z.enum([
  "strength",
  "cardio",
  "flexibility",
  "balance",
]);

// Exercise validation schema with sanitization
export const CreateExerciseSchema = z.object({
  name: z
    .string()
    .min(1, "Exercise name is required")
    .max(200, "Exercise name must be less than 200 characters") // Increased for pre-sanitization
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    )
    .transform((val) => val.trim()) // Remove whitespace
    .transform((val) => val.replace(/\s+/g, " ")) // Replace multiple spaces with single space
    .refine(
      (val) => val.length >= 1,
      "Exercise name is required after sanitization"
    )
    .refine(
      (val) => val.length <= 100,
      "Exercise name must be less than 100 characters"
    ),

  youtubeUrl: z
    .string()
    .min(1, "YouTube URL is required")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    ) // Strip all HTML
    .transform((val) => val.trim()) // Remove whitespace
    .transform((url) => {
      // Normalize YouTube URL format
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
      if (url.includes("youtube.com/watch")) {
        // Ensure https and www
        if (!url.startsWith("http")) {
          url = "https://" + url;
        }
        if (!url.includes("www.")) {
          url = url.replace("youtube.com", "www.youtube.com");
        }
        return url;
      }
      return url;
    })
    .refine((url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }, "Must be a valid URL")
    .refine((url) => {
      const youtubeRegex = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+/;
      return youtubeRegex.test(url);
    }, "Must be a valid YouTube URL"),

  types: z
    .array(ExerciseTypeSchema)
    .min(1, "At least one exercise type is required")
    .max(4, "Maximum 4 exercise types allowed")
    .transform((types) => [...new Set(types)]), // Remove duplicates

  equipment: z
    .array(ExerciseEquipmentSchema)
    .min(1, "At least one equipment type is required")
    .max(8, "Maximum 8 equipment types allowed")
    .transform((equipment) => [...new Set(equipment)]), // Remove duplicates

  muscles: z
    .array(ExerciseMuscleSchema)
    .min(1, "At least one muscle group is required")
    .max(21, "Maximum 21 muscle groups allowed")
    .transform((muscles) => [...new Set(muscles)]), // Remove duplicates
});

export const UpdateExerciseSchema = CreateExerciseSchema.partial();

export const ExerciseParamsSchema = z.object({
  id: z.string().min(1, "Exercise ID is required"),
});

export const ExerciseQuerySchema = z.object({
  name: z.string().optional(),
  typeId: z.string().optional(),
  equipmentId: z.string().optional(),
  muscleId: z.string().optional(),
  typeName: ExerciseTypeSchema.optional(),
  equipmentName: ExerciseEquipmentSchema.optional(),
  muscleName: ExerciseMuscleSchema.optional(),
  skip: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional(),
});

// Export types for use in controllers/services
export type CreateExerciseInput = z.infer<typeof CreateExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof UpdateExerciseSchema>;
export type ExerciseParams = z.infer<typeof ExerciseParamsSchema>;
export type ExerciseQuery = z.infer<typeof ExerciseQuerySchema>;
