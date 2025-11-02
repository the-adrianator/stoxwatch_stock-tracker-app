"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Loader2, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";

export function SearchCommand({
  renderAs = "button",
  label = "Add Stock",
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks.slice(0, 10);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  const handleSearch = useCallback(async () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return setStocks(initialStocks);

    setLoading(true);
    try {
      const response = await fetch("/api/stocks/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Failed to search stocks");
      }

      const stocks = await response.json();
      setStocks(stocks);
    } catch (error) {
      console.error("Error searching stocks:", error);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, initialStocks]);

  const debouncedSearch = useDebounce(handleSearch, 500);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, debouncedSearch]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  };

  const handleToggleWatchlist = (
    e: React.MouseEvent,
    stock: StockWithWatchlistStatus
  ) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      if (stock.isInWatchlist) {
        // Remove from watchlist
        const result = await removeFromWatchlist(stock.symbol);

        if (result.success) {
          toast.success(result.message);
          // Update local state
          setStocks((prevStocks) =>
            prevStocks.map((s) =>
              s.symbol === stock.symbol ? { ...s, isInWatchlist: false } : s
            )
          );
          // Refresh server data to update watchlist page
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } else {
        // Add to watchlist
        const result = await addToWatchlist(stock.symbol, stock.name);

        if (result.success) {
          toast.success(result.message);
          // Update local state
          setStocks((prevStocks) =>
            prevStocks.map((s) =>
              s.symbol === stock.symbol ? { ...s, isInWatchlist: true } : s
            )
          );
          // Refresh server data to update watchlist page
          router.refresh();
        } else {
          toast.error(result.message);
        }
      }
    });
  };

  return (
    <>
      {renderAs === "text" ? (
        <span className="search-text" onClick={() => setOpen(true)}>
          {label}
        </span>
      ) : (
        <Button
          variant="outline"
          className="search-btn"
          onClick={() => setOpen(true)}
        >
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="search-dialog"
      >
        <div className="search-field">
          <CommandInput
            placeholder="Search stocks..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="search-input"
          />
          {loading && <Loader2 className="search-loader" />}
        </div>
        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">
              Loading stocks...
            </CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? "No stocks found." : "No stocks available."}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? "Search results" : "Popular stocks"}{" "}
                {`(${displayStocks?.length || 0})`}
              </div>
              {displayStocks.map((stock, i) => (
                <li
                  key={`${stock.symbol}-${stock.exchange}-${i}`}
                  className="search-item"
                >
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    className="search-item-link"
                    onClick={() => handleSelectStock()}
                  >
                    <TrendingUp className="size-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="search-item-name">{stock.name}</div>
                      <div className="text-sm text-gray-500 uppercase">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleToggleWatchlist(e, stock)}
                      disabled={isPending}
                      className="text-gray-400 hover:text-yellow-500 transition-colors disabled:opacity-50"
                      aria-label={
                        stock.isInWatchlist
                          ? "Remove from watchlist"
                          : "Add to watchlist"
                      }
                    >
                      <Star
                        className="size-5"
                        fill={stock.isInWatchlist ? "currentColor" : "none"}
                      />
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
