"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { GlassCard, Button, Input } from "@/components/ui";
import { Send, User, Search } from "lucide-react";
import { cn } from "@/components/ui";
import { useSocket } from "@/hooks/use-socket";

export default function MessagesPage() {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser) {
      fetch(`/api/messages?userId=${selectedUser}`)
        .then(res => res.json())
        .then(data => setMessages(data));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (msg: any) => {
        if (msg.senderId === selectedUser || msg.receiverId === selectedUser) {
          setMessages(prev => [...prev, msg]);
        }
      });
    }
  }, [socket, selectedUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: selectedUser, content: input }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-100px)]">
      <div className="flex h-full gap-6">
        {/* Sidebar */}
        <GlassCard className="w-80 h-full hidden md:flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="Search chats..."
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {/* Chat list would go here */}
             <div className="p-4 text-center text-slate-500 text-sm">Select a user to start chatting</div>
          </div>
        </GlassCard>

        {/* Chat Area */}
        <GlassCard className="flex-1 h-full flex flex-col relative">
          {!selectedUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
               <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                 <Send className="w-8 h-8 text-slate-500" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Your Messages</h3>
               <p className="text-slate-400">Send private predictions and messages to your friends.</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">U</div>
                  <div>
                    <div className="text-sm font-bold text-white">Chat Partner</div>
                    <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                      Online
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === (session?.user as any)?.id;
                  return (
                    <div key={i} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[70%] px-4 py-2.5 rounded-2xl text-sm",
                        isMe
                          ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20"
                          : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-slate-800 flex items-center gap-3">
                <input
                  className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button size="sm" className="h-10 w-10 p-0 rounded-xl">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
