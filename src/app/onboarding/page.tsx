"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard, Button } from "@/components/ui";

const INTERESTS = [
  "Technology", "Finance", "Sports", "Politics", "Science",
  "Startups", "AI", "Entertainment", "Health", "Climate"
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleInterest = (interest: string) => {
    setSelected(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleFinish = () => {
    // In a real app, save to user profile
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4">What interests you?</h1>
          <p className="text-slate-400">Select at least 3 categories to personalize your prediction feed.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {INTERESTS.map(interest => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`p-4 rounded-2xl border transition-all ${
                selected.includes(interest)
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              <span className="text-sm font-bold">{interest}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleFinish}
            disabled={selected.length < 3}
            className="px-12 py-4"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
