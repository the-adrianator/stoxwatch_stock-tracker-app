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

	authInstance = betterAuth({
		database: mongodbAdapter(db as Db),
		secret,
		baseURL,
		emailAndPassword: {
			enabled: true,
			disableSignUp: false,
			requireEmailVerification: false,
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

export const auth = await getAuth();