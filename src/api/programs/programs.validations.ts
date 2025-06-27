import { z } from "zod";
import sanitizeHtml from "sanitize-html";

import {
  CreateNestedProgramExerciseSchema,
  DaysOfWeekSchema,
} from "../programExercises/programExercises.validations";
import { CreateNestedCoreSetSchema } from "../coreSets/coreSets.validations";

const BaseProgramSchema = z.object({
  name: z
    .string()
    .min(1, "Program name is required")
    .max(200, "Program name must be less than 200 characters")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    )
    .transform((val) => val.trim())
    .transform((val) => val.replace(/\s+/g, " "))
    .refine(
      (val) => val.length >= 1,
      "Program name is required after sanitization"
    )
    .refine(
      (val) => val.length <= 100,
      "Program name must be less than 100 characters"
    ),

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
      (val) => !val || val.length <= 1000,
      "Notes must be less than 1000 characters"
    ),

  startDate: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), "Invalid start date"),

  endDate: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), "Invalid end date"),

  isActive: z.coerce.boolean().default(true),

  // Nested ProgramExercises array
  programExercises: z
    .array(CreateNestedProgramExerciseSchema)
    .min(1, "At least one exercise is required")
    .max(50, "Maximum 50 exercises allowed per program"),
});

export const CreateProgramSchema = BaseProgramSchema.refine(
  (data) => data.endDate > data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export const UpdateProgramSchema = BaseProgramSchema.partial()

export const ProgramParamsSchema = z.object({
  id: z.string().min(1, "Program ID is required"),
});

export const ProgramQuerySchema = z.object({
  name: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  skip: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional(),
});

export type CreateProgramInput = z.infer<typeof CreateProgramSchema>;
export type UpdateProgramInput = z.infer<typeof UpdateProgramSchema>;
export type ProgramParams = z.infer<typeof ProgramParamsSchema>;
export type ProgramQuery = z.infer<typeof ProgramQuerySchema>;

