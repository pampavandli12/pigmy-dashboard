import { describe, expect, it } from 'vitest';
import {
  addAgentSchema,
  createDepositSchema,
  depositFilterSchema,
  loginSchema,
} from '../../src/utils/formSchemas';

describe('formSchemas', () => {
  it('validates login, agent, and deposit forms', () => {
    expect(
      loginSchema.safeParse({
        bankCode: 'BK',
        userName: 'admin',
        password: 'secret1',
      }).success,
    ).toBe(true);
    expect(
      loginSchema.safeParse({ bankCode: 'B', userName: 'a', password: '123' })
        .success,
    ).toBe(false);

    expect(
      addAgentSchema.parse({
        name: 'Ravi Kumar',
        address: 'MG Road',
        password: 'secret1',
        phone: '9876543210',
        email: 'ravi@example.com',
        agentCode: '101',
        type: 'agent',
        limitAmount: '2500',
      }),
    ).toMatchObject({ agentCode: 101, limitAmount: 2500, status: 'active' });
    expect(addAgentSchema.safeParse({}).success).toBe(false);

    expect(
      createDepositSchema.safeParse({
        depositingAmount: '1500',
        voucherId: 'V-1',
        dateRange: {
          startDate: '2026-04-01T00:00:00.000Z',
          endDate: '2026-04-02T00:00:00.000Z',
        },
      }).success,
    ).toBe(true);
    expect(
      createDepositSchema.safeParse({
        depositingAmount: 0,
        voucherId: '',
        dateRange: {
          startDate: new Date('2026-04-03'),
          endDate: new Date('2026-04-02'),
        },
      }).success,
    ).toBe(false);
    expect(
      createDepositSchema.safeParse({
        depositingAmount: 10,
        voucherId: 'V-2',
        dateRange: {
          startDate: 123,
          endDate: undefined,
        },
      }).success,
    ).toBe(false);

    expect(
      depositFilterSchema.safeParse({
        fromDate: '2026-04-03T00:00:00.000Z',
        toDate: '2026-04-01T00:00:00.000Z',
      }).success,
    ).toBe(false);
    expect(depositFilterSchema.safeParse({}).success).toBe(false);
  });
});

