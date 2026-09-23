export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  DISQUALIFIED = 'Disqualified',
  CONVERTED = 'Converted'
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

export interface MetricsData {
  activeLeads: number;
  convertedLeads: number;
  qualifiedLeads: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}