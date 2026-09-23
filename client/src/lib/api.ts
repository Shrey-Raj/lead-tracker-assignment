import axios from 'axios';
import { Lead, CreateLeadPayload, LeadStatus, MetricsResponse, ApiResponse, LeadListResponse, MetricsData } from '@/types/lead';

const API = axios.create({
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

export const fetchLeads = async (searchQuery?: string): Promise<ApiResponse<LeadListResponse>> => {
    console.log("Fetching leads .....");
  if (searchQuery && searchQuery.trim().length > 0) {
    const response = await API.get<ApiResponse<LeadListResponse>>('/search', {
      params: { query: searchQuery },
    });
    return response.data;
  }

  const response = await API.get<ApiResponse<LeadListResponse>>('/list');
  return response.data;
};

export const fetchMetrics = async (): Promise<ApiResponse<MetricsResponse>> => {
  const response = await API.get<ApiResponse<MetricsResponse>>('/metrics');
  return response.data;
};

export const createLead = async (payload: CreateLeadPayload): Promise<ApiResponse<Lead>> => {
  const response = await API.post<ApiResponse<Lead>>('/create', payload);
  return response.data;
};

export const updateLeadStatus = async (
  leadId: string,
  status: LeadStatus
): Promise<ApiResponse<Lead>> => {
  const response = await API.patch<ApiResponse<Lead>>(
    '/update-status',
    { status },
    { params: { leadId } }
  );
  return response.data;
};