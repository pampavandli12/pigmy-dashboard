import { banksoftHandler } from './banksoft';
import { peocitHandler } from './peocit';
import type { BankType, BankTypeHandler } from './types';

export const DEFAULT_BANK_TYPE: BankType = 'banksoft';

const bankTypeHandlers: Record<BankType, BankTypeHandler> = {
  banksoft: banksoftHandler,
  peocit: peocitHandler,
};

// Sessions persisted before bankType existed have it as null, so fall back to the default.
export const getBankTypeHandler = (
  bankType: string | null,
): BankTypeHandler => {
  const type = bankType ?? DEFAULT_BANK_TYPE;
  const handler = bankTypeHandlers[type as BankType];
  if (!handler) {
    throw new Error(`Unsupported bank type: ${type}`);
  }
  return handler;
};
