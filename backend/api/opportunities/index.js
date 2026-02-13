import connectDB from "../../lib/db.js";
import Opportunity from "../../models/opportunity.js";
import { requireAuth } from "../../lib/auth.js";
import { requireRole } from "../../lib/roles.js";

export default async function handler(req, res) {
  await connectDB();
  if (req.method === "GET") {
    const opportunities = await Opportunity.find()
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ opportunities });
  }
  if (req.method === "POST") {
    const auth = await requireAuth(req, res);

    if (auth.error) {
      return res.status(401).json({ error: auth.error });
    }

    const roleCheck = requireRole("alumni", "admin")(
      req,
      res,
      auth.user
    );

    if (roleCheck.error) {
      return res.status(403).json({ error: roleCheck.error });
    }

    const { title, company, description, location, type } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        error: "Title, company and description are required",
      });
    }

    const opportunity = await Opportunity.create({
      title,
      company,
      description,
      location,
      type,
      postedBy: auth.user._id,
    });

    return res.status(201).json({
      message: "Opportunity created",
      opportunity,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}