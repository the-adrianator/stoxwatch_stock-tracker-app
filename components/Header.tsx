import Image from "next/image";
import Link from "next/link";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";

const Header = async ({ user }: { user: User }) => {
  const [stocks, watchlistSymbols] = await Promise.all([
    searchStocks(),
    getWatchlistSymbolsByEmail(user.email),
  ]);

  // Enrich stocks with watchlist status
  const initialStocks = stocks.map((stock) => ({
    ...stock,
    isInWatchlist: watchlistSymbols.includes(stock.symbol),
  }));

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>

        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>

        <UserDropdown user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
};

export default Header;
