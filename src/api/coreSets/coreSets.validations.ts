import { z } from "zod";
import sanitizeHtml from "sanitize-html";

export const crudOperationSchema = z.enum([
  "create",
  "update",
  "delete",
  "read",
]);

export const CreateCoreSetSchema = z.object({
  reps: z.coerce
    .number()
    .int("Reps must be a whole number")
    .min(1, "Reps must be at least 1")
    .max(1000, "Reps cannot exceed 1000"),

  weight: z.coerce
    .number()
    .min(0, "Weight cannot be negative")
    .max(10000, "Weight cannot exceed 10000")
    .transform((val) => Math.round(val * 100) / 100),

  restTime: z.coerce
    .number()
    .int("Rest time must be a whole number")
    .min(0, "Rest time cannot be negative")
    .max(3600, "Rest time cannot exceed 1 hour (3600 seconds)"),

  order: z.coerce
    .number()
    .int("Order must be a whole number")
    .min(1, "Order must be at least 1")
    .max(100, "Order cannot exceed 100"),

  isWarmup: z.coerce.boolean().default(false),

  repsInReserve: z.coerce
    .number()
    .int("Reps in reserve must be a whole number")
    .min(0, "Reps in reserve cannot be negative")
    .max(20, "Reps in reserve cannot exceed 20")
    .nullable()
    .default(0),

  programExerciseId: z
    .string()
    .min(1, "Program exercise ID is required")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    )
    .transform((val) => val.trim())
    .refine(
      (val) => val.length >= 1,
      "Program exercise ID is required after sanitization"
    ),
  curdOperation: z.optional(crudOperationSchema).default("read"),
});

export const UpdateCoreSetSchema = CreateCoreSetSchema.partial();

export const CreateNestedCoreSetSchema = z.object({
  reps: z.coerce
    .number()
    .int("Reps must be a whole number")
    .min(1, "Reps must be at least 1")
    .max(1000, "Reps cannot exceed 1000"),

  weight: z.coerce
    .number()
    .min(0, "Weight cannot be negative")
    .max(10000, "Weight cannot exceed 10000")
    .transform((val) => Math.round(val * 100) / 100),

  restTime: z.coerce
    .number()
    .int("Rest time must be a whole number")
    .min(0, "Rest time cannot be negative")
    .max(3600, "Rest time cannot exceed 1 hour (3600 seconds)"),

  order: z.coerce
    .number()
    .int("Order must be a whole number")
    .min(1, "Order must be at least 1")
    .max(100, "Order cannot exceed 100"),

  isWarmup: z.coerce.boolean().default(false),

  repsInReserve: z.coerce
    .number()
    .int("Reps in reserve must be a whole number")
    .min(0, "Reps in reserve cannot be negative")
    .max(20, "Reps in reserve cannot exceed 20")
    .nullable()
    .default(0),
  curdOperation: z.optional(crudOperationSchema).default("read"),
    id: z.optional(z.string()),

});

export const UpdateNestedCoreSetSchema = CreateNestedCoreSetSchema.partial();

export const CoreSetParamsSchema = z.object({
  id: z.string().min(1, "CoreSet ID is required"),
});

export const CoreSetQuerySchema = z.object({
  programExerciseId: z.string().optional(),
  isWarmup: z.coerce.boolean().optional(),
  minWeight: z.coerce.number().min(0).optional(),
  maxWeight: z.coerce.number().min(0).optional(),
  minReps: z.coerce.number().min(1).optional(),
  maxReps: z.coerce.number().min(1).optional(),
  skip: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional(),
});

export type CreateCoreSetInput = z.infer<typeof CreateCoreSetSchema>;
export type UpdateCoreSetInput = z.infer<typeof UpdateCoreSetSchema>;
export type CoreSetParams = z.infer<typeof CoreSetParamsSchema>;
export type CoreSetQuery = z.infer<typeof CoreSetQuerySchema>;
export type CreateNestedCoreSetInput = z.infer<
  typeof CreateNestedCoreSetSchema
>;
export type UpdateNestedCoreSetInput = z.infer<
  typeof UpdateNestedCoreSetSchema
>;
export type CreateCoreSetInputWithOperation = z.infer<
  typeof CreateCoreSetSchema
>;
