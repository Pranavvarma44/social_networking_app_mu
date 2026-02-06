import User from "../models/User.js";
import connectDB from "../lib/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    res.status(200).json({ status: "DB connected successfully" });
  } catch (error) {
    console.error("Health route error:", error);
    res.status(500).json({ error: error.message });
  }
}