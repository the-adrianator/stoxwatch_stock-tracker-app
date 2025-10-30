import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

declare global {
  var mongooseCache: {
		conn: typeof mongoose | null;
		promise: Promise<typeof mongoose> | null;
	}
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToMongoDB = async () => {
	if (!MONGODB_URI) throw new Error("MONGO_URI must be set in the environment variables");

	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI, {
			bufferCommands: false,
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (error) {
		cached.promise = null;
		throw error;
	}

	// redact credentials if wanting to show any URI info, else just log status and env
	let uriInfo = '';
	if (MONGODB_URI) {
		// Use regex to redact credentials
		uriInfo = MONGODB_URI.replace(/(mongodb(?:\+srv)?:\/\/)(.*?:.*?@)/, '$1****:****@');
	}
	// You may opt to log the redacted URI, but usually env+status is sufficient.
	console.log(`Connected to MongoDB [${process.env.NODE_ENV}]${uriInfo ? ` - ${uriInfo}` : ''}`);

	return cached.conn;
}