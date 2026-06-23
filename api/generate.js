import { generateComment } from "../lib/actions.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  const { author, postText } = req.body ?? {};
  if (!author && !postText) {
    res.status(400).json({ error: "author or postText required" });
    return;
  }

  try {
    const comment = await generateComment({ author, postText });
    res.json({ comment });
  } catch (e) {
    res.status(500).json({ error: String(e?.message ?? e) });
  }
}
