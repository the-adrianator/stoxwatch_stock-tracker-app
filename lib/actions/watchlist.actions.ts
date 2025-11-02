'use server';

import { connectToMongoDB } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

export const getWatchlistSymbolsByEmail = async (
  email: string
): Promise<string[]> => {
  try {
    const mongoose = await connectToMongoDB();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Find user by email
    const user = await db.collection('user').findOne({ email });
    if (!user) {
      return [];
    }

    // Get user ID (try id field first, then _id)
    const userId = user.id || user._id?.toString();
    if (!userId) {
      return [];
    }

    // Query watchlist for this user
    const watchlistItems = await Watchlist.find({ userId })
      .select('symbol')
      .lean();

    return watchlistItems.map((item) => item.symbol);
  } catch (error) {
    console.error(
      `Error fetching watchlist symbols for email ${email}:`,
      error
    );
    return [];
  }
};

export const checkWatchlistStatus = async (
  email: string,
  symbol: string
): Promise<boolean> => {
  try {
    const mongoose = await connectToMongoDB();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Find user by email
    const user = await db.collection('user').findOne({ email });
    if (!user) {
      return false;
    }

    // Get user ID
    const userId = user.id || user._id?.toString();
    if (!userId) {
      return false;
    }

    // Check if symbol exists in watchlist
    const exists = await Watchlist.exists({ userId, symbol: symbol.toUpperCase() });
    return !!exists;
  } catch (error) {
    console.error(
      `Error checking watchlist status for ${symbol}:`,
      error
    );
    return false;
  }
};

export const addToWatchlist = async (
  email: string,
  symbol: string,
  company: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const mongoose = await connectToMongoDB();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Find user by email
    const user = await db.collection('user').findOne({ email });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Get user ID
    const userId = user.id || user._id?.toString();
    if (!userId) {
      return { success: false, message: 'Invalid user ID' };
    }

    // Check if already exists
    const exists = await Watchlist.exists({ userId, symbol: symbol.toUpperCase() });
    if (exists) {
      return { success: false, message: 'Stock already in watchlist' };
    }

    // Add to watchlist
    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date(),
    });

    return { success: true, message: 'Added to watchlist' };
  } catch (error) {
    console.error(`Error adding ${symbol} to watchlist:`, error);
    return { success: false, message: 'Failed to add to watchlist' };
  }
};

export const removeFromWatchlist = async (
  email: string,
  symbol: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const mongoose = await connectToMongoDB();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Find user by email
    const user = await db.collection('user').findOne({ email });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Get user ID
    const userId = user.id || user._id?.toString();
    if (!userId) {
      return { success: false, message: 'Invalid user ID' };
    }

    // Remove from watchlist
    const result = await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });

    if (result.deletedCount === 0) {
      return { success: false, message: 'Stock not found in watchlist' };
    }

    return { success: true, message: 'Removed from watchlist' };
  } catch (error) {
    console.error(`Error removing ${symbol} from watchlist:`, error);
    return { success: false, message: 'Failed to remove from watchlist' };
  }
};
