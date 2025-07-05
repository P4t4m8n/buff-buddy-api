import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import {
  CreateNestedCoreSetSchema,
  crudOperationSchema,
} from "../coreSets/coreSets.validations";

export const DaysOfWeekSchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const CreateProgramExerciseSchema = z.object({
  order: z.coerce
    .number()
    .int("Order must be a whole number")
    .min(1, "Order must be at least 1")
    .max(100, "Order cannot exceed 100"),

  notes: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return sanitizeHtml(val, {
        allowedTags: [],
        allowedAttributes: {},
      });
    })
    .transform((val) => {
      if (!val) return undefined;
      return val.trim();
    })
    .transform((val) => {
      if (!val) return undefined;
      return val.replace(/\s+/g, " ");
    })
    .refine(
      (val) => !val || val.length <= 500,
      "Notes must be less than 500 characters"
    ),

  daysOfWeek: z
    .array(DaysOfWeekSchema)
    .min(1, "At least one day of the week is required")
    .max(7, "Maximum 7 days allowed")
    .transform((days) => [...new Set(days)]), // Remove duplicates

  exerciseId: z
    .string()
    .min(1, "Exercise ID is required")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    )
    .transform((val) => val.trim())
    .refine(
      (val) => val.length >= 1,
      "Exercise ID is required after sanitization"
    ),

  programId: z
    .string()
    .min(1, "Program ID is required")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    )
    .transform((val) => val.trim())
    .refine(
      (val) => val.length >= 1,
      "Program ID is required after sanitization"
    ),

  isActive: z.coerce.boolean().default(true),
  coreSets: z
    .array(CreateNestedCoreSetSchema)
    .min(1, "At least one set is required")
    .max(20, "Maximum 20 sets allowed per exercise"),
  curdOperation: z.optional(crudOperationSchema).default("read"),
});

export const UpdateProgramExerciseSchema =
  CreateProgramExerciseSchema.partial();

const NestedProgramExerciseObjectSchema = z.object({
  order: z.coerce.number(),
  notes: z
    .string()
    .nullish()
    .transform((val) => {
      if (!val) return undefined;
      return sanitizeHtml(val, {
        allowedTags: [],
        allowedAttributes: {},
      });
    })
    .transform((val) => {
      if (!val) return undefined;
      return val.trim();
    })
    .transform((val) => {
      if (!val) return undefined;
      return val.replace(/\s+/g, " ");
    })
    .refine(
      (val) => !val || val.length <= 500,
      "Notes must be less than 500 characters"
    ),

  daysOfWeek: z
    .array(DaysOfWeekSchema)
    .min(1, "At least one day of the week is required")
    .max(7, "Maximum 7 days allowed")
    .transform((days) => [...new Set(days)]),

  exerciseId: z
    .string()
    .min(1, "Exercise ID is required")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    )
    .transform((val) => val.trim())
    .refine(
      (val) => val.length >= 1,
      "Exercise ID is required after sanitization"
    ),

  isActive: z.coerce.boolean().default(true),

  coreSets: z
    .array(CreateNestedCoreSetSchema)
    .min(1, "At least one set is required")
    .max(20, "Maximum 20 sets allowed per exercise"),
  crudOperation: z.optional(crudOperationSchema).default("read"),
  id: z.optional(z.string()),
});

const nestedProgramExerciseRefinement = (
  data: { order?: number; crudOperation?: string },
  ctx: z.RefinementCtx
) => {
  if (data.crudOperation !== "delete") {
    if (data.order === undefined) {
      // For create operations, order is required. For update, it's optional.
      if (data.crudOperation !== "update") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Order is required",
          path: ["order"],
        });
      }
    } else {
      if (!Number.isInteger(data.order)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Order must be a whole number",
          path: ["order"],
        });
      } else {
        if (data.order < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Order must be at least 1",
            path: ["order"],
          });
        }
        if (data.order > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Order cannot exceed 100",
            path: ["order"],
          });
        }
      }
    }
  }
};

export const CreateNestedProgramExerciseSchema =
  NestedProgramExerciseObjectSchema.superRefine(
    nestedProgramExerciseRefinement
  );

export const UpdateNestedProgramExerciseSchema =
  NestedProgramExerciseObjectSchema.partial().superRefine(
    nestedProgramExerciseRefinement
  );

export const ProgramExerciseParamsSchema = z.object({
  id: z.string().min(1, "ProgramExercise ID is required"),
});

export const ProgramExerciseQuerySchema = z.object({
  programId: z.string().optional(),
  exerciseId: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  daysOfWeek: z.string().optional(), // Comma-separated days
  minOrder: z.coerce.number().min(1).optional(),
  maxOrder: z.coerce.number().min(1).optional(),
  skip: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional(),
});

export type CreateProgramExerciseInput = z.infer<
  typeof CreateProgramExerciseSchema
>;
export type UpdateProgramExerciseInput = z.infer<
  typeof UpdateProgramExerciseSchema
>;
export type ProgramExerciseParams = z.infer<typeof ProgramExerciseParamsSchema>;
export type ProgramExerciseQuery = z.infer<typeof ProgramExerciseQuerySchema>;
export type CreateNestedProgramExerciseInput = z.infer<
  typeof CreateNestedProgramExerciseSchema
>;
export type UpdateNestedProgramExerciseInput = z.infer<
  typeof UpdateNestedProgramExerciseSchema
>;
