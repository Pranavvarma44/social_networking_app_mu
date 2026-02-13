import jwt from "jsonwebtoken";
import User from "../models/User.js";
import connectDB from "./db.js";

export async function requireAuth(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized" };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    const user = await User.findById(decoded.userId);

    if (!user) {
      return { error: "User not found" };
    }

    return { user };
  } catch (err) {
    return { error: "Invalid token" };
  }
}