import { z } from 'zod';

// Login form validation schema using Zod
export const loginSchema = z.object({
  bankCode: z.string().min(2, 'Username must be at least 2 characters'),
  userName: z.string().min(2, 'Username must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Add Agent form validation schema using Zod
export const addAgentSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'Field is required.' : 'Invalid input.',
    })
    .min(2, 'Name must be at least 2 characters'),

  address: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'Field is required.' : 'Invalid input.',
    })
    .min(2, 'Address must be at least 2 characters'),

  password: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'Field is required.' : 'Invalid input.',
    })
    .min(6, 'Password must be at least 6 characters'),

  phone: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'Field is required.' : 'Invalid input.',
    })
    .regex(/^\d{10}$/, 'Phone must be 10 digits'),

  email: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'Field is required.' : 'Invalid input.',
    })
    .email('Invalid email address'),

  agentCode: z.coerce
    .number({
      error: (iss) =>
        iss.input === undefined ? 'Field is required.' : 'Invalid input.',
    })
    .positive('Agent code must be positive'),
  type: z.enum(['agent', 'employee'], {
    error: (iss) =>
      iss.input === undefined ? 'Field is required.' : 'Invalid input.',
  }),
  status: z.enum(['active', 'inactive']).default('active'),

  limitAmount: z.coerce
    .number({
      error: (iss) =>
        iss.input === undefined ? 'Field is required.' : 'Invalid input.',
    })
    .positive('Limit amount must be positive'),
});

export type AddAgentFormInput = z.input<typeof addAgentSchema>;
export type AddAgentFormValues = z.output<typeof addAgentSchema>;

// Create Deposit form validation schema using Zod
export const createDepositSchema = z.object({
  depositingAmount: z.coerce
    .number({ message: 'Depositing amount must be a valid number' })
    .positive('Depositing amount must be positive'),

  voucherId: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'Field is required.' : 'Invalid input.',
    })
    .min(1, 'Voucher ID is required'),

  dateRange: z
    .object({
      startDate: z
        .date({
          error: (iss) =>
            iss.input === undefined ? 'Field is required.' : 'Invalid input.',
        })
        .or(
          z
            .string({
              error: (iss) =>
                iss.input === undefined
                  ? 'Field is required.'
                  : 'Invalid input.',
            })
            .datetime(),
        ),
      endDate: z
        .date({
          error: (iss) =>
            iss.input === undefined ? 'Field is required.' : 'Invalid input.',
        })
        .or(
          z
            .string({
              error: (iss) =>
                iss.input === undefined
                  ? 'Field is required.'
                  : 'Invalid input.',
            })
            .datetime(),
        ),
    })
    .refine((data) => data.startDate <= data.endDate, {
      message: 'Start date must be before or equal to end date',
      path: ['endDate'],
    }),
});

export type CreateDepositFormValues = z.infer<typeof createDepositSchema>;

// Deposit Filter form validation schema using Zod
export const depositFilterSchema = z
  .object({
    fromDate: z
      .date({
        error: (iss) =>
          iss.input === undefined ? 'Field is required.' : 'Invalid input.',
      })
      .or(
        z
          .string({
            error: (iss) =>
              iss.input === undefined ? 'Field is required.' : 'Invalid input.',
          })
          .datetime(),
      ),
    toDate: z
      .date({
        error: (iss) =>
          iss.input === undefined ? 'Field is required.' : 'Invalid input.',
      })
      .or(
        z
          .string({
            error: (iss) =>
              iss.input === undefined ? 'Field is required.' : 'Invalid input.',
          })
          .datetime(),
      ),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: 'From date must be before or equal to to date',
    path: ['toDate'],
  });

export type DepositFilterFormValues = z.infer<typeof depositFilterSchema>;
