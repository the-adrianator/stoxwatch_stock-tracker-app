"use client";

import { useState, useTransition } from "react";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist: initialIsInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
  const [isPending, startTransition] = useTransition();

  const handleToggleWatchlist = async (userEmail: string) => {
    startTransition(async () => {
      if (isInWatchlist) {
        // Remove from watchlist
        const result = await removeFromWatchlist(userEmail, symbol);

        if (result.success) {
          setIsInWatchlist(false);
          toast.success(result.message);
          onWatchlistChange?.(symbol, false);
        } else {
          toast.error(result.message);
        }
      } else {
        // Add to watchlist
        const result = await addToWatchlist(userEmail, symbol, company);

        if (result.success) {
          setIsInWatchlist(true);
          toast.success(result.message);
          onWatchlistChange?.(symbol, true);
        } else {
          toast.error(result.message);
        }
      }
    });
  };

  // Get user email from session (you'll need to import this from your auth)
  const handleClick = async () => {
    // For now, we'll need to get the user email from the session
    // This is a placeholder - you'll need to implement proper auth session retrieval
    try {
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      if (!session?.user?.email) {
        toast.error("Please sign in to manage your watchlist");
        return;
      }

      await handleToggleWatchlist(session.user.email);
    } catch (error) {
      toast.error("Failed to update watchlist");
      console.error("Watchlist error:", error);
    }
  };

  if (type === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={isPending}
        className="text-gray-400 hover:text-yellow-500 transition-colors"
      >
        {showTrashIcon && isInWatchlist ? (
          <Trash2 className="size-5" />
        ) : (
          <Star
            className="size-5"
            fill={isInWatchlist ? "currentColor" : "none"}
          />
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={isInWatchlist ? "outline" : "default"}
      className="w-full watchlist-btn"
    >
      <Star className="size-4" fill={isInWatchlist ? "currentColor" : "none"} />
      {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    </Button>
  );
};

export default WatchlistButton;
