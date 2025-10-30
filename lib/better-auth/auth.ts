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

	authInstance = betterAuth({
		database: mongodbAdapter(db as Db),

		secret: process.env.BETTER_AUTH_SECRET,
		baseURL: process.env.BETTER_AUTH_URL,
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