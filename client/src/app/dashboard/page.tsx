"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLeads, fetchMetrics, createLead, updateLeadStatus, getErrorMessage } from "@/lib/api";
import MetricCards from "@/components/appComponents/dashboard/MetricCards";
import LeadTable from "@/components/appComponents/dashboard/LeadTable";
import AddLeadModal from "@/components/appComponents/dashboard/AddLeadModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Upload, Download } from "lucide-react";
import { LeadStatus } from "@/types/lead";
import { toast } from "sonner";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("================== [DASHBOARD RENDER] ==================");
  console.log("[Dashboard] Current Search Term:", search);

  // 1. Fetch Leads Query
  const { 
    data: leadsData, 
    isLoading: isLeadsLoading, 
    isError: isLeadsError, 
    error: leadsError,
    status: leadsQueryStatus
  } = useQuery({
    queryKey: ["leads", search],
    queryFn: async () => {
      console.log("🚀 [useQuery: fetchLeads] START - Fetching leads with search:", search);
      try {
        const response = await fetchLeads(search);
        console.log("✅ [useQuery: fetchLeads] SUCCESS - Response received:", response);
        return response;
      } catch (err) {
        console.error("❌ [useQuery: fetchLeads] ERROR - Fetch failed:", err);
        throw err;
      }
    },
  });

  // 2. Fetch Metrics Query
  const { 
    data: metricsData, 
    isLoading: isMetricsLoading,
    status: metricsQueryStatus
  } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      console.log("🚀 [useQuery: fetchMetrics] START - Fetching metrics");
      try {
        const response = await fetchMetrics();
        console.log("✅ [useQuery: fetchMetrics] SUCCESS - Response received:", response);
        return response;
      } catch (err) {
        console.error("❌ [useQuery: fetchMetrics] ERROR - Fetch failed:", err);
        throw err;
      }
    },
  });

  console.log("[Dashboard State] Leads Query Status:", leadsQueryStatus, "| isLoading:", isLeadsLoading);
  console.log("[Dashboard State] Leads Raw Data Object:", leadsData);
  console.log("[Dashboard State] Metrics Query Status:", metricsQueryStatus, "| isLoading:", isMetricsLoading);

  // Handle toast notifications safely inside useEffect
  useEffect(() => {
    if (isLeadsError) {
      console.error("[Dashboard Effect] Leads fetch error detected:", leadsError);
      toast.error("Failed to load leads", {
        description: getErrorMessage(leadsError),
      });
    }
  }, [isLeadsError, leadsError]);

  // 3. Create Lead Mutation
  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      toast.success("Lead created successfully!");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error("Failed to create lead", {
        description: getErrorMessage(err),
      });
    },
  });

  // 4. Update Lead Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: LeadStatus }) =>
      updateLeadStatus(leadId, status),
    onSuccess: () => {
      toast.success("Lead status updated!");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
    onError: (err) => {
      toast.error("Failed to update status", {
        description: getErrorMessage(err),
      });
    },
  });

  console.log("LEADS DATA  = ", leadsData);
  // Extract array safely and log extracted array length
  const leads = Array.isArray(leadsData?.data?.leads) ? leadsData.data.leads : [];
  const metrics = metricsData?.data;

  console.log("[Dashboard State] Extracted Leads Array:", leads);
  console.log("[Dashboard State] Extracted Leads Count:", leads.length);
  console.log("========================================================");

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good Morning, Rohit! 👋</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening with your sales today.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 shadow-sm">
            <Upload className="w-4 h-4" /> Import
          </Button>
          <Button variant="outline" className="gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
            <Plus className="w-4 h-4" /> Add New
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search leads by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white shadow-sm"
        />
      </div>

      {/* Metric Summary Cards */}
      <MetricCards metrics={metrics} isLoading={isMetricsLoading} />

      {/* Lead Data Table */}
      {isLeadsLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading leads...</div>
      ) : (
        <LeadTable
          leads={leads}
          onStatusChange={(leadId, status) => updateStatusMutation.mutate({ leadId, status })}
        />
      )}

      {/* Add Lead Dialog */}
      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(payload) => createMutation.mutate(payload)}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}