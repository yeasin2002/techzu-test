import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  fcmToken: z.string().optional(),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .trim(),
  password: z
    .string()
    .min(1, "Password is required"),
  fcmToken: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
