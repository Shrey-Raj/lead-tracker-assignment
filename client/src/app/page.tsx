import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Nav */}
      <header className="w-full px-6 md:px-10 lg:px-14 py-6 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-3">
        <Image src="/leadtracker.png" width={50} height={50} alt="Lead tracker logo"/>
          Lead Tracker
        </span>
        <Button variant="outline" size="sm" className="transition-all duration-200 hover:shadow-sm">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <div className="w-full px-6 md:px-10 lg:px-14 py-12 md:py-0 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left: copy + CTA */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1] max-w-md">
              Every lead, tracked from first hello to closed deal.
            </h1>
            <p className="mt-5 text-base text-gray-500 max-w-sm leading-relaxed">
              See who's new, who's in progress, and who's ready to close, 
              all in one place, updated as it happens.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group p-5"
              >
                <Link href="/dashboard" className="flex text-lg">
                  Go to Dashboard 🚀
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: funnel visual, colors match MetricCards' semantic system */}
          <div className="animate-in fade-in zoom-in-95 duration-700 delay-150 flex justify-center lg:justify-end">
            <div className="flex flex-col items-center gap-1.5 w-full max-w-xs">
              <div className="w-full">
                <div className="h-14 rounded-t-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-semibold text-white">New leads in</span>
                </div>
              </div>
              <div className="w-[82%]">
                <div className="h-14 bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-semibold text-white">Working the pipeline</span>
                </div>
              </div>
              <div className="w-[62%]">
                <div className="h-14 rounded-b-xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-semibold text-white">Converted</span>
                </div>
              </div>
              <div className="w-[40%] mt-2 self-end mr-2">
                <div className="h-8 rounded-lg bg-gradient-to-br from-rose-400 to-rose-300 flex items-center justify-center shadow-sm opacity-90">
                  <span className="text-[10px] font-semibold text-white">Disqualified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 md:px-10 lg:px-14 py-6 text-xs text-gray-400">
        Built for teams who don't want to lose track of a lead.
      </footer>
    </div>
  );
}