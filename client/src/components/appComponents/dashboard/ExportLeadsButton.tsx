"use client";

import Papa from "papaparse";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Lead } from "@/types/lead";

interface ExportLeadsButtonProps {
  leads: Lead[];
  disabled?: boolean;
}

export default function ExportLeadsButton({ leads, disabled }: ExportLeadsButtonProps) {
  const handleExport = () => {
    if (!leads.length) {
      toast.error("No leads to export");
      return;
    }

    const rows = leads.map((lead: any) => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone,
      Status: lead.status,
      "Created At": lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "",
    }));

    const csv = Papa.unparse(rows);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const timestamp = new Date().toISOString().slice(0, 10);

    saveAs(blob, `leads-export-${timestamp}.csv`);
    toast.success(`Exported ${leads.length} lead${leads.length === 1 ? "" : "s"}`);
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={disabled || leads.length === 0}
      className="gap-2 shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5 cursor-pointer"
    >
      <Download className="w-4 h-4" /> Export
    </Button>
  );
}