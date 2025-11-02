import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { authPromise } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { checkWatchlistStatus } from "@/lib/actions/watchlist.actions";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

const baseScriptUrl =
  "https://s3.tradingview.com/external-embedding/embed-widget-";

const StockDetails = async ({ params }: StockDetailsPageProps) => {
  const { symbol } = await params;
  const symbolUpper = symbol.toUpperCase();

  // Get user session
  const auth = await authPromise;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Check if stock is in watchlist
  const isInWatchlist = session?.user?.email
    ? await checkWatchlistStatus(session.user.email, symbolUpper)
    : false;

  return (
    <div className="min-h-screen w-full px-4 py-6 md:px-6 lg:px-8">
      {/* Page Header */}
      {/* <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">{symbolUpper}</h1>
        <p className="text-gray-400">Stock Details & Analysis</p>
      </div> */}

      {/* 2-Column Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Symbol Widget */}
          <TradingViewWidget
            // title="Symbol Overview"
            scriptUrl={`${baseScriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbolUpper)}
            height={170}
            classname="custom-chart"
          />

          {/* Candle Chart Widget */}
          <TradingViewWidget
            title="Advanced Chart"
            scriptUrl={`${baseScriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbolUpper)}
            height={600}
            classname="custom-chart"
          />

          {/* Baseline Widget */}
          <TradingViewWidget
            title="Baseline Chart"
            scriptUrl={`${baseScriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbolUpper)}
            height={600}
            classname="custom-chart"
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Watchlist Button */}
          <div className="w-full">
            <WatchlistButton
              symbol={symbolUpper}
              company={symbolUpper}
              isInWatchlist={isInWatchlist}
              type="button"
            />
          </div>

          {/* Technical Analysis Widget */}
          <TradingViewWidget
            title="Technical Analysis"
            scriptUrl={`${baseScriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbolUpper)}
            height={400}
            classname="custom-chart"
          />

          {/* Company Profile Widget */}
          <TradingViewWidget
            title="Company Profile"
            scriptUrl={`${baseScriptUrl}symbol-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbolUpper)}
            height={440}
            classname="custom-chart"
          />

          {/* Company Financials Widget */}
          <TradingViewWidget
            title="Financial Statements"
            scriptUrl={`${baseScriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbolUpper)}
            height={464}
            classname="custom-chart"
          />
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
