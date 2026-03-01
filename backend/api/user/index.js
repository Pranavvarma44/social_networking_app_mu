import connectDB from "../../lib/db.js";
import User from "../../models/User.js";
import { paginate } from "../../lib/paginate.js";
import { requireAuth } from "../../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = await requireAuth(req, res);
  if (auth.error) {
    return res.status(401).json({ error: auth.error });
  }

  await connectDB();

  try {
    // 🔎 Optional search
    const search = req.query.search;

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const result = await paginate(User, filter, req.query, {
      select: "-password -__v",
      sort: { createdAt: -1 },
    });

    return res.status(200).json(result);

  } catch (error) {
    console.error("Users fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}