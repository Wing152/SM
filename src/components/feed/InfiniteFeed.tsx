"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PredictionCard } from "@/components/predictions/PredictionCard";
import { Loader2 } from "lucide-react";

export function InfiniteFeed() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const url = `/api/feed${cursor ? `?cursor=${cursor}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();

      setPredictions(prev => [...prev, ...data.items]);
      setCursor(data.nextCursor);
      if (!data.nextCursor) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMore();
  }, []);

  useEffect(() => {
    if (inView && hasMore) {
      fetchMore();
    }
  }, [inView]);

  return (
    <div className="w-full">
      <div className="space-y-4">
        {predictions.map((p) => (
          <PredictionCard key={p.id} prediction={p} />
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {!hasMore && predictions.length > 0 && (
        <div className="py-12 text-center text-slate-500 text-sm font-medium">
          You've reached the end of the timeline.
        </div>
      )}

      {!loading && predictions.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-slate-400 text-lg mb-2 font-medium">No predictions found.</p>
          <p className="text-slate-600 text-sm">Be the first to forecast the future!</p>
        </div>
      )}
    </div>
  );
}
