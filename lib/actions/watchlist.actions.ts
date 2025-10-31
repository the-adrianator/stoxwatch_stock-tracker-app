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

