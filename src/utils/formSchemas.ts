import { z } from "zod";

// Login form validation schema using Zod
export const loginSchema = z.object({
  bankCode: z.string().min(2, "Username must be at least 2 characters"),
  userName: z.string().min(2, "Username must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
