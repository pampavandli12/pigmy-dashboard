import dayjs from 'dayjs';
import type { CreateDepositPayload } from '../types/Agent';
import type { CreateDepositInput } from './types';

// Banksoft and peocit build an identical deposit request payload from the form values.
export const buildCreateDepositPayload = ({
  agentCode,
  agentName,
  bankCode,
  formValues,
}: CreateDepositInput): CreateDepositPayload => ({
  name: agentName,
  agentCode,
  bankCode,
  depositingAmount: formValues.depositingAmount,
  voucherId: formValues.voucherId,
  from: dayjs(formValues.dateRange.startDate).format('YYYY-MM-DD'),
  to: dayjs(formValues.dateRange.endDate).format('YYYY-MM-DD'),
});
