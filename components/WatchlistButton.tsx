"use client";

import { useState, useTransition } from "react";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      if (isInWatchlist) {
        // Remove from watchlist
        const result = await removeFromWatchlist(symbol);

        if (result.success) {
          setIsInWatchlist(false);
          toast.success(result.message);
          onWatchlistChange?.(symbol, false);
          // Refresh server data to update watchlist page
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } else {
        // Add to watchlist
        const result = await addToWatchlist(symbol, company);

        if (result.success) {
          setIsInWatchlist(true);
          toast.success(result.message);
          onWatchlistChange?.(symbol, true);
          // Refresh server data to update watchlist page
          router.refresh();
        } else {
          toast.error(result.message);
        }
      }
    });
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
      className={`w-full ${
        isInWatchlist ? "watchlist-remove" : "watchlist-btn"
      }`}
    >
      {isInWatchlist ? (
        <Trash2 className="size-4" />
      ) : (
        <Star className="size-4" fill="none" />
      )}
      {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    </Button>
  );
};

export default WatchlistButton;
