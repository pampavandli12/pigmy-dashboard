export interface ReportReponse {
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
  from: string;
  to: string;
  agent: string;
  schemeType: string;
  collectionStatus: string;
}

//http://localhost:1002/pigmy/v1/transaction/search?bankCode=AGT123&from=2026-06-19&to=2026-06-21&agent=ALL&schemeType=Pigmy
