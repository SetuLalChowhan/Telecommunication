import * as z from "zod";

/**
 * Frontend validation only — it exists to improve UX. The server remains the
 * authority for credential correctness.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
