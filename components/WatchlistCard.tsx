"use client";

import { useState, useTransition } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";
import { SYMBOL_INFO_WIDGET_CONFIG } from "@/lib/constants";
import { useRouter } from "next/navigation";

const baseScriptUrl =
  "https://s3.tradingview.com/external-embedding/embed-widget-";

interface WatchlistCardProps {
  symbol: string;
  company: string;
  addedAt: Date;
  onRemove?: (symbol: string) => void;
}

const WatchlistCard = ({
  symbol,
  company,
  addedAt,
  onRemove,
}: WatchlistCardProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      setIsRemoving(true);
      const result = await removeFromWatchlist(symbol);

      if (result.success) {
        toast.success(result.message);
        onRemove?.(symbol);
        // Refresh server data to update the page
        router.refresh();
      } else {
        toast.error(result.message);
        setIsRemoving(false);
      }
    });
  };

  const handleCardClick = () => {
    router.push(`/stocks/${symbol}`);
  };

  const formattedDate = new Date(addedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (isRemoving) {
    return null;
  }

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-[#0F0F0F] border border-gray-800 rounded-lg p-4 hover:border-yellow-500/50 transition-all cursor-pointer"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100">{symbol}</h3>
          <p className="text-sm text-gray-400 truncate">{company}</p>
          <p className="text-xs text-gray-500 mt-1">Added {formattedDate}</p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleRemove}
          disabled={isPending}
          className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors relative z-10"
          aria-label="Remove from watchlist"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* TradingView Widget */}
      <div className="mt-4 pointer-events-none">
        <TradingViewWidget
          scriptUrl={`${baseScriptUrl}symbol-info.js`}
          config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
          height={170}
          classname="custom-chart"
        />
      </div>
    </div>
  );
};

export default WatchlistCard;
