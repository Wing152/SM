"use client";

import { useSession } from "next-auth/react";
import { GlassCard, Button } from "@/components/ui";
import { TrendingUp, Target, Zap, Award, BarChart3 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const { data: session } = useSession();

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        fill: true,
        label: "Trust Score",
        data: [50, 55, 52, 65, 72, 78],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: "rgba(255,255,255,0.05)" as any }, ticks: { color: "#64748b" } },
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-white mb-8 tracking-tight">Performance Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Accuracy", value: "74.2%", icon: Target, color: "text-emerald-500" },
          { label: "Current Streak", value: "12", icon: Zap, color: "text-amber-500" },
          { label: "Trust Score", value: "88.5", icon: TrendingUp, color: "text-blue-500" },
          { label: "Global Rank", value: "#412", icon: Award, color: "text-purple-500" },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live</span>
            </div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter mt-1">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" /> Trust Score Growth
            </h3>
            <select className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400 focus:outline-none">
              <option>Last 6 Months</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="h-80">
            <Line data={data} options={options as any} />
          </div>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-500" /> Category Strengths
            </h3>
            <div className="space-y-4">
              {[
                { name: "Technology", score: 92, color: "bg-blue-500" },
                { name: "Finance", score: 68, color: "bg-emerald-500" },
                { name: "Sports", score: 45, color: "bg-amber-500" },
              ].map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-300">{cat.name}</span>
                    <span className="text-slate-500">{cat.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color}`} style={{ width: `${cat.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8 bg-blue-600/5 border-blue-500/20">
            <h3 className="text-lg font-bold text-white mb-2">Upgrade to Pro</h3>
            <p className="text-sm text-slate-400 mb-6">Get deep insights and advanced forecasting signals.</p>
            <Button className="w-full">View Plans</Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
