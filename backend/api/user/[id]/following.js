import connectDB from "../../../../lib/db.js";
import User from "../../../../models/User.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDB();

  const { id } = req.query;

  const user = await User.findById(id)
    .populate("following", "name"); 

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ followers: user.followers });
}