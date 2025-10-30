import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToMongoDB } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";
import { Db } from "mongodb";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
  if (authInstance) return authInstance;

  const mongoose = await connectToMongoDB();
  const db = mongoose.connection.db;
  
	if (!db) throw new Error("Failed to connect to MongoDB");

  // Validate critical env vars BEFORE use
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("BETTER_AUTH_SECRET environment variable is required but was not provided.");
  const baseURL = process.env.BETTER_AUTH_URL;
  if (!baseURL) throw new Error("BETTER_AUTH_URL environment variable is required but was not provided.");

  // Determine email verification requirement (true in prod or via feature flag)
  const requireEmailVerification = process.env.NODE_ENV === 'production' || process.env.FEATURE_FLAG_EMAIL_VERIFICATION === 'true';

	authInstance = betterAuth({
		database: mongodbAdapter(db as Db),
		secret,
		baseURL,
		emailAndPassword: {
			enabled: true,
			disableSignUp: false,
			// Enable verification for prod/flag, false for dev/local.
			requireEmailVerification,
			minimumPasswordLength: 8,
			maximumPasswordLength: 64,
			autoSignIn: true,
		},
		plugins: [
			nextCookies(),
		],
	});

	return authInstance;
}

export const authPromise = getAuth();
export async function getAuthInstance() {
  return getAuth();
}
// Optionally: allow direct but unsafe sync access to the singleton
export function getAuthSync() {
  if (!authInstance) throw new Error('Auth has not been initialized yet. Call and await getAuth() first.');
  return authInstance;
}