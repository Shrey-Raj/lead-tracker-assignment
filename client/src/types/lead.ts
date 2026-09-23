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


export interface LeadListResponse{
  leads: Lead[]
}


export interface MetricCardProperties {
  title: string;
  displayValue: string;
  subValue: string;
  raw: {
    percentage: number;
    total: number;
  };
}

export interface MetricsData {
  totalInflow: MetricCardProperties,
  activePipeline: MetricCardProperties,
  conversionRate: MetricCardProperties,
  disqualificationRate: MetricCardProperties
}

export interface MetricsResponse{
  metrics: MetricsData
}

export interface MetricCardsProps {
  metrics?: MetricsData;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}