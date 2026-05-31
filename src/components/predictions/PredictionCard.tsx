"use client";

import { useState } from "react";
import { GlassCard, Button } from "@/components/ui";
import { MessageSquare, ThumbsUp, ThumbsDown, Share2, Award, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/components/ui";

interface PredictionCardProps {
  prediction: {
    id: string;
    title: string;
    explanation: string;
    category: string;
    confidence: number;
    targetDate: string;
    status: string;
    createdAt: string;
    user: {
      username: string;
      displayName: string | null;
      trustScore: number;
      rank: string;
      profilePhoto: string | null;
    };
    _count?: {
      votes: number;
      comments: number;
    };
  };
  userVote?: "SUPPORT" | "OPPOSE" | null;
}

export function PredictionCard({ prediction, userVote: initialVote }: PredictionCardProps) {
  const [userVote, setUserVote] = useState<string | null>(initialVote || null);
  const [voteCount, setVoteCount] = useState(prediction._count?.votes || 0);

  const handleVote = async (type: "SUPPORT" | "OPPOSE") => {
    const isRemoving = userVote === type;

    try {
      const res = await fetch(`/api/predictions/${prediction.id}/vote`, {
        method: isRemoving ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        ...(!isRemoving && { body: JSON.stringify({ type }) }),
      });

      if (res.ok) {
        if (isRemoving) {
          setUserVote(null);
          setVoteCount(prev => prev - 1);
        } else {
          if (!userVote) setVoteCount(prev => prev + 1);
          setUserVote(type);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GlassCard className="mb-6 group hover:border-slate-700 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold border border-white/10">
              {prediction.user.username[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white">{prediction.user.displayName || prediction.user.username}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider">
                  {prediction.user.rank}
                </span>
              </div>
              <span className="text-xs text-slate-500">@{prediction.user.username}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Trust Score</div>
            <div className="text-sm font-black text-blue-500">{prediction.user.trustScore.toFixed(1)}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter px-2 py-0.5 rounded bg-blue-500/5 border border-blue-500/10">
              {prediction.category}
            </span>
            {prediction.status !== "PENDING" && (
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded border flex items-center",
                prediction.status === "CORRECT" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-red-500/5 border-red-500/20 text-red-400"
              )}>
                {prediction.status === "CORRECT" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                {prediction.status}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-tight">
            {prediction.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
            {prediction.explanation}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900/50 rounded-2xl p-3 border border-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Calendar className="w-3 h-3 mr-1 text-blue-500" /> Target Date
            </div>
            <div className="text-sm font-semibold text-slate-200">
              {format(new Date(prediction.targetDate), "MMM d, yyyy")}
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-2xl p-3 border border-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Award className="w-3 h-3 mr-1 text-purple-500" /> Confidence
            </div>
            <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {prediction.confidence}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/30">
          <div className="flex items-center space-x-1 sm:space-x-4">
            <button
              onClick={() => handleVote("SUPPORT")}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all border",
                userVote === "SUPPORT"
                  ? "bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]"
                  : "bg-slate-900/40 border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/30"
              )}
            >
              <ThumbsUp className={cn("w-4 h-4", userVote === "SUPPORT" && "fill-blue-400")} />
              <span className="text-xs font-bold">{voteCount}</span>
            </button>
            <button
              onClick={() => handleVote("OPPOSE")}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all border",
                userVote === "OPPOSE"
                  ? "bg-red-600/10 border-red-500/50 text-red-400 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]"
                  : "bg-slate-900/40 border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/30"
              )}
            >
              <ThumbsDown className={cn("w-4 h-4", userVote === "OPPOSE" && "fill-red-400")} />
            </button>
            <button className="flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all text-slate-500 hover:text-blue-400 hover:bg-blue-500/5">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-bold">{prediction._count?.comments || 0}</span>
            </button>
          </div>
          <button className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/50 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
