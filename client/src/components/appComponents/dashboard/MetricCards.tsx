import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCardsProps } from "@/types/lead";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CheckCircle2,
  Award,
  DollarSign,
} from "lucide-react";


export default function MetricCards({ metrics, isLoading }: MetricCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, idx) => (
          <Card key={idx} className="shadow-sm border-gray-100 rounded-2xl">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: metrics?.totalInflow?.title || "Total Inflow",
      value: metrics?.totalInflow?.displayValue || "0",
      change: `${metrics?.totalInflow?.raw?.percentage ?? 0}%`,
      isPositive: (metrics?.totalInflow?.raw?.percentage ?? 0) >= 0,
      subText: metrics?.totalInflow?.subValue || "Total leads received",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600",
      ring: "group-hover:ring-blue-100",
    },
    {
      title: metrics?.activePipeline?.title || "Active Pipeline",
      value: metrics?.activePipeline?.displayValue || "0",
      change: `${metrics?.activePipeline?.raw?.percentage ?? 0}%`,
      isPositive: (metrics?.activePipeline?.raw?.percentage ?? 0) >= 0,
      subText: metrics?.activePipeline?.subValue || "Currently in progress",
      icon: CheckCircle2,
      iconBg: "bg-amber-50 text-amber-600",
      ring: "group-hover:ring-amber-100",
    },
    {
      title: metrics?.conversionRate?.title || "Conversion Rate",
      value: metrics?.conversionRate?.displayValue || "0%",
      change: `${metrics?.conversionRate?.raw?.percentage ?? 0}%`,
      isPositive: (metrics?.conversionRate?.raw?.percentage ?? 0) >= 0,
      subText: metrics?.conversionRate?.subValue || "Leads won",
      icon: Award,
      iconBg: "bg-emerald-50 text-emerald-600",
      ring: "group-hover:ring-emerald-100",
    },
    {
      title: metrics?.disqualificationRate?.title || "Disqualification Rate",
      value: metrics?.disqualificationRate?.displayValue || "0%",
      change: `${metrics?.disqualificationRate?.raw?.percentage ?? 0}%`,
      isPositive: (metrics?.disqualificationRate?.raw?.percentage ?? 0) <= 0, // Lower disqualification rate is positive
      subText: metrics?.disqualificationRate?.subValue || "Leads disqualified",
      icon: DollarSign,
      iconBg: "bg-rose-50 text-rose-600",
      ring: "group-hover:ring-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className="group shadow-sm border-gray-100 rounded-2xl transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">
                  {item.title}
                </span>
                <div
                  className={`p-2 rounded-xl ${item.iconBg} ring-4 ring-transparent transition-all duration-200 ${item.ring} group-hover:scale-105`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  {item.value}
                </span>
                <span
                  className={`flex items-center text-xs font-semibold transition-colors ${
                    item.isPositive
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-rose-600 bg-rose-50"
                  } px-1.5 py-0.5 rounded-md`}
                >
                  {item.isPositive ? (
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  )}
                  {item.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {item.subText}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}