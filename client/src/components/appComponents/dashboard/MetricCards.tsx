import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Users, CheckCircle2, Award, DollarSign } from "lucide-react";
import { MetricsData } from "@/types/lead";

interface MetricCardsProps {
  metrics?: MetricsData;
  isLoading: boolean;
}

export default function MetricCards({ metrics, isLoading }: MetricCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: "$48,750",
      change: "+12.5%",
      isPositive: true,
      subText: "vs. $43,320 last month",
      icon: DollarSign,
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      title: "Active Leads",
      value: isLoading ? "..." : (metrics?.activeLeads ?? 0).toString(),
      change: "+8.2%",
      isPositive: true,
      subText: "Total non-converted leads",
      icon: Users,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Qualified Leads",
      value: isLoading ? "..." : (metrics?.qualifiedLeads ?? 0).toString(),
      change: "+5.1%",
      isPositive: true,
      subText: "Ready for conversion",
      icon: Award,
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      title: "Converted Deals",
      value: isLoading ? "..." : (metrics?.convertedLeads ?? 0).toString(),
      change: "+14.2%",
      isPositive: true,
      subText: "Successfully closed",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="shadow-sm border-gray-100">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">{item.title}</span>
                <div className={`p-2 rounded-xl ${item.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                <span
                  className={`flex items-center text-xs font-semibold ${
                    item.isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                  } px-1.5 py-0.5 rounded-md`}
                >
                  {item.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {item.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{item.subText}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}