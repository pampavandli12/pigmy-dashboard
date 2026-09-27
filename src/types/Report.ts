export interface ReportResponse {
  accountNumber: number;
  customerName: string;
  collectedAmount: number;
  schemeName: string;
  status: string;
  agentName: string;
  collectedDate: string;
}
export interface ReportPayload {
  bankCode: string;
  // 'ALL' sentinel or a specific enum value.
  from: string;
  to: string;
  agent: string;
  schemeType: string;
  collectionStatus: string;
}
