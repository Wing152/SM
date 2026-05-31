"use client";

import { useState, useEffect } from "react";
import { Button, Input, GlassCard } from "@/components/ui";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, Reply, MoreHorizontal } from "lucide-react";
import { cn } from "@/components/ui";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    displayName: string;
    profilePhoto: string | null;
    rank: string;
  };
  replies?: Comment[];
  _count?: { likes: number };
}

export function CommentSection({ predictionId }: { predictionId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const fetchComments = async () => {
    const res = await fetch(`/api/predictions/${predictionId}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [predictionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/predictions/${predictionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, parentId: replyTo }),
      });

      if (res.ok) {
        setNewComment("");
        setReplyTo(null);
        fetchComments();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none h-24"
          placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="absolute bottom-3 right-3 flex items-center space-x-2">
          {replyTo && (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-xs text-slate-500 hover:text-white mr-2"
            >
              Cancel Reply
            </button>
          )}
          <Button size="sm" isLoading={isSubmitting}>
            {replyTo ? "Reply" : "Comment"}
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={() => setReplyTo(comment.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CommentItem({ comment, onReply, isReply = false }: { comment: Comment; onReply: () => void; isReply?: boolean }) {
  return (
    <div className={cn("flex space-x-3", isReply && "ml-12 mt-4 pt-4 border-l-2 border-slate-800 pl-4")}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
        {comment.user.username[0].toUpperCase()}
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-white">{comment.user.displayName || comment.user.username}</span>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tight">{comment.user.rank}</span>
          <span className="text-[10px] text-slate-500">• {formatDistanceToNow(new Date(comment.createdAt))} ago</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{comment.content}</p>
        <div className="flex items-center space-x-4 pt-1">
          <button className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors">
            <Heart className="w-3.5 h-3.5" />
            <span>{comment._count?.likes || 0}</span>
          </button>
          <button
            onClick={onReply}
            className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors"
          >
            <Reply className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>
          <button className="text-slate-500 hover:text-white transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {comment.replies?.map((reply) => (
          <CommentItem key={reply.id} comment={reply} onReply={onReply} isReply={true} />
        ))}
      </div>
    </div>
  );
}
