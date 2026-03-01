import connectDB from "../../lib/db.js";
import User from "../../models/User.js";

export default async function handler(req, res) {
  const { id } = req.query;

  await connectDB();

  const user = await User.findById(id).select(
    "name email bio department graduationYear skills profileImage role"
  );

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ user });
}