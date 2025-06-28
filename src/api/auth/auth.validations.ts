import { z } from "zod";
import sanitizeHtml from "sanitize-html";

export const CreateUserSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .max(255, "Email must be less than 255 characters")
      .transform((val) =>
        sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
      )
      .transform((val) => val.trim())
      .transform((val) => val.toLowerCase())
      .refine((val) => val.length >= 1, "Email is required after sanitization")
      .refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Must be a valid email address"
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .transform((val) =>
        sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
      )
      .refine(
        (val) => /(?=.*[a-z])/.test(val),
        "Password must contain at least one lowercase letter"
      )
      .refine(
        (val) => /(?=.*[A-Z])/.test(val),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (val) => /(?=.*\d)/.test(val),
        "Password must contain at least one number"
      )
      .refine(
        (val) => /(?=.*[@$!%*?&])/.test(val),
        "Password must contain at least one special character (@$!%*?&)"
      ),

    confirmPassword: z
      .string()
      .min(1, "Password confirmation is required")
      .transform((val) =>
        sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
      ),
    imgUrl: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        return sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });
      })
      .transform((val) => val?.trim()),

    firstName: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        return sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });
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
        (val) => !val || val.length <= 50,
        "First name must be less than 50 characters"
      )
      .refine(
        (val) => !val || /^[a-zA-Z\s'-]+$/.test(val),
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      ),

    lastName: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        return sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });
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
        (val) => !val || val.length <= 50,
        "Last name must be less than 50 characters"
      )
      .refine(
        (val) => !val || /^[a-zA-Z\s'-]+$/.test(val),
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    )
    .transform((val) => val.trim())
    .transform((val) => val.toLowerCase())
    .refine((val) => val.length >= 1, "Email is required after sanitization")
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Must be a valid email address"
    ),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password must be less than 128 characters")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    ),
});

export const GoogleOAuthSchema = z.object({
  googleId: z
    .string()
    .min(1, "Google ID is required")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    )
    .transform((val) => val.trim()),

  email: z
    .string()
    .min(1, "Email is required")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
    )
    .transform((val) => val.trim())
    .transform((val) => val.toLowerCase())
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Must be a valid email address"
    ),
  imgUrl: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });
    })
    .transform((val) => val?.trim()),

  firstName: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });
    })
    .transform((val) => {
      if (!val) return undefined;
      return val.trim();
    })
    .transform((val) => {
      if (!val) return undefined;
      return val.replace(/\s+/g, " ");
    }),

  lastName: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });
    })
    .transform((val) => {
      if (!val) return undefined;
      return val.trim();
    })
    .transform((val) => {
      if (!val) return undefined;
      return val.replace(/\s+/g, " ");
    }),
});

export const UpdateUserSchema = z.object({
  firstName: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });
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
      (val) => !val || val.length <= 50,
      "First name must be less than 50 characters"
    ),

  lastName: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });
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
      (val) => !val || val.length <= 50,
      "Last name must be less than 50 characters"
    ),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .transform((val) =>
        sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
      ),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128, "New password must be less than 128 characters")
      .transform((val) =>
        sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
      )
      .refine(
        (val) => /(?=.*[a-z])/.test(val),
        "New password must contain at least one lowercase letter"
      )
      .refine(
        (val) => /(?=.*[A-Z])/.test(val),
        "New password must contain at least one uppercase letter"
      )
      .refine(
        (val) => /(?=.*\d)/.test(val),
        "New password must contain at least one number"
      )
      .refine(
        (val) => /(?=.*[@$!%*?&])/.test(val),
        "New password must contain at least one special character (@$!%*?&)"
      ),

    confirmNewPassword: z
      .string()
      .min(1, "Password confirmation is required")
      .transform((val) =>
        sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
      ),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const UserParamsSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type GoogleOAuthInput = z.infer<typeof GoogleOAuthSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;
