"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLeads, fetchMetrics, createLead, updateLeadStatus, getErrorMessage } from "@/lib/api";
import ExportLeadsButton from "@/components/appComponents/dashboard/ExportLeadsButton";
import MetricCards from "@/components/appComponents/dashboard/MetricCards";
import LeadTable from "@/components/appComponents/dashboard/LeadTable";
import AddLeadModal from "@/components/appComponents/dashboard/AddLeadModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Download, Loader2 } from "lucide-react";
import { Lead, LeadStatus } from "@/types/lead";
import { toast } from "sonner";


export default function Dashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    data: leadsData, 
    isLoading: isLeadsLoading, 
    isError: isLeadsError, 
    error: leadsError,
    status: leadsQueryStatus
  } = useQuery({
    queryKey: ["leads", search],
    queryFn: async () => {
      return fetchLeads(search);
    },
  });

  const { 
    data: metricsData, 
    isLoading: isMetricsLoading,
    status: metricsQueryStatus
  } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      return fetchMetrics();
    },
  });

  useEffect(() => {
    if (isLeadsError) {
      toast.error("Failed to load leads", {
        description: getErrorMessage(leadsError),
      });
    }
  }, [isLeadsError, leadsError]);

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

  const leads = Array.isArray(leadsData?.data?.leads) ? leadsData.data.leads : [];
  const metrics = metricsData?.data?.metrics ;

  return (
    <div className="min-h-screen w-full bg-gray-50/50 p-6 md:p-10 lg:px-14">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, User👋</h1>
          <p className="text-sm text-muted-foreground">Track down your leads below.</p>
        </div>

        <div className="flex items-center gap-3">
          <ExportLeadsButton leads={leads} disabled={isLeadsLoading} />
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New
          </Button>
        </div>
      </div>

      <MetricCards metrics={metrics} isLoading={isMetricsLoading} />

      <div className="relative mb-6 max-w-xl">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground transition-colors" />
        <Input
          type="text"
          placeholder="Search leads by name, email, status or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white shadow-sm transition-shadow duration-200 focus-visible:shadow-md"
        />
      </div>

      {isLeadsLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span className="text-sm">Loading leads...</span>
        </div>
      ) : (
        <LeadTable
          leads={leads}
          onStatusChange={(leadId, status) => updateStatusMutation.mutate({ leadId, status })}
        />
      )}

      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(payload) => createMutation.mutate(payload)}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}