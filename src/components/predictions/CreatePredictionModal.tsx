"use client";

import { useState } from "react";
import { Button, Input, GlassCard } from "@/components/ui";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreatePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePredictionModal({ isOpen, onClose, onSuccess }: CreatePredictionModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    explanation: "",
    category: "Technology",
    confidence: 70,
    targetDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({
          title: "",
          explanation: "",
          category: "Technology",
          confidence: 70,
          targetDate: "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg"
          >
            <GlassCard className="relative border-slate-700 shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">New Prediction</h2>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <Input
                  label="What's your forecast?"
                  placeholder="e.g. AI will pass the Turing test by 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />

                <div className="w-full">
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Explanation</label>
                  <textarea
                    className="w-full h-32 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none"
                    placeholder="Provide details and evidence for your prediction..."
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Resolution Date</label>
                    <input
                      type="date"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Confidence ({formData.confidence}%)</label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      className="w-full h-2 mt-4 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      value={formData.confidence}
                      onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full h-12 text-base" isLoading={isLoading}>
                    Broadcast Prediction
                  </Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
