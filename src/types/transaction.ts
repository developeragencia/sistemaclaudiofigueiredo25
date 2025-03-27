export interface Transaction {
  id: string;
  description: string;
  type: string;
  value: number;
  date: string;
  dueDate: string;
  status: string;
  documentNumber: string;
  clientId: string;
  clientName: string;
  processingDate: string | null;
  notes: string;
}

export type TransactionStatus = 'completed' | 'processing' | 'pending' | 'rejected';
export type TransactionType = 'IRRF' | 'PIS' | 'COFINS' | 'CSLL'; 