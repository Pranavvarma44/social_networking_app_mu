import { requireAuth } from "../../lib/auth.js";
import connectDB from "../../lib/db.js";
import User from "../../models/User.js";

export default async function handler(req, res) {
  const auth = await requireAuth(req, res);
  console.log("Decoded user from JWT:", auth.user);

  if (auth.error) {
    return res.status(401).json({ error: auth.error });
  }

  await connectDB();

  const user=await User.findById(auth.user._id).select("-password -__v");

  return res.status(200).json({
    user
  });
}