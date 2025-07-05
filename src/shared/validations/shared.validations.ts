import { z } from "zod";

export const conditionalOrderRefinement = (
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
