import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import WatchlistCard from "@/components/WatchlistCard";
import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const WatchlistPage = async () => {
  const watchlist = await getUserWatchlist();

  return (
    <div className="min-h-screen w-full px-4 py-6 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">My Watchlist</h1>
        <p className="text-gray-400">
          Track your favorite stocks and stay updated with their performance
        </p>
      </div>

      {/* Empty State */}
      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-gray-800/30 rounded-full p-6 mb-6">
            <Star className="size-12 text-gray-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-100 mb-2">
            Your watchlist is empty
          </h2>
          <p className="text-gray-400 text-center mb-8 max-w-md">
            Start tracking stocks by adding them to your watchlist. Use the
            search feature to find stocks and click the star icon to add them.
          </p>
          <Link href="/">
            <Button variant="default" className="gap-2">
              <Star className="size-4" />
              Browse Stocks
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Tracking{" "}
              <span className="font-semibold text-gray-100">
                {watchlist.length}
              </span>{" "}
              {watchlist.length === 1 ? "stock" : "stocks"}
            </p>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchlist.map((item) => (
              <WatchlistCard
                key={item.symbol}
                symbol={item.symbol}
                company={item.company}
                addedAt={item.addedAt}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WatchlistPage;
