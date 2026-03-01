import connectDB from "../../../lib/db.js";
import User from "../../../models/User.js";
import { requireAuth } from "../../../lib/auth.js";
import { requireRole } from "../../../lib/roles.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = await requireAuth(req, res);

  if (auth.error) {
    return res.status(401).json({ error: auth.error });
  }

  const roleCheck = requireRole("admin")(req, res, auth.user);

  if (roleCheck.error) {
    return res.status(403).json({ error: roleCheck.error });
  }

  const users = await User.find().select("-password -__v");

  return res.status(200).json({ users });
}