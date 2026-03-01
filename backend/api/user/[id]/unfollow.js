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

  const userToUnfollow = await User.findById(id);
  const currentUser = await User.findById(currentUserId);

  if (!userToUnfollow || !currentUser) {
    return res.status(404).json({ error: "User not found" });
  }

  currentUser.following = currentUser.following.filter(
    (userId) => userId.toString() !== id
  );

  userToUnfollow.followers = userToUnfollow.followers.filter(
    (userId) => userId.toString() !== currentUserId
  );

  await currentUser.save();
  await userToUnfollow.save();

  return res.status(200).json({ message: "Unfollowed successfully" });
}