import { requireAuth } from "../../lib/auth.js";

export default async function handler(req, res) {
  const auth = await requireAuth(req, res);

  if (auth.error) {
    return res.status(401).json({ error: auth.error });
  }

  return res.status(200).json({
    user: auth.user,
  });
}