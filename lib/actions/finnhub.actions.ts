'use server';

import { cache } from 'react';
import {
  getDateRange,
  validateArticle,
  formatArticle,
} from '@/lib/utils';
import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

const fetchJSON = async <T>(
  url: string,
  revalidateSeconds?: number
): Promise<T> => {
  const cacheOptions: RequestInit & { next?: { revalidate: number } } = revalidateSeconds
    ? {
			cache: 'force-cache' as const, next: { revalidate: revalidateSeconds },
      }
    : { cache: 'no-store' as const };

  const response = await fetch(url, cacheOptions);

  if (!response.ok) {
		const text = await response.text().catch(() => '');
    throw new Error(`HTTP error! status: ${response.status} - ${text}`);
  }

  return await response.json() as T;
};

export { fetchJSON };

export const getNews = async (symbols?: string[]): Promise<MarketNewsArticle[]> => {
  try {
    if (!FINNHUB_API_KEY) {
      throw new Error('FINNHUB_API_KEY is not set');
    }

    const dateRange = getDateRange(5);
    const { from, to } = dateRange;

    if (symbols && symbols.length > 0) {
      // Clean and uppercase symbols
      const cleanedSymbols = symbols
        .map((s) => s.trim().toUpperCase())
        .filter((s) => s.length > 0);

      if (cleanedSymbols.length === 0) {
        // Fallback to general news if no valid symbols
        return getGeneralMarketNews();
      }

      // Round-robin through symbols, max 6 articles
      const maxRounds = 6;
      const articles: MarketNewsArticle[] = [];
      const seenIds = new Set<string | number>();

      for (let round = 0; round < maxRounds; round++) {
        const symbolIndex = round % cleanedSymbols.length;
        const symbol = cleanedSymbols[symbolIndex];

        try {
          const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
          const data: RawNewsArticle[] = await fetchJSON(url) as RawNewsArticle[];

          // Find first valid article we haven't seen yet
          const validArticle = data?.find(
            (article) =>
              validateArticle(article) && !seenIds.has(article.id)
          );

          if (validArticle) {
            seenIds.add(validArticle.id);
            const formatted = formatArticle(validArticle, true, symbol, round);
            articles.push(formatted);
          }
        } catch (error) {
          console.error(`Error fetching news for ${symbol}:`, error);
          // Continue to next symbol
        }

        // Stop if we have enough articles
        if (articles.length >= maxRounds) {
          break;
        }
      }

      // Sort by datetime and return
      return articles.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
    } else {
      // No symbols provided, fetch general market news
      return getGeneralMarketNews();
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news');
  }
};

const getGeneralMarketNews = async (): Promise<MarketNewsArticle[]> => {
  try {
    const url = `${FINNHUB_BASE_URL}/news?category=general&token=${FINNHUB_API_KEY}`;
    const data: RawNewsArticle[] = await fetchJSON(url) as RawNewsArticle[];

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Deduplicate by id, url, or headline
    const seenIds = new Set<string | number>();
    const seenUrls = new Set<string>();
    const seenHeadlines = new Set<string>();

    const uniqueArticles = data.filter((article) => {
      if (!validateArticle(article)) {
        return false;
      }

      const id = article.id;
      const url = article.url?.toLowerCase() || '';
      const headline = article.headline?.toLowerCase() || '';

      if (seenIds.has(id) || seenUrls.has(url) || seenHeadlines.has(headline)) {
        return false;
      }

      seenIds.add(id);
      seenUrls.add(url);
      seenHeadlines.add(headline);
      return true;
    });

    // Take top 6 articles
    const topArticles = uniqueArticles.slice(0, 6);

    // Format and sort by datetime
    return topArticles
      .map((article, index) => formatArticle(article, false, undefined, index))
      .sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
  } catch (error) {
    console.error('Error fetching general market news:', error);
    return [];
  }
};

export const searchStocks = cache(async (query?: string): Promise<StockWithWatchlistStatus[]> => {
  try {
    const token = process.env.FINNHUB_API_KEY;
    if (!token) {
      // If no token, log and return empty to avoid throwing per requirements
      console.error('Error in stock search:', new Error('FINNHUB API key is not configured'));
      return [];
    }

    const trimmed = typeof query === 'string' ? query.trim() : '';

    let results: FinnhubSearchResult[] = [];

    if (!trimmed) {
      // Fetch top 10 popular symbols' profiles
      type ProfileResponse = { name?: string; ticker?: string; exchange?: string };
      const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
      const profiles = await Promise.all(
        top.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
            // Revalidate every hour
            const profile = await fetchJSON<ProfileResponse>(url, 3600);
            return { sym, profile };
          } catch (e) {
            console.error('Error fetching profile2 for', sym, e);
            return { sym, profile: null };
          }
        })
      );

      results = profiles
        .map(({ sym, profile }) => {
          const symbol = sym.toUpperCase();
          const name: string | undefined = profile?.name || profile?.ticker || undefined;
          const exchange: string | undefined = profile?.exchange || undefined;
          if (!name) return undefined;
          const r: FinnhubSearchResult & { __exchange?: string } = {
            symbol,
            description: name,
            displaySymbol: symbol,
            type: 'Common Stock',
            __exchange: exchange, // internal only
          };
          return r;
        })
        .filter((x): x is FinnhubSearchResult => Boolean(x));
    } else {
      const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
      const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
      results = Array.isArray(data?.result) ? data.result : [];
    }

    const extractExchange = (value?: string) => {
      if (!value) return undefined;
      const separators = ['.', ':'];
      for (const separator of separators) {
        if (value.includes(separator)) {
          const part = value.split(separator).pop();
          if (part && part !== value) {
            return part.toUpperCase();
          }
        }
      }
      return undefined;
    };

    const mapped: StockWithWatchlistStatus[] = results
      .map((r) => {
        const upper = (r.symbol || '').toUpperCase();
        const name = r.description || upper;
        const exchangeFromProfile = (r as FinnhubSearchResult & { __exchange?: string }).__exchange;
        const exchange =
          exchangeFromProfile ??
          extractExchange(r.symbol) ??
          extractExchange(r.displaySymbol) ??
          'US';
        const type = r.type || 'Stock';
        const item: StockWithWatchlistStatus = {
          symbol: upper,
          name,
          exchange,
          type,
          isInWatchlist: false,
        };
        return item;
      })
      .slice(0, 15);

    return mapped;
  } catch (err) {
    console.error('Error in stock search:', err);
    return [];
  }
});

