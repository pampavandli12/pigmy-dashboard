import { banksoftHandler } from './banksoft';
import { peocitHandler } from './peocit';
import type { BankTypeHandler } from './types';

export const DEFAULT_BANK_TYPE = 'banksoft';

const bankTypeHandlers: Record<string, BankTypeHandler> = {
  banksoft: banksoftHandler,
  peocit: peocitHandler,
};

// Sessions persisted before bankType existed have it as null, so fall back to the default.
export const getBankTypeHandler = (bankType: string | null): BankTypeHandler => {
  const type = bankType ?? DEFAULT_BANK_TYPE;
  const handler = bankTypeHandlers[type];
  if (!handler) {
    throw new Error(`Unsupported bank type: ${type}`);
  }
  return handler;
};
