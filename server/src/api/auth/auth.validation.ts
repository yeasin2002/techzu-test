import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
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

export const updateFcmTokenSchema = z.object({
  fcmToken: z.string().min(1, "FCM token is required"),
});

export type UpdateFcmTokenInput = z.infer<typeof updateFcmTokenSchema>;
