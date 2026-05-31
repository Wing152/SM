"use client";

import { useState, useEffect } from "react";
import { GlassCard, Button, Input } from "@/components/ui";
import { Users, Plus, TrendingUp, Search } from "lucide-react";
import Link from "next/link";

interface Community {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  _count: { members: number; predictions: number };
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/communities")
      .then(res => res.json())
      .then(data => setCommunities(data));
  }, []);

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Communities</h1>
          <p className="text-slate-400">Join specialized groups to share and track specific forecasts.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-64"
              placeholder="Search communities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Create
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(community => (
          <Link key={community.id} href={`/communities/${community.id}`}>
            <GlassCard className="h-full hover:border-blue-500/50 transition-all duration-300 cursor-pointer group">
              <div className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{community.name}</h2>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                  {community.description || "A group of forecasters focused on predicting the future of " + community.name}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Members</div>
                      <div className="text-sm font-bold text-white">{community._count.members}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Predictions</div>
                      <div className="text-sm font-bold text-white">{community._count.predictions}</div>
                    </div>
                  </div>
                  <div className="text-blue-500 group-hover:translate-x-1 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
