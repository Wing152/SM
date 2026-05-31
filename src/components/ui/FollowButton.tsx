"use client";
import { useState } from "react";
import { Button } from "./index";
import { UserPlus, UserMinus } from "lucide-react";
interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  className?: string;
}
export function FollowButton({ userId, initialIsFollowing, className }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const toggleFollow = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      });
      if (res.ok) setIsFollowing(!isFollowing);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button variant={isFollowing ? "outline" : "primary"} size="sm" className={className} onClick={toggleFollow} isLoading={isLoading}>
      {isFollowing ? (<><UserMinus className="w-3.5 h-3.5 mr-1.5" />Unfollow</>) : (<><UserPlus className="w-3.5 h-3.5 mr-1.5" />Follow</>)}
    </Button>
  );
}
