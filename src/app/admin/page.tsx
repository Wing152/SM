"use client";

import { useState, useEffect } from "react";
import { GlassCard, Button } from "@/components/ui";
import { Shield, AlertTriangle, UserX, CheckCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReports(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Admin Control</h1>
          <p className="text-slate-400">Manage community standards and resolve disputes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Pending Reports
          </h2>

          {reports.length === 0 ? (
            <GlassCard className="p-12 text-center text-slate-500 italic">
              All clear! No pending reports to review.
            </GlassCard>
          ) : (
            reports.map(report => (
              <GlassCard key={report.id} className="p-6 border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 mb-2 inline-block">
                      {report.targetType}
                    </span>
                    <h3 className="text-lg font-bold text-white">{report.reason}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Reported by @{report.reporter.username} • {formatDistanceToNow(new Date(report.createdAt))} ago
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400">
                      <CheckCircle className="w-4 h-4 mr-2" /> Dismiss
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-500/30 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50 text-sm text-slate-400 italic">
                  "Target Content Placeholder: In a real app, we would fetch and display the reported prediction or comment here."
                </div>
              </GlassCard>
            ))
          )}
        </div>

        <div className="space-y-8">
          <GlassCard className="p-8 border-amber-500/20">
            <h3 className="text-lg font-bold text-white mb-4">Admin Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium">Active Users</span>
                <span className="text-sm font-bold text-white">1,284</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium">Predictions today</span>
                <span className="text-sm font-bold text-white">+142</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium">Banned accounts</span>
                <span className="text-sm font-bold text-red-500">12</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-blue-500/20 bg-blue-600/5">
            <h3 className="text-lg font-bold text-white mb-2">System Health</h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">Database and real-time socket connections are stable.</p>
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Operational
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
