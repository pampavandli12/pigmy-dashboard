import { z } from "zod";

// Login form validation schema using Zod
export const loginSchema = z.object({
  bankCode: z.string().min(2, "Username must be at least 2 characters"),
  userName: z.string().min(2, "Username must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Add Agent form validation schema using Zod
export const addAgentSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Field is required." : "Invalid input.",
    })
    .min(2, "Name must be at least 2 characters"),

  address: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Field is required." : "Invalid input.",
    })
    .min(2, "Address must be at least 2 characters"),

  password: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Field is required." : "Invalid input.",
    })
    .min(6, "Password must be at least 6 characters"),

  phone: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Field is required." : "Invalid input.",
    })
    .regex(/^\d{10}$/, "Phone must be 10 digits"),

  email: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Field is required." : "Invalid input.",
    })
    .email("Invalid email address"),

  agentCode: z.coerce
    .number({
      error: (iss) =>
        iss.input === undefined ? "Field is required." : "Invalid input.",
    })
    .positive("Agent code must be positive"),
  type: z.enum(["agent", "employee"], {
    error: (iss) =>
      iss.input === undefined ? "Field is required." : "Invalid input.",
  }),

  limitAmount: z.coerce
    .number({
      error: (iss) =>
        iss.input === undefined ? "Field is required." : "Invalid input.",
    })
    .positive("Limit amount must be positive"),
});

export type AddAgentFormValues = z.infer<typeof addAgentSchema>;
