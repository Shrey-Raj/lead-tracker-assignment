import axios from 'axios';
import { Lead, CreateLeadPayload, LeadStatus, MetricsData, ApiResponse } from '@/types/lead';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1/leads',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.error || 'Something went wrong. Please try again.';
  }
  return 'An unexpected error occurred.';
};

// 1. Fetch Leads (List or Search)
export const fetchLeads = async (searchQuery?: string): Promise<ApiResponse<Lead[]>> => {
    console.log("Fetching leads .....");
  if (searchQuery && searchQuery.trim().length > 0) {
    const response = await API.get<ApiResponse<Lead[]>>('/seach', {
      params: { query: searchQuery },
    });
    return response.data;
  }

  const response = await API.get<ApiResponse<Lead[]>>('/list');
  return response.data;
};

// 2. Fetch Lead Metrics (GET /api/v1/leads/metrics)
export const fetchMetrics = async (): Promise<ApiResponse<MetricsData>> => {
  const response = await API.get<ApiResponse<MetricsData>>('/metrics');
  return response.data;
};

// 3. Create Lead (POST /api/v1/leads/create)
export const createLead = async (payload: CreateLeadPayload): Promise<ApiResponse<Lead>> => {
  const response = await API.post<ApiResponse<Lead>>('/create', payload);
  return response.data;
};

// 4. Update Lead Status (PATCH /api/v1/leads/updateStatus?leadId=...)
export const updateLeadStatus = async (
  leadId: string,
  status: LeadStatus
): Promise<ApiResponse<Lead>> => {
  const response = await API.patch<ApiResponse<Lead>>(
    '/updateStatus',
    { status },
    { params: { leadId } }
  );
  return response.data;
};