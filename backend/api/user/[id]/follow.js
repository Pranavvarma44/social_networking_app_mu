import connectDB from "../../../../lib/db.js";
import User from "../../../../models/User.js";
import { requireAuth } from "../../../../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = await requireAuth(req, res);
  if (auth.error) {
    return res.status(401).json({ error: auth.error });
  }

  await connectDB();

  const { id } = req.query; 
  const currentUserId = auth.user.userId;

  if (id === currentUserId) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  const userToFollow = await User.findById(id);
  const currentUser = await User.findById(currentUserId);

  if (!userToFollow || !currentUser) {
    return res.status(404).json({ error: "User not found" });
  }

  if (currentUser.following.includes(id)) {
    return res.status(400).json({ error: "Already following" });
  }

  currentUser.following.push(id);
  userToFollow.followers.push(currentUserId);

  await currentUser.save();
  await userToFollow.save();

  return res.status(200).json({ message: "Followed successfully" });
}