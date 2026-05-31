"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, User, Sparkles, Users } from "lucide-react";
import { GlassCard } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setLoading(true);
      fetch(`/api/search?q=${debouncedQuery}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        });
    } else {
      setResults(null);
    }
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
        <input
          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          placeholder="Search predictions, people, communities..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
        />
        {loading && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />}
      </div>

      {isOpen && results && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <GlassCard className="absolute top-full mt-2 w-full z-50 border-slate-700 shadow-2xl overflow-hidden">
            <div className="max-h-[480px] overflow-y-auto">
              {results.predictions?.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Predictions</div>
                  {results.predictions.map((p: any) => (
                    <div
                      key={p.id}
                      onClick={() => { router.push(`/predictions/${p.id}`); setIsOpen(false); }}
                      className="p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><Sparkles className="w-4 h-4 text-blue-400" /></div>
                      <div className="text-sm text-slate-200 font-medium truncate">{p.title}</div>
                    </div>
                  ))}
                </div>
              )}
              {results.users?.length > 0 && (
                <div className="p-2 border-t border-slate-800/50">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">People</div>
                  {results.users.map((u: any) => (
                    <div
                      key={u.id}
                      onClick={() => { router.push(`/profile/${u.username}`); setIsOpen(false); }}
                      className="p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><User className="w-4 h-4 text-slate-400" /></div>
                      <div>
                        <div className="text-sm text-slate-200 font-bold">@{u.username}</div>
                        <div className="text-[10px] text-blue-500 font-bold">Trust Score: {u.trustScore.toFixed(1)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
