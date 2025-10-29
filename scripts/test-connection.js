import dotenv from "dotenv";

// Load environment variables BEFORE importing mongoose
dotenv.config();

import { connectToMongoDB } from "../database/mongoose";

async function testConnection() {
  try {
    console.log("Testing database connection...");
    await connectToMongoDB();
    console.log("✅ Database connection successful!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}

testConnection();
