"use client";

import { useState, useEffect } from "react";
import { Bell, Award, ThumbsUp, MessageSquare, UserCheck } from "lucide-react";
import { GlassCard } from "@/components/ui";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/components/ui";

interface Notification {
  id: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  link: string | null;
}

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => Array.isArray(data) && setNotifications(data))
      .catch(() => {});
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "SUPPORT": return <ThumbsUp className="w-4 h-4 text-blue-500" />;
      case "COMMENT": return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case "ACHIEVEMENT": return <Award className="w-4 h-4 text-amber-500" />;
      case "FOLLOW": return <UserCheck className="w-4 h-4 text-emerald-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllRead(); }}
        className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-slate-950" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <GlassCard className="absolute right-0 mt-2 w-80 max-h-[480px] z-50 overflow-hidden shadow-2xl border-slate-700">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white">Notifications</h3>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Recent Activity</span>
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm italic">
                  No notifications yet.
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer flex gap-3",
                      !n.isRead && "bg-blue-500/5"
                    )}
                  >
                    <div className="mt-1">{getIcon(n.type)}</div>
                    <div>
                      <p className="text-sm text-slate-200 leading-snug">{n.content}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">
                        {formatDistanceToNow(new Date(n.createdAt))} ago
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
