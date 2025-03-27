
// Define status types used across the application

export type StatusType = 
  | 'PENDING'
  | 'PROCESSING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CANCELED'
  | 'COMPLETED'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'ANALYZING'
  | 'RECOVERED';

export interface Declaration {
  id: string;
  title: string;
  description?: string;
  status: StatusType;
  createdAt: string;
  updatedAt?: string;
  clientId: string;
  clientName: string;
  documentNumber: string;
  fiscalYear: string;
  fiscalPeriod: string;
  deadline?: string;
  assignedTo?: string;
  taxType: string;
  amount?: number;
  attachmentsCount: number;
}

// Add missing types needed for other components
export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  downloadUrl: string;
  // Add properties needed by AttachmentsCard
  name: string;
  size: string;
  date: string;
}

export interface HistoryItem {
  id: string;
  action: string;
  date: string;
  user: string;
  details?: string;
  status?: StatusType; // Keep as optional to maintain compatibility
}

export type DeclarationType = 'TAX_RETURN' | 'FINANCIAL_STATEMENT' | 'AUDIT_REPORT' | 'REGULATORY_FILING';

// Add a new interface for declaration details
export interface DeclarationDetails {
  id: string;
  title: string; // Add title field for DeclarationDetail page
  type: string;
  status: StatusType;
  periodName: string;
  fiscalYear: string;
  dueDate: string;
  submissionDate?: string;
  protocol: string;
  amount: string;
  taxOffice: string;
  submittedBy: string;
  company: string;
  cnpj: string;
  attachments: Attachment[];
  history: HistoryItem[];
}
