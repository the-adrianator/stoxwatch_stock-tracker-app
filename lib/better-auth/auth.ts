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
  
  // Resolve baseURL with Vercel support (handles preview/prod domains)
  // Priority: BETTER_AUTH_URL > VERCEL_URL (derived) > NEXT_PUBLIC_BASE_URL > NEXT_PUBLIC_APP_URL
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const baseURL = process.env.BETTER_AUTH_URL || vercelUrl || process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!baseURL) throw new Error("BETTER_AUTH_URL, NEXT_PUBLIC_BASE_URL, or NEXT_PUBLIC_APP_URL environment variable is required but was not provided.");

  // Email verification is controlled by explicit feature flag only
  const requireEmailVerification = process.env.FEATURE_FLAG_EMAIL_VERIFICATION === 'true';

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