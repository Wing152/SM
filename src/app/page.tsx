"use client";

import { useState } from "react";
import { InfiniteFeed } from "@/components/feed/InfiniteFeed";
import { GlassCard, Button } from "@/components/ui";
import { Plus, Flame, TrendingUp, Sparkles } from "lucide-react";
import { CreatePredictionModal } from "@/components/predictions/CreatePredictionModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="py-8 px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" /> Global Timeline
            </h1>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> Forecast
            </Button>
          </div>
          <InfiniteFeed />
        </div>

        <div className="hidden xl:block w-80 space-y-8">
          <GlassCard className="p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" /> Trending Now
            </h3>
            <div className="space-y-4">
              {[
                { title: "BTC to $150k by EOFY", count: 124 },
                { title: "GPT-5 Release Date", count: 89 },
                { title: "SpaceX Mars Landing", count: 56 },
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">#${i+1} Trending</div>
                  <div className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{item.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">{item.count} forecasts</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-blue-500/20 bg-blue-600/5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Oracle Rank
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
              You are in the top 12% of forecasters this month. Keep it up!
            </p>
            <Button variant="outline" size="sm" className="w-full text-[10px] h-9">View Leaderboard</Button>
          </GlassCard>
        </div>
      </div>

      <CreatePredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
