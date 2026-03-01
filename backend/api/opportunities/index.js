import connectDB from "../../lib/db.js";
import Opportunity from "../../models/opportunity.js";
import { requireAuth } from "../../lib/auth.js";
import { requireRole } from "../../lib/roles.js";
import { paginate } from "../../lib/paginate.js";

export default async function handler(req, res) {
  await connectDB();
  if (req.method === "GET") {
    const search = req.query.search;
  
    let filter = {};
  
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }
  
    const result = await paginate(Opportunity, filter, req.query, {
      sort: { createdAt: -1 },
    });

    await Opportunity.populate(result.data, {
      path: "postedBy",
      select: "name email role",
    });
  
    return res.status(200).json(result);
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