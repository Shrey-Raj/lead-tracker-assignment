import { Lead, LeadStatus } from "@/types/lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
}

const statusBadgeStyles: Record<string, string> = {
  New: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Contacted: "bg-blue-50 text-blue-700 border-blue-200",
  Qualified: "bg-purple-50 text-purple-700 border-purple-200",
  Disqualified: "bg-rose-50 text-rose-700 border-rose-200",
  Converted: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function LeadTable({ leads, onStatusChange }: LeadTableProps) {
  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="px-6 py-4 border-b border-gray-100">
        <CardTitle className="text-base font-semibold text-gray-900">Recent Leads</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="px-6">Lead Name</TableHead>
              <TableHead className="px-6">Email</TableHead>
              <TableHead className="px-6">Phone</TableHead>
              <TableHead className="px-6">Status</TableHead>
              <TableHead className="px-6">Created At</TableHead>
              <TableHead className="px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No leads found. Add your first lead to get started.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => {
                const initials = lead.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <TableRow key={lead._id} className="hover:bg-gray-50/50 transition">
                    <TableCell className="px-6 py-4 font-medium flex items-center gap-3">
                      <Avatar className="w-8 h-8 bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                        <AvatarFallback className="bg-purple-100 text-purple-700">{initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-gray-900">{lead.name}</span>
                    </TableCell>
                    <TableCell className="px-6 text-muted-foreground">{lead.email}</TableCell>
                    <TableCell className="px-6 text-muted-foreground">{lead.phone}</TableCell>
                    <TableCell className="px-6">
                      <Select
                        value={lead.status}
                        onValueChange={(val) => onStatusChange(lead._id, val as LeadStatus)}
                      >
                        <SelectTrigger className={`w-[130px] h-8 text-xs font-medium rounded-full ${statusBadgeStyles[lead.status]}`}>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(LeadStatus).map((st) => (
                            <SelectItem key={st} value={st} className="text-xs">
                              {st}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="px-6 text-muted-foreground text-xs">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}