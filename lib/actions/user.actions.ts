import { connectToMongoDB } from "@/database/mongoose";

export const getAllUsersForNewsDeliveryEmail = async () => {
	try {
		const mongoose = await connectToMongoDB();
		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection failed");
		}
		const users = await db.collection("user").find(
			{ email: { $exists: true, $ne: null } },
			{ projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }).toArray();

		console.log('users', users);
		return users.filter((user) => user.email && user.name).map((user) => (
			{ id: user.id || user._id.toString() || "", email: user.email, name: user.name }
		));
	} catch (error) {
		console.error("Error fetching all users for news delivery email:", error);
		return [];
	}
}